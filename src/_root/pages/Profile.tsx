import { useParams } from "react-router-dom";
import { useGetUserById, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import GridPostList from "@/components/shared/GridPostList";
import { Loader } from "@/components/shared";
import ShimmerProfile from "@/components/shimmer-ui/Profile";
import RedirectToLogin from "@/components/shared/RedirectToLogin";
import EditProfile from "@/components/forms/EditProfile";
import FollowButton from "@/components/shared/FollowButton";
import FollowRequests from "@/components/shared/FollowRequests";
import FollowDialog from "@/components/shared/FollowDialog";
import {
  useGetUserFollowers,
  useGetUserFollowing,
} from "@/lib/react-query/queriesAndMutations/follow";

const Profile = () => {
  const { id: userId } = useParams();

  const { user: loggedInUser } = useUserContext();
  const {
    data: user,
    isPending: isUserLoading,
    isError: isUserError,
  } = useGetUserById(userId as string);
  const { data: posts, isPending, isError } = useGetUserPosts(userId as string);
  const { data: followers } = useGetUserFollowers(userId as string);
  const { data: following } = useGetUserFollowing(userId as string);

  if (loggedInUser.username === "guest" && userId === loggedInUser.id) {
    return <RedirectToLogin message="Please login to view your profile" />;
  }

  return (
    <div className="profile-container">
        {isUserError && <p className="text-red-500 text-center mt-8">Failed to load user</p>}
        {isUserLoading ? (
          <ShimmerProfile />
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-4 items-center">
              <div className=" flex items-center gap-6">
                <img
                  src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover"
                />
                <div className="flex flex-col items-center">
                  <h1 className="h3-bold">{user?.name}</h1>
                  <p className="small-regular text-light-3">@{user?.username}</p>
                </div>
                <div className="flex gap-4">
                  {loggedInUser.id === userId ? (
                    <EditProfile user={user} />
                  ) : (
                    <FollowButton userId={userId as string} />
                  )}
                </div>
              </div>
              <div className="flex gap-8 items-center">
                <FollowDialog
                  userId={userId as string}
                  type="followers"
                  count={followers?.length || 0}
                />
                <FollowDialog
                  userId={userId as string}
                  type="following"
                  count={following?.length || 0}
                />
                <div className="flex flex-col items-center">
                  <p className="text-primary-500 text-lg font-bold">
                    {posts?.documents.length || 0}
                  </p>
                  <p className="text-light-2 text-sm capitalize">Posts</p>
                </div>
              </div>
            </div>

            {loggedInUser.id === userId && <FollowRequests />}

            <div className="flex flex-col gap-4 w-full">
              <h2 className="h3-bold">Posts</h2>
              <hr className="mb-4 border-gray-800 border w-full" />
              {posts?.documents.length === 0 && (
                <p className="text-light-3 text-center">No posts yet</p>)}
              {isPending && !posts ? (
                <Loader />
              ) : isError ? (
                <p className="text-red-500 text-center mt-8">Failed to load posts</p>
              ) : (
                <GridPostList posts={posts?.documents || []} />
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Profile;
