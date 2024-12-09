import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useSendFollowRequest,
  useUnfollowUser,
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/lib/react-query/queriesAndMutations/follow";
import { useToast } from "../ui/use-toast";
import { Query } from "appwrite";
import { appwriteConfig, databases } from "@/lib/appwrite/config";

type FollowButtonProps = {
  userId: string;
};

const FollowButton = ({ userId }: FollowButtonProps) => {
  const { user } = useUserContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const { toast } = useToast();

  const { data: followers } = useGetUserFollowers(userId);
  const { mutate: sendFollowRequest, isPending: isSendingRequest } =
    useSendFollowRequest();
  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();

  // Check for existing follow request
  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const existingRequest = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.followRequestsCollectionId,
          [
            Query.equal("follower_id", user.id),
            Query.equal("following_id", userId),
            Query.equal("status", "pending"),
          ]
        );

        setHasPendingRequest(existingRequest.documents.length > 0);
      } catch (error) {
        console.error("Error checking follow request:", error);
      }
    };

    if (user.id && userId) {
      checkExistingRequest();
    }
  }, [user.id, userId]);

  // Update `isFollowing` state based on `followers` data
  useEffect(() => {
    if (followers) {
      setIsFollowing(followers.includes(user.id));
      if (followers.includes(user.id)) {
        setHasPendingRequest(false); // Reset pending request if already following
      }
    }
  }, [followers, user.id]);

  const handleFollowAction = async () => {
    if (isFollowing) {
      try {
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
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    } else {
      try {
        sendFollowRequest(
          { followerId: user.id, followingId: userId },
          {
            onSuccess: () => {
              setHasPendingRequest(true);
              toast({
                title: "Success",
                description: "Follow request sent successfully!",
              });
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
      } catch (error) {
        console.error("Error sending follow request:", error);
      }
    }
  };

  if (user.id === userId) return null;

  return (
    <Button
      onClick={handleFollowAction}
      disabled={isSendingRequest || isUnfollowing}
      className={`shad-button_primary ${
        isFollowing
          ? "bg-dark-4 hover:bg-red-500 hover:text-white"
          : hasPendingRequest
          ? "bg-dark-4"
          : "bg-primary-500"
      }`}
    >
      {isFollowing ? "Unfollow" : hasPendingRequest ? "Request Sent" : "Follow"}
    </Button>
  );
};

export default FollowButton;
