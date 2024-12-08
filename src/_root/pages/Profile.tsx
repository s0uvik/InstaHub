import { useParams } from "react-router-dom";
import { useGetUserById, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import GridPostList from "@/components/shared/GridPostList";
import { Loader } from "@/components/shared";
import ShimmerProfile from "@/components/shimmer-ui/Profile";
import RedirectToLogin from "@/components/shared/RedirectToLogin";
import EditProfile from "@/components/forms/EditProfile";

const Profile = () => {
  const { id: userId } = useParams();

  const { user: loggedInUser } = useUserContext();
  const {
    data: user,
    isPending: isUserLoading,
    isError: isUserError,
  } = useGetUserById(userId as string);
  const { data: posts, isPending, isError } = useGetUserPosts(userId as string);

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
          <div className="flex space-x-4">
            <img
              src={user?.imageUrl}
              alt={user?.name}
              className="md:w-24 w-16 h-16 md:h-24 rounded-full"
            />
            <div>
              <h2 className="text-lg md:text-2xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500">@{user?.username}</p>
              {user?.bio && <p className="mt-2">{user.bio}</p>}
            </div>

            {userId === loggedInUser.id ? (
              <EditProfile user={user} />
            ) : (
              <button className="shad-button_primary text-white px-4 ml-10 py-2 rounded">
                Follow
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 ">
          <div className="text-center">
            <p className="font-semibold">{posts?.documents.length}</p>
            <p className="text-gray-500">Posts</p>
          </div>
          <div className="text-center ml-4">
            <p className="font-semibold">250</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div className="text-center ml-4">
            <p className="font-semibold">180</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>
      </section>

      {/* post section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-1 text-center">
          {userId === loggedInUser.id ? "My posts" : "Posts"}
        </h3>
        {isError && <p className="text-red-500 text-center mt-8">Something went wrong</p>}
        {isPending ? (
          <div className=" mt-8">
            <Loader />
          </div>
        ) : (
          <>
            <hr className="mb-4 border-gray-800 border w-full" />
            <GridPostList posts={posts?.documents} />
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
