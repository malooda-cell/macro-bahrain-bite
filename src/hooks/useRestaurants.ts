import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Restaurant {
  restaurant_id: string
  restaurant_name: string
  neighborhood: string
  cuisine: string
  price_band: string
}

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async (): Promise<Restaurant[]> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('restaurant_name')
      
      if (error) throw error
      return data || []
    }
  })
}

export const useRestaurant = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async (): Promise<Restaurant | null> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!restaurantId
  })
}