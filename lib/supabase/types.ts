export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          class_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          subject_id: string | null
          teacher_id: string
          title: string
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject_id?: string | null
          teacher_id: string
          title: string
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject_id?: string | null
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "teacher_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_students: {
        Row: {
          class_id: string
          id: string
          joined_at: string
          student_id: string
        }
        Insert: {
          class_id: string
          id?: string
          joined_at?: string
          student_id: string
        }
        Update: {
          class_id?: string
          id?: string
          joined_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "teacher_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          student_id: string
          subject_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          student_id: string
          subject_id?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          student_id?: string
          subject_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      curricula: {
        Row: {
          code: Database["public"]["Enums"]["curriculum_code"]
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["curriculum_code"]
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["curriculum_code"]
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_count: number
          due_date: string | null
          id: string
          student_id: string
          target_count: number
          title: string
          type: Database["public"]["Enums"]["goal_type"]
        }
        Insert: {
          created_at?: string
          current_count?: number
          due_date?: string | null
          id?: string
          student_id: string
          target_count: number
          title: string
          type: Database["public"]["Enums"]["goal_type"]
        }
        Update: {
          created_at?: string
          current_count?: number
          due_date?: string | null
          id?: string
          student_id?: string
          target_count?: number
          title?: string
          type?: Database["public"]["Enums"]["goal_type"]
        }
        Relationships: [
          {
            foreignKeyName: "goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_links: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_links_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_links_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          contact_preference:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          created_at: string
          curriculum_id: string | null
          full_name: string
          grade: number | null
          id: string
          invite_code: string
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          phone: string | null
          profession: string | null
          relationship_to_student:
            | Database["public"]["Enums"]["parent_relationship"]
            | null
          role: Database["public"]["Enums"]["user_role"]
          school_name: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          created_at?: string
          curriculum_id?: string | null
          full_name: string
          grade?: number | null
          id: string
          invite_code: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          phone?: string | null
          profession?: string | null
          relationship_to_student?:
            | Database["public"]["Enums"]["parent_relationship"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          school_name?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          contact_preference?:
            | Database["public"]["Enums"]["contact_preference"]
            | null
          created_at?: string
          curriculum_id?: string | null
          full_name?: string
          grade?: number | null
          id?: string
          invite_code?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          phone?: string | null
          profession?: string | null
          relationship_to_student?:
            | Database["public"]["Enums"]["parent_relationship"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          school_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          quiz_id: string
          score: number
          student_id: string
          total: number
        }
        Insert: {
          answers: Json
          completed_at?: string
          id?: string
          quiz_id: string
          score: number
          student_id: string
          total: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          student_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          choices: Json | null
          correct_index: number | null
          explanation: string | null
          id: string
          model_answer: string | null
          position: number
          prompt: string
          quiz_id: string
        }
        Insert: {
          choices?: Json | null
          correct_index?: number | null
          explanation?: string | null
          id?: string
          model_answer?: string | null
          position: number
          prompt: string
          quiz_id: string
        }
        Update: {
          choices?: Json | null
          correct_index?: number | null
          explanation?: string | null
          id?: string
          model_answer?: string | null
          position?: number
          prompt?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          student_id: string
          subject_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          student_id: string
          subject_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          student_id?: string
          subject_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plan_items: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          scheduled_date: string
          student_id: string
          subject_id: string | null
          title: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_date: string
          student_id: string
          subject_id?: string | null
          title: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          scheduled_date?: string
          student_id?: string
          subject_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_items_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_items_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          curriculum_id: string
          grade_max: number
          grade_min: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          curriculum_id: string
          grade_max: number
          grade_min: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          curriculum_id?: string
          grade_max?: number
          grade_min?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_classes: {
        Row: {
          class_code: string
          created_at: string
          id: string
          name: string
          teacher_id: string
        }
        Insert: {
          class_code: string
          created_at?: string
          id?: string
          name: string
          teacher_id: string
        }
        Update: {
          class_code?: string
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_class_by_code: {
        Args: { code: string }
        Returns: {
          joined_class_id: string
          joined_class_name: string
        }[]
      }
      link_child_by_invite_code: {
        Args: { code: string }
        Returns: {
          linked_full_name: string
          linked_student_id: string
        }[]
      }
    }
    Enums: {
      contact_preference: "email" | "phone" | "whatsapp"
      curriculum_code: "cbse" | "icse" | "isc" | "cambridge" | "telangana"
      goal_type: "weekly" | "monthly" | "subject" | "revision"
      learning_style:
        | "visual"
        | "step_by_step"
        | "real_world"
        | "story_based"
        | "activities"
        | "hands_on"
        | "beginner"
        | "advanced"
      message_role: "user" | "assistant"
      parent_relationship: "mother" | "father" | "guardian" | "other"
      quiz_type: "mcq" | "written"
      user_role: "student" | "parent" | "teacher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_preference: ["email", "phone", "whatsapp"],
      curriculum_code: ["cbse", "icse", "isc", "cambridge", "telangana"],
      goal_type: ["weekly", "monthly", "subject", "revision"],
      learning_style: [
        "visual",
        "step_by_step",
        "real_world",
        "story_based",
        "activities",
        "hands_on",
        "beginner",
        "advanced",
      ],
      message_role: ["user", "assistant"],
      parent_relationship: ["mother", "father", "guardian", "other"],
      quiz_type: ["mcq", "written"],
      user_role: ["student", "parent", "teacher"],
    },
  },
} as const
