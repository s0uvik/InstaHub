import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { getConversations, getMessages, sendMessage } from "@/lib/appwrite/api/message";

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MESSAGES, conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useGetConversations = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CONVERSATIONS, userId],
    queryFn: () => getConversations(userId),
    enabled: !!userId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: {
      sender_id: string;
      receiver_id: string;
      content: string;
      conversation_id: string;
    }) => sendMessage(message),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MESSAGES, data.conversation_id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CONVERSATIONS],
      });
    },
  });
};
