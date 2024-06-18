import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";

const Profile = () => {
  const { user } = useUserContext();

  const { data: posts } = useGetUserPosts(user?.id);

  if (!posts) return <Loader />;

  return (
    <div className="profile-container">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 ml-10 py-2 rounded">
          Follow
        </button>
      </header>

      <div className="flex justify-between mt-4">
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

      {/* <div className="mt-4">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p className="text-gray-700">
          {user.bio
            ? `${user.bio}`
            : "This is a short bio description. It can span multiple lines and contain details about the user."}
        </p>
      </div> */}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-1 text-center">My posts</h3>
        <hr className="mb-4 border-gray-800 border" />
        <GridPostList posts={posts?.documents} />
      </div>
    </div>
  );
};

export default Profile;
