export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      prayers: {
        Row: {
          id: string
          created_at: string | null
          title: string | null
          content: string | null
          category: string | null
          user_id: string | null
          is_answered: boolean | null
          is_weekly_challenge: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          title?: string | null
          content?: string | null
          category?: string | null
          user_id?: string | null
          is_answered?: boolean | null
          is_weekly_challenge?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string | null
          title?: string | null
          content?: string | null
          category?: string | null
          user_id?: string | null
          is_answered?: boolean | null
          is_weekly_challenge?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
