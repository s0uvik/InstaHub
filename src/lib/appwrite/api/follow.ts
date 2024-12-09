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
        Query.equal("status", ["pending", "accepted"]),
      ]
    );

    if (existingRequest.documents.length > 0) {
      const request = existingRequest.documents[0];
      if (request.status === "pending") {
        throw new Error("Follow request already pending");
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

// Check if a follow request exists
export async function checkFollowRequestStatus(followerId: string, followingId: string) {
  try {
    const existingRequest = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [
        Query.equal("follower_id", followerId),
        Query.equal("following_id", followingId),
      ]
    );

    if (existingRequest.documents.length > 0) {
      return existingRequest.documents[0];
    }
    return null;
  } catch (error) {
    console.error("Appwrite error :: checkFollowRequestStatus :: ", error);
    throw error;
  }
}

// Get pending follow requests for a user
export async function getPendingFollowRequests(userId: string) {
  try {
    const requests = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      [Query.equal("following_id", userId), Query.equal("status", "pending")]
    );

    return requests;
  } catch (error) {
    console.error("Appwrite error :: getPendingFollowRequests :: ", error);
    throw error;
  }
}

// Update follow request status (accept/reject)
export async function updateFollowRequestStatus(
  requestId: string,
  status: "accepted" | "rejected"
) {
  try {
    const updatedRequest = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followRequestsCollectionId,
      requestId,
      {
        status: status,
      }
    );

    if (status === "accepted") {
      const request = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followRequestsCollectionId,
        requestId
      );
    }

    return updatedRequest;
  } catch (error) {
    console.error("Appwrite error :: updateFollowRequestStatus :: ", error);
    throw error;
  }
}

// Get user's followers
export async function getUserFollowers(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    const followers = user.followers || [];
    return followers
  } catch (error) {
    console.error("Appwrite error :: getUserFollowers :: ", error);
    throw error;
  }
}

// Get user's following
export async function getUserFollowing(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    const following = user.following || [];
    return following;
  } catch (error) {
    console.error("Appwrite error :: getUserFollowing :: ", error);
    throw error;
  }
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string) {
  try {
    // Get current followers/following lists
    const follower = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      followerId
    );

    const following = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      followingId
    );

    // Update follower's following list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      follower.$id,
      {
        following: follower.following.filter((id: string) => id !== followingId),
      }
    );

    // Update following's followers list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      following.$id,
      {
        followers: following.followers.filter((id: string) => id !== followerId),
      }
    );

    return { status: "success" };
  } catch (error) {
    console.error("Appwrite error :: unfollowUser :: ", error);
    throw error;
  }
}
