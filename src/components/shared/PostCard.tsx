import { Link } from "react-router-dom";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import PostStats from "./PostStats";

const PostCard = ({ post }: { post: Models.Document }) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className=" post-card">
      <div className=" flex-between">
        <div className=" flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post.creator?.imageUrl || "/assets/images/profile.png"}
              alt=""
              className=" rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className=" flex flex-col">
            <p className="">{post.creator.name}</p>
            <div>
              <p className=" text-sm text-light-3">{formatDateString(post.$createdAt)}</p>
            </div>
          </div>
        </div>
        {user.id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img src="/assets/icons/edit.svg" alt="" width={20} />
          </Link>
        )}
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className=" small-medium lg:base-medium py-5">
          <p className=" mt-2">{post.caption}</p>
          <ul className=" flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className=" text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
