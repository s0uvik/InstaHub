import PostStats from "@/components/shared/PostStats";
import RedirectToLogin from "@/components/shared/RedirectToLogin";
import ShimmerPostCard from "@/components/shimmer-ui/ShimmerPostCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavePost } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

const Saved = () => {
  const { user } = useUserContext();

  const { data: posts, isPending, isError } = useGetSavePost(user.id);

  if (user.username === "guest") {
    return <RedirectToLogin message="Please login to view saved Posts" />;
  }
  return (
    <div className="common-container">
      <h2 className="h3-bold md:h2-bold w-full ">My saved Posts</h2>
      {isError && <p className="text-red-500 text-center mt-8">Something went wrong</p>}
      <hr className="mb-4 border-gray-800 border w-full" />
      {isPending ? (
        <ul className="grid-container">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <ShimmerPostCard key={index} />
            ))}
        </ul>
      ) : (
        <ul className="grid-container">
          {posts?.documents.map((item) => (
            <li key={item.post?.$id} className=" relative">
              <Link to={`/post/${item.post?.$id}`} className=" grid-post_link">
                <img src={item.post?.imageUrl} alt="post" className=" h-full w-full object-cover" />
              </Link>
              <div className="grid-post_user">
                <div className=" flex items-center justify-start gap-2">
                  <img
                    src={item.post?.creator.imageUrl}
                    alt="creator"
                    className=" w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{item.post?.creator.name}</p>
                </div>
                <PostStats post={item.post} userId={user.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Saved;
