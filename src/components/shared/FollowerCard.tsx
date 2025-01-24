import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import FollowButton from "./FollowButton";

interface FollowerCardProps {
  userId: string;
  showFollowButton?: boolean;
}

const FollowerCard = ({ userId, showFollowButton = true }: FollowerCardProps) => {
  const { data: user, isPending } = useGetUserById(userId);

  if (isPending) return <div className="flex items-center justify-center p-4"><Loader /></div>;
  if (!user) return null;
console.log(user.name)
  return (
    <div className="flex items-center justify-between p-4 hover:bg-dark-4 transition-all rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-light-1">{user.name}</p>
          <p className="text-light-3 text-sm">@{user.username}</p>
        </div>
      </div>
      
      {showFollowButton && (
        <FollowButton userId={userId} />
      )}

      <Link 
        to={`/profile/${userId}`} 
        className="ml-auto"
      >
        <Button variant="link">View Profile</Button>
      </Link>
    </div>
  );
};

export default FollowerCard;
