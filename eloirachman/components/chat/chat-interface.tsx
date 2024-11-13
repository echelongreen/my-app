"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { SendHorizontal, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useUser } from "@/lib/hooks/use-user";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
};

export function ChatInterface({
  projectId,
  initialMessages = [],
}: {
  projectId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = input;
    setInput("");

    try {
      // Add user message to UI immediately
      const newUserMessage = {
        id: crypto.randomUUID(),
        content: userMessage,
        role: "user" as const,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newUserMessage]);

      // Send message to server and get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, projectId }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      // Add AI response to UI
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: data.response,
          role: "assistant",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      // Remove the user message if there was an error
      setMessages((prev) =>
        prev.filter((msg) => msg.content !== userMessage)
      );
      setInput(userMessage); // Restore the input
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.role === "assistant" ? "flex-row" : "flex-row-reverse"
              )}
            >
              {message.role === "assistant" ? (
                <Avatar>
                  <AvatarFallback>AI</AvatarFallback>
                  <Bot className="h-10 w-10 p-2" />
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.user_metadata?.full_name}
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-50">
                  {format(new Date(message.created_at), "HH:mm")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your project documents..."
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={loading}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 