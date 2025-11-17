import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { orderSchema, type OrderFormData } from "@/lib/validations"

export function OrderForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const { createOrder } = useOrders()
  const { products } = useProducts()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ product_id: "", quantity: 1, price: 0 }],
      status: "pending",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const watchedItems = watch("items")
  const watchedStatus = watch("status")

  const calculateTotal = () => {
    return watchedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  }

  const onSubmit = async (data: OrderFormData) => {
    const validItems = data.items.filter((item) => item.product_id && item.quantity > 0)
    
    const input: CreateOrderInput = {
      total_amount: calculateTotal(),
      status: data.status,
      items: validItems,
    }

    const { error } = await createOrder(input)
    if (!error && onSuccess) {
      reset()
      onSuccess()
    }
  }

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setValue(`items.${index}.price`, product.price)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Order</CardTitle>
        <CardDescription>Add items to create a new order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Order Items</FieldLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <Controller
                      name={`items.${index}.product_id`}
                      control={control}
                      render={({ field: productField }) => (
                        <Select
                          value={productField.value}
                          onValueChange={(value) => {
                            productField.onChange(value)
                            handleProductChange(index, value)
                          }}
                        >
                          <SelectTrigger className="flex-1" aria-invalid={errors.items?.[index]?.product_id ? "true" : "false"}>
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
                      )}
                    />
                    {errors.items?.[index]?.product_id && (
                      <FieldDescription className="text-destructive text-xs mt-1">
                        {errors.items[index]?.product_id?.message}
                      </FieldDescription>
                    )}
                  </div>
                  <div className="w-20">
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: quantityField }) => (
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          {...quantityField}
                          value={quantityField.value || ""}
                          onChange={(e) => quantityField.onChange(parseInt(e.target.value) || 1)}
                          aria-invalid={errors.items?.[index]?.quantity ? "true" : "false"}
                        />
                      )}
                    />
                    {errors.items?.[index]?.quantity && (
                      <FieldDescription className="text-destructive text-xs mt-1">
                        {errors.items[index]?.quantity?.message}
                      </FieldDescription>
                    )}
                  </div>
                  <div className="w-24">
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field: priceField }) => (
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          {...priceField}
                          value={priceField.value || ""}
                          onChange={(e) => priceField.onChange(parseFloat(e.target.value) || 0)}
                          aria-invalid={errors.items?.[index]?.price ? "true" : "false"}
                        />
                      )}
                    />
                    {errors.items?.[index]?.price && (
                      <FieldDescription className="text-destructive text-xs mt-1">
                        {errors.items[index]?.price?.message}
                      </FieldDescription>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.items && typeof errors.items === "object" && "root" in errors.items && (
                <FieldDescription className="text-destructive">
                  {errors.items.root?.message}
                </FieldDescription>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ product_id: "", quantity: 1, price: 0 })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
            </Field>
            <Field>
              <FieldLabel>Total Amount</FieldLabel>
              <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
            </Field>
            <Field>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Order"}
                </Button>
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

