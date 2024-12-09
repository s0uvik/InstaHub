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
import { useGetUserFollowers, useGetUserFollowing } from "@/lib/react-query/queriesAndMutations/follow";

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
      <section className="">
        {isUserError && <p className="text-red-500 text-center mt-8">Failed to load user</p>}
        {isUserLoading ? (
          <ShimmerProfile />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 items-center">
              <img
                src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover"
              />
              <div className="flex flex-col items-center">
                <h1 className="h3-bold">{user?.name}</h1>
                <p className="small-regular text-light-3">@{user?.username}</p>
              </div>
              <div className="flex gap-8 items-center">
                <div className="flex flex-col items-center">
                  <p className="h3-bold">{followers?.length || 0}</p>
                  <p className="small-regular text-light-3">Followers</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="h3-bold">{following?.length || 0}</p>
                  <p className="small-regular text-light-3">Following</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="h3-bold">{posts?.documents.length || 0}</p>
                  <p className="small-regular text-light-3">Posts</p>
                </div>
              </div>
              <div className="flex gap-4">
                {loggedInUser.id === userId ? (
                  <EditProfile user={user} />
                ) : (
                  <FollowButton userId={userId as string} />
                )}
              </div>
            </div>

            {loggedInUser.id === userId && <FollowRequests />}

            <div className="flex flex-col gap-4">
              <h2 className="h3-bold">Posts</h2>
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
      </section>
    </div>
  );
};

export default Profile;
