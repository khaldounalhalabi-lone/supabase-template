import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProducts,
  type Product,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { productSchema, type ProductFormData } from "@/lib/validations";

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category_id: product?.category_id || "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category_id: product.category_id,
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (product) {
      const input: UpdateProductInput = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        category_id: data.category_id,
      };
      const { error } = await updateProduct(product.id, input);
      if (!error && onSuccess) {
        onSuccess();
      }
    } else {
      const input: CreateProductInput = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        category_id: data.category_id,
      };
      const { error } = await createProduct(input);
      if (!error && onSuccess) {
        reset();
        onSuccess();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {product ? "Update product details" : "Add a new product"}
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
                placeholder="Product name"
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
                placeholder="Product description"
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
              <FieldLabel htmlFor="price">Price</FieldLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                aria-invalid={errors.price ? "true" : "false"}
              />
              {errors.price && (
                <FieldDescription className="text-destructive">
                  {errors.price.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" aria-invalid={errors.category_id ? "true" : "false"}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && (
                <FieldDescription className="text-destructive">
                  {errors.category_id.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : product ? "Update" : "Create"}
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
  );
}
