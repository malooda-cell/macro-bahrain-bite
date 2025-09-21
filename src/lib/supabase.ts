import { createClient } from '@supabase/supabase-js'

// Lovable's native Supabase integration provides these automatically
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          restaurant_id: string
          restaurant_name: string
          neighborhood: string
          cuisine: string
          price_band: string
          created_at: string
        }
        Insert: {
          restaurant_id: string
          restaurant_name: string
          neighborhood: string
          cuisine: string
          price_band: string
          created_at?: string
        }
        Update: {
          restaurant_id?: string
          restaurant_name?: string
          neighborhood?: string
          cuisine?: string
          price_band?: string
          created_at?: string
        }
      }
      dishes: {
        Row: {
          dish_id: string
          restaurant_id: string
          dish_name: string
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          ingredients: string
          created_at: string
        }
        Insert: {
          dish_id: string
          restaurant_id: string
          dish_name: string
          calories: number
          protein_g: number
          carbs_g: number
          fat_g: number
          ingredients: string
          created_at?: string
        }
        Update: {
          dish_id?: string
          restaurant_id?: string
          dish_name?: string
          calories?: number
          protein_g?: number
          carbs_g?: number
          fat_g?: number
          ingredients?: string
          created_at?: string
        }
      }
      meal_logs: {
        Row: {
          log_id: string
          user_id: string
          dish_id: string
          quantity: number
          logged_at: string
        }
        Insert: {
          log_id?: string
          user_id: string
          dish_id: string
          quantity?: number
          logged_at?: string
        }
        Update: {
          log_id?: string
          user_id?: string
          dish_id?: string
          quantity?: number
          logged_at?: string
        }
      }
    }
  }
}