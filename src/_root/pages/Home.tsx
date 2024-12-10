import { Models } from "appwrite";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader, PostCard } from "@/components/shared";
import RightBar from "@/components/shared/RightBar";
import { Button } from "@/components/ui/button";

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
        {posts?.documents.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 bg-dark-3 rounded-lg">
            <img src="/assets/icons/empty-posts.svg" alt="No posts" className="w-[50%] h-[50%]" />
            <h3 className="text-light-1 text-xl font-semibold">No posts yet!</h3>
            <p className="text-light-4">
              Be the first to share something interesting with the community.
            </p>
            <Button className="shad-button_primary bg-primary-500 px-6 py-2 text-sm font-medium">
              Create a Post
            </Button>
          </div>
        )}
      </div>
      <RightBar />
    </div>
  );
};

export default Home;
