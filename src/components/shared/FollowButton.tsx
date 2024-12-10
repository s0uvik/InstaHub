import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useSendFollowRequest,
  useUnfollowUser,
  useGetUserFollowers,
  useGetFollowRequestStatus,
} from "@/lib/react-query/queriesAndMutations/follow";
import { useToast } from "../ui/use-toast";

interface FollowButtonProps {
  userId: string;
}

const FollowButton = ({ userId }: FollowButtonProps) => {
  const { user } = useUserContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const { toast } = useToast();

  const { data: followers } = useGetUserFollowers(userId);
  const { mutate: sendFollowRequest, isPending: isSendingRequest } = useSendFollowRequest();
  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();
  const { data: followRequestStatus } = useGetFollowRequestStatus(user.id, userId);

  useEffect(() => {
    if (followRequestStatus === "pending") {
      setHasPendingRequest(true);
      setIsFollowing(false);
    } else if (followRequestStatus === "accepted") {
      setHasPendingRequest(false);
      setIsFollowing(true);
    } else {
      setHasPendingRequest(false);
      setIsFollowing(false);
    }
  }, [followRequestStatus]);

  useEffect(() => {
    if (followers) {
      setIsFollowing(followers.includes(user.id));
      if (followers.includes(user.id)) {
        setHasPendingRequest(false);
      }
    }
  }, [followers, user.id]);

  const handleFollowAction = async () => {
    if (isFollowing) {
      unfollowUser(
        { followerId: user.id, followingId: userId },
        {
          onSuccess: () => {
            setIsFollowing(false);
            setHasPendingRequest(false);
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to unfollow user. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      sendFollowRequest(
        { followerId: user.id, followingId: userId },
        {
          onSuccess: (data) => {
            if (data.status === "cancelled") {
              toast({
                title: "Request Cancelled",
                description: "Your follow request was cancelled.",
              });
              setHasPendingRequest(false);
              setIsFollowing(false);
            } else {
              setHasPendingRequest(true);
              setIsFollowing(false);
            }
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to send follow request. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  if (user.id === userId) return null;

  return (
    <Button
      onClick={handleFollowAction}
      disabled={isSendingRequest || isUnfollowing}
      className="shad-button_primary"
    >
      {isFollowing ? "Unfollow" : hasPendingRequest ? "Cancel Request" : "Follow"}
    </Button>
  );
};

export default FollowButton;
