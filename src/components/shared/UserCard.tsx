import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FollowButton from "./FollowButton";

interface UserCardProps {
  user: {
    $id: string;
    name: string;
    username: string;
    imageUrl: string;
  };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div key={user.$id} className="user-card">
      <div className="flex-center flex-col gap-4">
        <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-4">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-14 h-14 rounded-full"
          />
          <div className="flex-center flex-col gap-1">
            <p className="base-medium text-light-1 text-center line-clamp-1">
              {user.name}
            </p>
            <p className="small-regular text-light-3 text-center line-clamp-1">
              @{user.username}
            </p>
          </div>
        </Link>
        <div className="flex gap-4">
          <Link to={`/profile/${user.$id}`}>
            <Button className="shad-button_primary px-8">View Profile</Button>
          </Link>
          <FollowButton userId={user.$id} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
