import { Models } from "appwrite";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader, PostCard } from "@/components/shared";
import RightBar from "@/components/shared/RightBar";

const Home = () => {
  const { data: posts, isPending, isError } = useGetRecentPosts();

  return (
    <div className="flex flex-1 gap-4">
      <div className="home-container">
        <div className="md:w-[80%] w-[100%]">
          <h2 className="h3-bold md:h2-bold text-left w-full mb-6">Home Feed</h2>
          {isPending ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.id} className="w-full">
                  <PostCard key={post.caption} post={post} />
                </li>
              ))}
            </ul>
          )}
          {isError && <p className="text-red text-center font-bold">Something went wrong</p>}
        </div>
      </div>
      <RightBar />
    </div>
  );
};

export default Home;
