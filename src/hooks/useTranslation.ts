import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");

  const translate = async (queryDsl: string, version: string) => {
    if (!queryDsl.trim()) {
      toast.error("Please enter a Query DSL to translate");
      return;
    }

    // Extract JSON from input (skip the first line if it's the API endpoint)
    const lines = queryDsl.trim().split('\n');
    const firstLine = lines[0].trim();
    const hasEndpoint = /^(GET|POST|PUT|DELETE|HEAD|PATCH)\s+/i.test(firstLine);
    const jsonPart = hasEndpoint ? lines.slice(1).join('\n').trim() : queryDsl.trim();

    // Validate JSON if there's a body
    if (jsonPart) {
      try {
        JSON.parse(jsonPart);
      } catch {
        toast.error("Invalid JSON. Please check your Query DSL syntax.");
        return;
      }
    }

    setIsLoading(true);
    setOutput("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        toast.error("Session not ready. Please reload the page.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ queryDsl, version }),
        }
      );

      if (response.status === 401) {
        toast.error("Unauthorized. Please reload the page.");
        setIsLoading(false);
        return;
      }

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast.error("Usage limit reached. Please add credits.");
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to start translation");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setOutput(assistantContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      toast.success("Translation complete!");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { translate, isLoading, output, setOutput };
}
