import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type props = {
  isSearchFetching: boolean;
  searchPosts: Models.Document[] | undefined;
};

const SearchResults = ({ isSearchFetching, searchPosts }: props) => {
  if (isSearchFetching) return <Loader/>

  if(searchPosts && searchPosts?.length > 0) {
    return (
      <GridPostList posts={searchPosts}/>
    )
  }

  return <p className=" text-light-4 mt-10 text-center w-full">No results found</p>;
};

export default SearchResults;
