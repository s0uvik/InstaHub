import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/shared/SearchBar";
import UserCard from "@/components/shared/UserCard";
import ShimmerUserCard from "@/components/shimmer-ui/ShimmerUserCard";

interface User extends Models.Document {
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  posts: unknown[];
}

const AllUsers = () => {
  const { data, isPending, isError } = useGetUsers();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);

  const filteredUsers = (data?.documents as User[])?.filter(
    (user) =>
      user.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      user.username.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold w-full">All Users</h2>

        <SearchBar value={searchValue} onChange={setSearchValue} />

        {/* Users List */}
        <div className="user-grid">
          {isError && <p className="text-red-500 text-center mt-8">Something went wrong</p>}
          {isPending &&
            Array(3)
              .fill(0)
              .map((_, index) => <ShimmerUserCard key={index} />)}
          {filteredUsers?.map((user: User) => <UserCard key={user.$id} user={user} />)}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
