export interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  messages?: ChatMessage[];
}