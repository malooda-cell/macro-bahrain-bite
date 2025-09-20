import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface MealLog {
  log_id: string
  user_id: string
  dish_id: string
  quantity: number
  logged_at: string
}

export interface MealLogWithDish extends MealLog {
  dishes: {
    dish_name: string
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }
}

export const useMealLogs = (userId: string, date?: string) => {
  return useQuery({
    queryKey: ['mealLogs', userId, date],
    queryFn: async (): Promise<MealLogWithDish[]> => {
      let query = supabase
        .from('meal_logs')
        .select(`
          *,
          dishes (
            dish_name,
            calories,
            protein_g,
            carbs_g,
            fat_g
          )
        `)
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
      
      if (date) {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)
        
        query = query
          .gte('logged_at', startOfDay.toISOString())
          .lte('logged_at', endOfDay.toISOString())
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    enabled: !!userId
  })
}

export const useAddMealLog = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ dishId, userId, quantity = 1 }: { 
      dishId: string
      userId: string  
      quantity?: number
    }) => {
      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          dish_id: dishId,
          user_id: userId,
          quantity
        })
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] })
      toast({
        title: "Meal Added",
        description: "Successfully added to your daily log",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add meal to log",
        variant: "destructive"
      })
      console.error('Error adding meal log:', error)
    }
  })
}