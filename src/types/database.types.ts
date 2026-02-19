export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      vocabularies: {
        Row: {
          id: string
          user_id: string
          name: string
          word_count: number
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          word_count?: number
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          word_count?: number
          progress?: number
          created_at?: string
        }
      }
      words: {
        Row: {
          id: string
          vocabulary_id: string
          word: string
          phonetic: string | null
          meaning: string
          etymology: string | null
          example: string | null
          example_translation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vocabulary_id: string
          word: string
          phonetic?: string | null
          meaning: string
          etymology?: string | null
          example?: string | null
          example_translation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vocabulary_id?: string
          word?: string
          phonetic?: string | null
          meaning?: string
          etymology?: string | null
          example?: string | null
          example_translation?: string | null
          created_at?: string
        }
      }
      user_words: {
        Row: {
          id: string
          user_id: string
          word_id: string
          status: 'learning' | 'mastered'
          review_count: number
          last_reviewed: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          status?: 'learning' | 'mastered'
          review_count?: number
          last_reviewed?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          status?: 'learning' | 'mastered'
          review_count?: number
          last_reviewed?: string | null
          created_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          user_id: string
          vocabulary_id: string
          word_count: number
          test_type: 'choice' | 'fill'
          score: number | null
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          vocabulary_id: string
          word_count: number
          test_type: 'choice' | 'fill'
          score?: number | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          vocabulary_id?: string
          word_count?: number
          test_type?: 'choice' | 'fill'
          score?: number | null
          started_at?: string
          completed_at?: string | null
        }
      }
      test_results: {
        Row: {
          id: string
          test_id: string
          word_id: string
          user_answer: string | null
          correct_answer: string
          is_correct: boolean
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          word_id: string
          user_answer?: string | null
          correct_answer: string
          is_correct: boolean
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          word_id?: string
          user_answer?: string | null
          correct_answer?: string
          is_correct?: boolean
          created_at?: string
        }
      }
    }
  }
}
