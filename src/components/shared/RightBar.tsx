import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";

const RightBar = () => {
  const { data: users, isPending } = useGetUsers();

  return (
    <div className="py-16 hidden lg:flex flex-col lg:min-w-[250px] xl:min-w-[350px] p-4">
      <div className="flex flex-col gap-4">
        <div className="text-light-3 flex justify-between items-center">
          <h3>Suggested for you</h3>
          <Link to="/all-users">See All</Link>
        </div>
        {isPending && <Loader />}
        <div className="flex flex-col gap-4">
          {users?.documents.slice(0, 5).map((user: Models.Document) => (
            <Link
              key={user.$id}
              to={`/profile/${user.$id}`}
              className="flex items-center gap-3 hover:bg-dark-4 p-2 rounded-lg transition-all"
            >
              <img
                src={user.imageUrl}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="base-medium text-light-1">{user.name}</p>
                <p className="small-regular text-light-3">@{user.username}</p>
              </div>
              <button className="text-primary-500 base-medium">Follow</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
