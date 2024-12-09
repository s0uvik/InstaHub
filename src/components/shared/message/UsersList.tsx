import { Models } from "appwrite";

type UsersListProps = {
  users: { documents: Models.Document[] } | undefined;
  isPending: boolean;
  selectedUser: Models.Document | null;
  onSelectUser: (user: Models.Document) => void;
  currentUserId: string;
};

const UsersList = ({
  users,
  isPending,
  selectedUser,
  onSelectUser,
  currentUserId,
}: UsersListProps) => {
  return (
    <div className="border-r h-full border-dark-4 overflow-y-auto bg-dark-2 w-1/4 min-w-[250px]">
      <div className="p-4">
        <h2 className="h3-bold md:h2-bold mb-4 text-light-1">Messages</h2>
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full p-2 pl-8 rounded-lg bg-dark-4 text-light-1 placeholder:text-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <svg
            className="absolute left-2 top-2.5 h-5 w-5 text-light-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {/* Users list */}
        <div className="space-y-2">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            users?.documents.map(
              (otherUser) =>
                otherUser.$id !== currentUserId && (
                  <div
                    key={otherUser.$id}
                    className={`flex items-center p-3 hover:bg-dark-3 rounded-lg cursor-pointer transition-all ${
                      selectedUser?.$id === otherUser.$id ? "bg-dark-3" : ""
                    }`}
                    onClick={() => onSelectUser(otherUser)}
                  >
                    <img
                      src={otherUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-light-1">{otherUser.name}</h3>
                      <p className="text-sm text-light-3">@{otherUser.username}</p>
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
