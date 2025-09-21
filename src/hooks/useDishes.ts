import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Dish {
  dish_id: string
  restaurant_id: string
  dish_name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  ingredients: string
}

export const useDishes = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['dishes', restaurantId],
    queryFn: async (): Promise<Dish[]> => {
      let query = supabase.from('dishes').select('*').order('dish_name')
      
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  })
}

export const useDish = (dishId: string) => {
  return useQuery({
    queryKey: ['dish', dishId],
    queryFn: async (): Promise<Dish | null> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('dish_id', dishId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!dishId
  })
}