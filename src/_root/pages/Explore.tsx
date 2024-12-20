import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";

import { Loader } from "@/components/shared";
import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import SearchBar from "@/components/shared/SearchBar";

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue, 500);

  const { data: searchPosts, isFetching: isFetchingSearchPost } = useSearchPosts(debounceValue);

  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [inView, searchValue, fetchNextPage]);

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPost =
    !shouldShowSearchResults && posts?.pages.every((page) => page?.documents?.length === 0);

  return (
    <div className=" explore-container">
      <div className="explore-inner_container">
        <h2 className=" h3-bold md:h2-bold w-full">Search Post</h2>
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </div>
      <div className=" flex-between w-full max-w-5xl mt-16 mb-7">
        <h2 className=" h4-bold w-full">Popular Today</h2>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className=" small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
        </div>
      </div>
      {!posts && <Loader />}
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isFetchingSearchPost}
            searchPosts={searchPosts?.documents}
          />
        ) : shouldShowPost ? (
          <p className=" text-light-4 mt-4 text-center w-full">End of posts</p>
        ) : (
          posts?.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents || []} />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className=" mt-6">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
