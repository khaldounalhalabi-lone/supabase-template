import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrders, type CreateOrderInput } from "@/hooks/useOrders"
import { useProducts } from "@/hooks/useProducts"
import { Plus, Trash2 } from "lucide-react"

interface OrderItemInput {
  product_id: string
  quantity: number
  price: number
}

export function OrderForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const [items, setItems] = useState<OrderItemInput[]>([
    { product_id: "", quantity: 1, price: 0 },
  ])
  const [status, setStatus] = useState<"pending" | "processing" | "shipped" | "delivered" | "cancelled">("pending")
  const { createOrder } = useOrders()
  const { products } = useProducts()

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItemInput, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Update price when product changes
    if (field === "product_id") {
      const product = products.find((p) => p.id === value)
      if (product) {
        newItems[index].price = product.price
      }
    }
    
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validItems = items.filter((item) => item.product_id && item.quantity > 0)
    if (validItems.length === 0) {
      alert("Please add at least one item to the order")
      return
    }

    const input: CreateOrderInput = {
      total_amount: calculateTotal(),
      status,
      items: validItems,
    }

    const { error } = await createOrder(input)
    if (!error && onSuccess) {
      setItems([{ product_id: "", quantity: 1, price: 0 }])
      setStatus("pending")
      onSuccess()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Order</CardTitle>
        <CardDescription>Add items to create a new order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Order Items</FieldLabel>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Select
                    value={item.product_id}
                    onValueChange={(value) => updateItem(index, "product_id", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Total Amount</FieldLabel>
              <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
            </Field>
            <Field>
              <div className="flex gap-2">
                <Button type="submit">Create Order</Button>
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

