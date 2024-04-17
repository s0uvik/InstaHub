import { Loader, PostCard } from "@/components/shared";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending, isError } = useGetRecentPosts();

  console.log(posts);

  return (
    <div className=" flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className=" h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPending && posts ? (
            <Loader />
          ) : (
            <ul className=" flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.id} className=" w-full">
                  <PostCard key={post.caption} post={post} />
                </li>
              ))}
            </ul>
          )}
          {isError && (
            <p className=" text-red text-center font-bold">
              Something went wrong
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
