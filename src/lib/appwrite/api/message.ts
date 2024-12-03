import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

export async function sendMessage(message: {
  sender_id: string;
  receiver_id: string;
  content: string;
  conversation_id: string;
}) {
  try {
    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: message.content,
        conversation_id: message.conversation_id,
      }
    );

    return newMessage;
  } catch (error) {
    console.error("Appwrite error :: sendMessage :: ", error);
    throw error;
  }
}

export async function getMessages(conversationId: string) {
  try {
    const messages = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.equal("conversation_id", conversationId),
        Query.orderAsc("$createdAt"),
        Query.limit(100),
      ]
    );

    if (!messages) throw new Error("Failed to fetch messages");

    return messages;
  } catch (error) {
    console.error("Appwrite error :: getMessages :: ", error);
    throw error;
  }
}

export async function getConversations(userId: string) {
  try {
    const conversations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.search("sender_id", userId), Query.orderDesc("$createdAt"), Query.limit(50)]
    );

    return conversations;
  } catch (error) {
    console.error("Appwrite error :: getConversations :: ", error);
    throw error;
  }
}
