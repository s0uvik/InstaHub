import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../config";

// Send a follow request
export async function sendFollowRequest(followerId: string, followingId: string) {
  try {
    // Check if a request already exists
    const existingRequest = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("follower_id", followerId),
        Query.equal("following_id", followingId),
      ]
    );

    if (existingRequest.documents.length > 0) {
      const request = existingRequest.documents[0];
      if (request.status === "pending") {
        // Cancel the request
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.followRequestsCollectionId,
          request.$id
        );
        return { status: "cancelled" };
      } else if (request.status === "accepted") {
        throw new Error("Already following this user");
      }
    }

    // Create new follow request
    const followRequest = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      ID.unique(),
      {
        follower_id: followerId,
        following_id: followingId,
        status: "pending",
      }
    );

    return followRequest;
  } catch (error) {
    console.error("Appwrite error :: sendFollowRequest :: ", error);
    throw error;
  }
}

// Update follow request status (accept/reject)
export async function updateFollowRequestStatus(
  requestId: string,
  status: "accepted" | "rejected"
) {
  try {
    const request = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      requestId
    );

    if (request.status === status) {
      return request;
    }

    const updatedRequest = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      requestId,
      {
        status: status,
      }
    );

    return updatedRequest;
  } catch (error) {
    console.error("Appwrite error :: updateFollowRequestStatus :: ", error);
    throw error;
  }
}

// Get user's followers
export async function getUserFollowers(userId: string) {
  try {
    // Get all accepted follow requests where this user is being followed
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("following_id", userId),
        Query.equal("status", "accepted")
      ]
    );

    return requests.documents.map(request => request.follower_id);
  } catch (error) {
    console.error("Appwrite error :: getUserFollowers :: ", error);
    throw error;
  }
}

// Get user's following
export async function getUserFollowing(userId: string) {
  try {
    // Get all accepted follow requests where this user is following others
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("follower_id", userId),
        Query.equal("status", "accepted")
      ]
    );

    return requests.documents.map(request => request.following_id);
  } catch (error) {
    console.error("Appwrite error :: getUserFollowing :: ", error);
    throw error;
  }
}

// Get follow request status
export async function getFollowRequestStatus(followerId: string, followingId: string) {
  try {
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("follower_id", followerId),
        Query.equal("following_id", followingId),
      ]
    );

    if (requests.documents.length === 0) {
      return "none";
    }

    return requests.documents[0].status;
  } catch (error) {
    console.error("Appwrite error :: getFollowRequestStatus :: ", error);
    throw error;
  }
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string) {
  try {
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("follower_id", followerId),
        Query.equal("following_id", followingId),
      ]
    );

    if (requests.documents.length > 0) {
      // Delete the follow request instead of updating to rejected
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followRequestsCollectionId,
        requests.documents[0].$id
      );
    }

    return true;
  } catch (error) {
    console.error("Appwrite error :: unfollowUser :: ", error);
    throw error;
  }
}

// Get pending follow requests
export async function getPendingFollowRequests(userId: string) {
  try {
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("following_id", userId),
        Query.equal("status", "pending")
      ]
    );

    return requests;
  } catch (error) {
    console.error("Appwrite error :: getPendingFollowRequests :: ", error);
    throw error;
  }
}
