import { Models } from "appwrite";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPendingFollowRequests,
  useUpdateFollowRequestStatus,
} from "@/lib/react-query/queriesAndMutations/follow";
import Loader from "./Loader";
import { useGetUsersByIds } from "@/lib/react-query/queriesAndMutations";

const FollowRequests = () => {
  const { user } = useUserContext();
  const { data: followRequests, isPending } = useGetPendingFollowRequests(user.id);
  const { mutate: updateRequestStatus } = useUpdateFollowRequestStatus();

  // Extract all follower IDs from follow requests
  const followerIds = followRequests?.documents.map((req: Models.Document) => req.follower_id) || [];

  // Fetch user details for all follower IDs
  const userQueries = useGetUsersByIds(followerIds);

  const handleRequestAction = (
    requestId: string,
    status: "accepted" | "rejected",
    followerId: string,
    followingId: string
  ) => {
    updateRequestStatus({
      requestId,
      status,
      followerId,
      followingId,
    });
  };

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h3-bold">Follow Requests</h2>
      {followRequests?.documents.length === 0 ? (
        <p className="text-light-3">No pending follow requests</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {followRequests?.documents.map((request: Models.Document, index: number) => {
            const { data: follower, isLoading, isError } = userQueries[index] || {};

            return (
              <li
                key={request.$id}
                className="flex items-center justify-between bg-dark-2 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <Loader />
                  ) : isError || !follower ? (
                    <div className="text-red-500">Failed to load user</div>
                  ) : (
                    <>
                      <img
                        src={follower.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt="profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="base-medium">{follower.name}</p>
                        <p className="small-regular text-light-3">@{follower.username}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleRequestAction(
                        request.$id,
                        "accepted",
                        request.follower_id,
                        user.id
                      )
                    }
                    className="shad-button_primary bg-primary-500"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      handleRequestAction(
                        request.$id,
                        "rejected",
                        request.follower_id,
                        user.id
                      )
                    }
                    className="shad-button_primary bg-red-500"
                  >
                    Reject
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FollowRequests;
