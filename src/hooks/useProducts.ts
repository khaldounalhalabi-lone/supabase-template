import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  user_id: string
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
  }
}

export interface CreateProductInput {
  name: string
  description?: string
  price: number
  category_id: string
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  category_id?: string
}

const PAGE_SIZE = 10

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = async (pageNum: number = 0, reset: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name)
        `)
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (fetchError) throw fetchError

      if (reset) {
        setProducts(data || [])
      } else {
        setProducts((prev) => [...prev, ...(data || [])])
      }

      setHasMore((data?.length || 0) === PAGE_SIZE)
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error(`Failed to fetch products: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(0, true)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage, false)
    }
  }

  const createProduct = async (input: CreateProductInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Validate product using edge function
      const { data: validationData, error: validationError } = await supabase.functions.invoke(
        'products',
        {
          body: input,
          method: 'POST',
        }
      )

      if (validationError) throw validationError
      if (validationData && !validationData.valid) {
        const errors = validationData.errors || ['Validation failed']
        throw new Error(errors.join(', '))
      }

      const { data, error: createError } = await supabase
        .from('products')
        .insert([{ ...input, user_id: user.id }])
        .select(`
          *,
          category:categories(id, name)
        `)
        .single();

      // supabase.functions.invoke('send-order-notification');

      if (createError) throw createError

      setProducts((prev) => [data, ...prev])
      toast.success('Product created successfully')
      return { data, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to create product: ${error.message}`)
      return { data: null, error }
    }
  }

  const updateProduct = async (id: string, input: UpdateProductInput) => {
    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(input)
        .eq('id', id)
        .select(`
          *,
          category:categories(id, name)
        `)
        .single()

      if (updateError) throw updateError

      setProducts((prev) =>
        prev.map((prod) => (prod.id === id ? data : prod))
      )
      toast.success('Product updated successfully')
      return { data, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to update product: ${error.message}`)
      return { data: null, error }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setProducts((prev) => prev.filter((prod) => prod.id !== id))
      toast.success('Product deleted successfully')
      return { error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to delete product: ${error.message}`)
      return { error }
    }
  }

  const refresh = () => {
    setPage(0)
    fetchProducts(0, true)
  }

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh,
  }
}

