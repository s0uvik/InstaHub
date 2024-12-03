import { Skeleton } from "@/components/ui/skeleton";

const ShimmerProfile = () => {
  return (
    <div className="flex flex-col justify-between items-center">
      {/* User Info Skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-24 h-24 rounded-full bg-gray-500" />
        <div>
          <Skeleton className="w-32 h-6 mb-2 rounded bg-gray-500" />
          <Skeleton className="w-24 h-4 rounded bg-gray-500" />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <div className="text-center">
          <Skeleton className="w-10 h-6 mb-1 mx-auto bg-gray-500" />
          <Skeleton className="w-16 h-4 mx-auto bg-gray-500" />
        </div>
        <div className="text-center ml-4">
          <Skeleton className="w-10 h-6 mb-1 mx-auto bg-gray-500" />
          <Skeleton className="w-16 h-4 mx-auto bg-gray-500" />
        </div>
        <div className="text-center ml-4">
          <Skeleton className="w-10 h-6 mb-1 mx-auto bg-gray-500" />
          <Skeleton className="w-16 h-4 mx-auto bg-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ShimmerProfile;
