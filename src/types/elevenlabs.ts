export interface ConversationMessage {
  role: 'user' | 'agent';
  message: string;
  tool_calls?: ToolCall[] | null;
  tool_results?: ToolResult[] | null;
  feedback?: any | null;
  time_in_call_secs: number;
  conversation_turn_metrics?: TurnMetrics | null;
}

export interface ToolCall {
  tool_call_id: string;
  name: string;
  parameters: Record<string, any>;
}

export interface ToolResult {
  tool_call_id: string;
  result: any;
  error?: string;
}

export interface TurnMetrics {
  convai_llm_service_ttfb?: {
    elapsed_time: number;
  };
  convai_llm_service_ttf_sentence?: {
    elapsed_time: number;
  };
}

export interface Conversation {
  conversation_id: string;
  agent_id: string;
  status: string;
  user_id?: string;
  transcript: ConversationMessage[];
  metadata: ConversationMetadata;
  analysis?: ConversationAnalysis;
  conversation_initiation_client_data?: any;
  messages?: Array<{ role: string; content: string }>;
  created_at?: string;
}

export interface ConversationMetadata {
  start_time_unix_secs: number;
  call_duration_secs: number;
  cost: number;
  deletion_settings?: {
    deletion_time_unix_secs: number;
    deleted_logs_at_time_unix_secs?: number | null;
    deleted_audio_at_time_unix_secs?: number | null;
    deleted_transcript_at_time_unix_secs?: number | null;
    delete_transcript_and_pii: boolean;
    delete_audio: boolean;
  };
  feedback?: {
    overall_score?: number | null;
    likes: number;
    dislikes: number;
  };
  authorization_method?: string;
  charging?: {
    dev_discount: boolean;
  };
  termination_reason?: string;
}

export interface ConversationAnalysis {
  evaluation_criteria_results?: Record<string, any>;
  data_collection_results?: Record<string, any>;
  call_successful: string;
  transcript_summary: string;
}

export interface ConversationListItem {
  conversation_id: string;
  agent_id: string;
  created_at: string;
  status?: string;
}

export interface ConversationListResponse {
  conversations: ConversationListItem[];
}

export interface ListConversationsOptions {
  limit?: number;
  offset?: number;
}
