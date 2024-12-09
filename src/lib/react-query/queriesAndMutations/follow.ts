import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import {
  getPendingFollowRequests,
  getUserFollowers,
  getUserFollowing,
  sendFollowRequest,
  unfollowUser,
  updateFollowRequestStatus,
} from "@/lib/appwrite/api/follow";

// Send follow request mutation
export const useSendFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => sendFollowRequest(followerId, followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS],
      });
    },
  });
};

// Get pending follow requests query
export const useGetPendingFollowRequests = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS, userId],
    queryFn: () => getPendingFollowRequests(userId),
    enabled: !!userId,
  });
};

// Update follow request status mutation
export const useUpdateFollowRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "accepted" | "rejected";
    }) => updateFollowRequestStatus(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING],
      });
    },
  });
};

// Get user followers query
export const useGetUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, userId],
    queryFn: () => getUserFollowers(userId),
    enabled: !!userId,
  });
};

// Get user following query
export const useGetUserFollowing = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, userId],
    queryFn: () => getUserFollowing(userId),
    enabled: !!userId,
  });
};

// Unfollow user mutation
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followingId,
    }: {
      followerId: string;
      followingId: string;
    }) => unfollowUser(followerId, followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING],
      });
    },
  });
};
