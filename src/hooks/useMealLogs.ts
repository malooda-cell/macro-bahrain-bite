import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface MealLog {
  id: string
  user_id: string
  dish_id: string
  quantity: number
  logged_at: string
  meal_type?: string
  created_at?: string
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
      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
        throw new Error('Quantity must be a whole number between 1 and 5');
      }
      
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
        title: "Logged!",
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

export const useUpdateMealLog = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ logId, quantity }: { 
      logId: string
      quantity: number
    }) => {
      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
        throw new Error('Quantity must be a whole number between 1 and 5');
      }
      
      const { data, error } = await supabase
        .from('meal_logs')
        .update({ quantity })
        .eq('id', logId)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] })
      toast({
        title: "Updated",
        description: "Meal quantity updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update meal quantity",
        variant: "destructive"
      })
      console.error('Error updating meal log:', error)
    }
  })
}

export const useDeleteMealLog = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('meal_logs')
        .delete()
        .eq('id', logId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] })
      toast({
        title: "Deleted",
        description: "Meal removed from log",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive"
      })
      console.error('Error deleting meal log:', error)
    }
  })
}