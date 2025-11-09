import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { useCategories, type Category, type CreateCategoryInput, type UpdateCategoryInput } from "@/hooks/useCategories"
import { categorySchema, type CategoryFormData } from "@/lib/validations"

interface CategoryFormProps {
  category?: Category | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { createCategory, updateCategory } = useCategories()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
      })
    }
  }, [category, reset])

  const onSubmit = async (data: CategoryFormData) => {
    if (category) {
      const input: UpdateCategoryInput = {
        name: data.name,
        description: data.description || undefined,
      }
      const { error } = await updateCategory(category.id, input)
      if (!error && onSuccess) {
        onSuccess()
      }
    } else {
      const input: CreateCategoryInput = {
        name: data.name,
        description: data.description || undefined,
      }
      const { error } = await createCategory(input)
      if (!error && onSuccess) {
        reset()
        onSuccess()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Category" : "Create Category"}</CardTitle>
        <CardDescription>
          {category ? "Update category details" : "Add a new category"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Category name"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <FieldDescription className="text-destructive">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                type="text"
                placeholder="Category description"
                {...register("description")}
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (
                <FieldDescription className="text-destructive">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : category ? "Update" : "Create"}
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

