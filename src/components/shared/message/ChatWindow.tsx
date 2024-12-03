import { Models } from "appwrite";

type ChatWindowProps = {
  selectedUser: Models.Document | null;
  messages: { documents: Models.Document[] } | undefined;
  currentUserId: string;
  toggleUserList: () => void;
};

const ChatWindow = ({ selectedUser, messages, currentUserId, toggleUserList }: ChatWindowProps) => {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-light-3 p-4 text-center">
        Select a user to start messaging
      </div>
    );
  }

  return (
    <>
      {/* Chat header */}
      <div className="p-4 border-b border-dark-4 flex items-center">
        <button className="md:hidden mr-4" onClick={toggleUserList}>
          <img
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="invert-white"
          />
        </button>
        <img
          src={selectedUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
        />
        <div className="ml-4 flex-1">
          <h3 className="font-semibold text-light-1 text-sm md:text-base">{selectedUser.name}</h3>
          <p className="text-light-3 text-xs md:text-sm">@{selectedUser.username}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-2 md:p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages?.documents.map((message) => (
            <div
              key={message.$id}
              className={`flex ${
                message.sender_id === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.sender_id === currentUserId
                    ? "bg-primary-500 text-light-1"
                    : "bg-dark-4 text-light-1"
                } rounded-lg p-2 md:p-3 max-w-[75%] md:max-w-xs break-words text-sm md:text-base`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
