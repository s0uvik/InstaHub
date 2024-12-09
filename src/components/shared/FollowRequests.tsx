import { Models } from "appwrite";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPendingFollowRequests,
  useUpdateFollowRequestStatus,
} from "@/lib/react-query/queriesAndMutations/follow";
import Loader from "./Loader";

const FollowRequests = () => {
  const { user } = useUserContext();
  const { data: followRequests, isPending } = useGetPendingFollowRequests(user.id);
  const { mutate: updateRequestStatus } = useUpdateFollowRequestStatus();

  const handleRequestAction = (requestId: string, status: "accepted" | "rejected") => {
    updateRequestStatus({ requestId, status });
  };

  if (isPending) return <Loader />;
console.log(followRequests)
  return (
    <div className="flex flex-col gap-4">
      <h2 className="h3-bold">Follow Requests</h2>
      {followRequests?.documents.length === 0 ? (
        <p className="text-light-3">No pending follow requests</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {followRequests?.documents.map((request: Models.Document) => (
            <li
              key={request.$id}
              className="flex items-center justify-between bg-dark-2 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={request.follower?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="base-medium">{request.follower?.name}</p>
                  <p className="small-regular text-light-3">@{request.follower?.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRequestAction(request.$id, "accepted")}
                  className="shad-button_primary bg-primary-500"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleRequestAction(request.$id, "rejected")}
                  className="shad-button_primary bg-red-500"
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowRequests;
