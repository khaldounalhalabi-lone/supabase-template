import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  category_id: z.string().uuid("Invalid category").min(1, "Category is required"),
})

export const orderItemSchema = z.object({
  product_id: z.string().uuid("Invalid product").min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
})

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type CategoryFormData = z.infer<typeof categorySchema>
export type ProductFormData = z.infer<typeof productSchema>
export type OrderFormData = z.infer<typeof orderSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

