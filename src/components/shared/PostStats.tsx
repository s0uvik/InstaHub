import { Models } from "appwrite";

const PostStats = ({
  post,
  userId,
}: {
  post: Models.Document;
  userId: string;
}) => {
  return <div className=" flex justify-between items-center 2-20">
    <div className="flex gap-2 mr-5">
        <img src="/assets/icons/like.svg" alt="" />
    </div>
  </div>;
};

export default PostStats;
