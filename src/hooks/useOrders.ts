import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: {
    id: string
    name: string
  }
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface CreateOrderInput {
  total_amount: number
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: {
    product_id: string
    quantity: number
    price: number
  }[]
}

export interface UpdateOrderInput {
  total_amount?: number
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

const PAGE_SIZE = 10

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchOrders = async (pageNum: number = 0, reset: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            id,
            product_id,
            quantity,
            price,
            product:products(id, name)
          )
        `)
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (fetchError) throw fetchError

      if (reset) {
        setOrders(data || [])
      } else {
        setOrders((prev) => [...prev, ...(data || [])])
      }

      setHasMore((data?.length || 0) === PAGE_SIZE)
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error(`Failed to fetch orders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(0, true)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchOrders(nextPage, false)
    }
  }

  const createOrder = async (input: CreateOrderInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: input.total_amount,
          status: input.status || 'pending',
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = input.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Fetch the complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(
            id,
            product_id,
            quantity,
            price,
            product:products(id, name)
          )
        `)
        .eq('id', orderData.id)
        .single()

      if (fetchError) throw fetchError

      // Send notification using edge function
      try {
        await supabase.functions.invoke('notifications', {
          body: {
            type: 'order_created',
            order_id: orderData.id,
            total_amount: input.total_amount,
          },
          method: 'POST',
        })
      } catch (notificationError) {
        // Don't fail the order creation if notification fails
        console.error('Failed to send notification:', notificationError)
      }

      setOrders((prev) => [completeOrder, ...prev])
      toast.success('Order created successfully')
      return { data: completeOrder, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to create order: ${error.message}`)
      return { data: null, error }
    }
  }

  const updateOrder = async (id: string, input: UpdateOrderInput) => {
    try {
      const { data, error: updateError } = await supabase
        .from('orders')
        .update(input)
        .eq('id', id)
        .select(`
          *,
          order_items:order_items(
            id,
            product_id,
            quantity,
            price,
            product:products(id, name)
          )
        `)
        .single()

      if (updateError) throw updateError

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? data : order))
      )
      toast.success('Order updated successfully')
      return { data, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to update order: ${error.message}`)
      return { data: null, error }
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setOrders((prev) => prev.filter((order) => order.id !== id))
      toast.success('Order deleted successfully')
      return { error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to delete order: ${error.message}`)
      return { error }
    }
  }

  const refresh = () => {
    setPage(0)
    fetchOrders(0, true)
  }

  return {
    orders,
    loading,
    error,
    hasMore,
    loadMore,
    createOrder,
    updateOrder,
    deleteOrder,
    refresh,
  }
}

