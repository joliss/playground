export class Message {
  role: "system" | "user" | "assistant";
  content: string;

  constructor(role: "system" | "user" | "assistant", content: string) {
    this.role = role;
    this.content = content;
  }
}

export class Conversation {
  messages: Message[];

  constructor(messages: Message[] = []) {
    this.messages = messages;
  }
}
