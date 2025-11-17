import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Category {
  id: string
  name: string
  description: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
}

const PAGE_SIZE = 10

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchCategories = async (pageNum: number = 0, reset: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (fetchError) throw fetchError

      if (reset) {
        setCategories(data || [])
      } else {
        setCategories((prev) => [...prev, ...(data || [])])
      }

      setHasMore((data?.length || 0) === PAGE_SIZE)
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error(`Failed to fetch categories: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(0, true)
  }, [])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchCategories(nextPage, false)
    }
  }

  const createCategory = async (input: CreateCategoryInput) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: createError } = await supabase
        .from('categories')
        .insert([{ ...input, user_id: user.id }])
        .select()
        .single()

      if (createError) throw createError

      setCategories((prev) => [data, ...prev])
      toast.success('Category created successfully')
      return { data, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to create category: ${error.message}`)
      return { data: null, error }
    }
  }

  const updateCategory = async (id: string, input: UpdateCategoryInput) => {
    try {
      const { data, error: updateError } = await supabase
        .from('categories')
        .update(input)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? data : cat))
      )
      toast.success('Category updated successfully')
      return { data, error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to update category: ${error.message}`)
      return { data: null, error }
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      toast.success('Category deleted successfully')
      return { error: null }
    } catch (err) {
      const error = err as Error
      toast.error(`Failed to delete category: ${error.message}`)
      return { error }
    }
  }

  const refresh = () => {
    setPage(0)
    fetchCategories(0, true)
  }

  return {
    categories,
    loading,
    error,
    hasMore,
    loadMore,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh,
  }
}

