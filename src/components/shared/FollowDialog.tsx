import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetUserFollowers, useGetUserFollowing } from "@/lib/react-query/queriesAndMutations/follow";
import { Loader } from "lucide-react";
import FollowerCard from "./FollowerCard";
import { useUserContext } from "@/context/AuthContext";

interface FollowDialogProps {
  userId: string;
  type: "followers" | "following";
  count: number;
}

const FollowDialog = ({ userId, type, count }: FollowDialogProps) => {
  const { user: currentUser } = useUserContext();
  const {
    data: followers,
    isPending: isFollowersLoading
  } = useGetUserFollowers(userId);
  
  const {
    data: following,
    isPending: isFollowingLoading
  } = useGetUserFollowing(userId);

  const isLoading = type === "followers" ? isFollowersLoading : isFollowingLoading;
  const data = type === "followers" ? followers : following;
  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-center">
        <p className="text-primary-500 text-lg font-bold">{count}</p>
        <p className="text-light-2 text-sm capitalize">{type}</p>
      </DialogTrigger>

      <DialogContent className="bg-dark-2">
        <DialogHeader>
          <DialogTitle className="text-light-2 text-xl font-bold">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex-center w-full p-4">
              <Loader />
            </div>
          ) : data?.length === 0 ? (
            <p className="text-light-3 text-center p-4">No {type} yet</p>
          ) : (
            data?.map((followerId: string) => (
              <FollowerCard 
                key={followerId} 
                userId={followerId}
                showFollowButton={currentUser.id !== followerId} 
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
