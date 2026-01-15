import { Message } from "./message";
import { User } from "./user";

export interface ChatResponse {
  chatId: string;
  user: User;
  lastMessage: Message;
}
