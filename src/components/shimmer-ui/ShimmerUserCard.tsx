import { Skeleton } from "@/components/ui/skeleton";

const ShimmerUserCard = () => {
  return (
    <div className="user-card flex-center flex-col gap-4 p-4 bg-gray-800 rounded-lg">
      <Skeleton className="w-14 h-14 rounded-full bg-gray-500" />
      <div className="flex-center flex-col gap-1 w-full">
        <Skeleton className="w-24 h-5 rounded bg-gray-500" />
        <Skeleton className="w-20 h-4 rounded bg-gray-500" />
      </div>
      <Skeleton className="w-32 h-10 rounded bg-gray-500" />
    </div>
  );
};

export default ShimmerUserCard;
