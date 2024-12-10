import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import {
  getPendingFollowRequests,
  getUserFollowers,
  getUserFollowing,
  sendFollowRequest,
  unfollowUser,
  updateFollowRequestStatus,
  getFollowRequestStatus,
} from "@/lib/appwrite/api/follow";

export const useSendFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      sendFollowRequest(followerId, followingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS],
      });
      // Invalidate both users' followers/following lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, variables.followerId],
      });
    },
  });
};

export const useGetPendingFollowRequests = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS, userId],
    queryFn: () => getPendingFollowRequests(userId),
    enabled: !!userId,
  });
};

export const useUpdateFollowRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "accepted" | "rejected";
      followerId: string;
      followingId: string;
    }) => updateFollowRequestStatus(requestId, status),
    onSuccess: (_, variables) => {
      // Invalidate pending requests
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PENDING_FOLLOW_REQUESTS],
      });
      // Invalidate both users' followers/following lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, variables.followerId],
      });
    },
  });
};

export const useGetUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, userId],
    queryFn: () => getUserFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetUserFollowing = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, userId],
    queryFn: () => getUserFollowing(userId),
    enabled: !!userId,
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      unfollowUser(followerId, followingId),
    onSuccess: (_, variables) => {
      // Invalidate both users' followers/following lists
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWERS, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FOLLOWING, variables.followerId],
      });
    },
  });
};

export const useGetFollowRequestStatus = (followerId: string, followingId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOW_REQUEST_STATUS, followerId, followingId],
    queryFn: () => getFollowRequestStatus(followerId, followingId),
    enabled: !!followerId && !!followingId,
  });
};
