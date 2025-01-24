import { Models } from "appwrite";
import { useGetUserFollowing } from "@/lib/react-query/queriesAndMutations/follow";
import { Link } from "react-router-dom";

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
  const { data: following } = useGetUserFollowing(currentUserId);

  // Extract IDs of users being followed
  const followingIds = following || [];

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
        </div>
        {/* Users list */}
        <div className="space-y-2">
          {isPending ? (
            <div>Loading...</div>
          ) : (
            users?.documents
              .filter((otherUser) => followingIds.includes(otherUser.$id)) // Filter only users in the following list
              .map((user) => (
                <div
                  key={user.$id}
                  className={`flex items-center p-3 hover:bg-dark-3 rounded-lg cursor-pointer transition-all ${
                    selectedUser?.$id === user.$id ? "bg-dark-3" : ""
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <img
                    src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-light-1">{user.name}</h3>
                    <p className="text-sm text-light-3">@{user.username}</p>
                  </div>
                </div>
              ))
          )}
          {followingIds && followingIds.length === 0 && (
            <div className="flex flex-col gap-4 items-center justify-center">
              <p className="text-light-3 text-center mt-8">No messages yet</p>
              <Link to="/all-users">Find Friend</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
