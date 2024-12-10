import PostStats from "@/components/shared/PostStats";
import RedirectToLogin from "@/components/shared/RedirectToLogin";
import ShimmerPostCard from "@/components/shimmer-ui/ShimmerPostCard";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeleteSavePost, useGetSavePost } from "@/lib/react-query/queriesAndMutations";
import { Loader, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Saved = () => {
  const { user } = useUserContext();

  const { data: posts, isPending, isError } = useGetSavePost(user.id);
  const { mutateAsync: deletePost, isPending: isPendingDelete } = useDeleteSavePost();

  const deleteSavePost = async (id: string) => {
    window.confirm("Are you sure you want to delete this post?") && (await deletePost(id));
  };

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
              <Button
                onClick={() => deleteSavePost(item.$id)}
                disabled={isPendingDelete}
                className=" absolute top-2 right-2 cursor-pointer"
              >
                {isPendingDelete ? <Loader /> : <Trash2 className=" w-5 h-5 text-red" />}
              </Button>
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
      {posts?.documents.length === 0 && (
        <div className=" flex flex-col items-center gap-4">
          <p className="text-center text-light-3">No saved posts yet</p>
          <img src="/assets/icons/empty-save-post.svg" alt="No posts" className="w-[50%]" />
        </div>
      )}
    </div>
  );
};

export default Saved;
