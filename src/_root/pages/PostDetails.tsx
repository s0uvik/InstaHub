import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Loader } from "@/components/shared";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useGetPostById(id || "");
  const { mutateAsync: deletePost, isPending: isPendingDelete } = useDeletePost();
  const { user } = useUserContext();

  const handleDeletePost = (postId: string, imageId: string) => {
    window.confirm("Are you sure you want to delete this post?") && deletePost({ postId, imageId });
    navigate("/");
  };
  return (
    <div className=" post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className=" post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className=" flex items-center gap-3">
                <img
                  src={post?.creator?.imageUrl || "/assets/images/profile.png"}
                  alt=""
                  className=" rounded-full w-12 lg:h-12"
                />
                <div className=" flex flex-col">
                  <p className="">{post?.creator.name}</p>
                  <div>
                    <p className=" text-sm text-light-3">
                      {formatDateString(post?.$createdAt || "")}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-4">
                {user.id === post?.creator.$id && (
                  <>
                    <Link to={`/update-post/${post?.$id}`}>
                      <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                    </Link>

                    <Button
                      disabled={isPendingDelete}
                      onClick={() => handleDeletePost(post?.$id, post?.imageId)}
                    >
                      {isPendingDelete ? <Loader /> : <Trash2 className=" w-5 h-5 text-red" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 small-medium lg:base-medium">
              <p className=" mt-2">{post?.caption}</p>
              <ul className=" flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className=" text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              {user.username !== "guest" && <PostStats post={post} userId={user.id} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
