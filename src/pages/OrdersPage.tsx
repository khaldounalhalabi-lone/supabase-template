import { useState } from "react"
import { OrdersList } from "@/components/OrdersList"
import { OrderForm } from "@/components/OrderForm"
import { Button } from "@/components/ui/button"

export function OrdersPage() {
  const [showOrderForm, setShowOrderForm] = useState(false)

  return (
    <div className="space-y-4">
      {showOrderForm ? (
        <OrderForm
          onSuccess={() => setShowOrderForm(false)}
          onCancel={() => setShowOrderForm(false)}
        />
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setShowOrderForm(true)}>Create Order</Button>
        </div>
      )}
      <OrdersList />
    </div>
  )
}

