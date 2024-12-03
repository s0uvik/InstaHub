import { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { client, appwriteConfig } from "@/lib/appwrite/config";
import { Models } from "appwrite";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useGetMessages, useSendMessage } from "@/lib/react-query/queriesAndMutations/message";
import UsersList from "@/components/shared/message/UsersList";
import ChatWindow from "@/components/shared/message/ChatWindow";
import MessageInput from "@/components/shared/message/MessageInput";
import RedirectToLogin from "@/components/shared/RedirectToLogin";

const Message = () => {
  const [messageBody, setMessageBody] = useState("");
  const [selectedUser, setSelectedUser] = useState<Models.Document | null>(null);
  const [isUserListVisible, setIsUserListVisible] = useState(true);
  const { user } = useUserContext();
  const { data: users, isPending } = useGetUsers();
  const { mutate: sendMessage } = useSendMessage();

  // Generate conversation ID
  const getConversationId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join("_");
  };

  const conversationId = selectedUser ? getConversationId(user?.id, selectedUser.$id) : "";
  const { data: messages, refetch: refetchMessages } = useGetMessages(conversationId);

  useEffect(() => {
    if (!selectedUser) return;

    // Subscribe to real-time updates
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          const newMessage = response.payload as Models.Document;
          if (newMessage.conversation_id === conversationId) {
            refetchMessages();
          }
        }
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    };
  }, [selectedUser, conversationId, refetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !selectedUser) return;

    try {
      sendMessage({
        sender_id: user?.id,
        receiver_id: selectedUser.$id,
        content: messageBody,
        conversation_id: conversationId,
      });

      setMessageBody("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible);
  };
  if (user.username === "guest") {
    return <RedirectToLogin message="Please login to access message section" />;
  }
  if (!user?.id) return null;

  return (
    <div className="flex justify-between w-full relative h-[88%] md:h-[100%]">
      {/* Users List Section */}
      <div
        className={`${
          isUserListVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 absolute md:relative md:translate-x-0 z-10 bg-dark-2 w-full md:w-1/4 min-w-[230px] h-screen`}
      >
        <UsersList
          users={users}
          isPending={isPending}
          selectedUser={selectedUser}
          onSelectUser={(user) => {
            setSelectedUser(user);
            // Hide user list after selection on mobile
            if (window.innerWidth < 768) {
              setIsUserListVisible(false);
            }
          }}
          currentUserId={user.id}
        />
      </div>

      {/* Chat Section */}
      <div className="flex flex-grow flex-col bg-dark-2 h-full w-full md:w-3/4">
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages}
          currentUserId={user.id}
          toggleUserList={toggleUserList}
        />
        {selectedUser && (
          <MessageInput
            messageBody={messageBody}
            setMessageBody={setMessageBody}
            onSubmit={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
