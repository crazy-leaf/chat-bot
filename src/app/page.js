'use client'
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


export default function Home() {
  return (
      <QueryClientProvider client={queryClient}>
      {/* <ChatWidget /> */}
      <Index />
      {/* <ChatWidget /> */}
      </QueryClientProvider>
  );
}
