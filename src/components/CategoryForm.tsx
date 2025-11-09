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
import { useCategories, type Category, type CreateCategoryInput, type UpdateCategoryInput } from "@/hooks/useCategories"

interface CategoryFormProps {
  category?: Category | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { createCategory, updateCategory } = useCategories()

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description || "")
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (category) {
      const input: UpdateCategoryInput = {
        name,
        description: description || undefined,
      }
      const { error } = await updateCategory(category.id, input)
      if (!error && onSuccess) {
        onSuccess()
      }
    } else {
      const input: CreateCategoryInput = {
        name,
        description: description || undefined,
      }
      const { error } = await createCategory(input)
      if (!error && onSuccess) {
        setName("")
        setDescription("")
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
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                type="text"
                placeholder="Category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <Field>
              <div className="flex gap-2">
                <Button type="submit">
                  {category ? "Update" : "Create"}
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

