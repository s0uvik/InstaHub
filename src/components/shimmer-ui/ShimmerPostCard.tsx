import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

// Define the ShimmerPostCard component
const ShimmerPostCard = () => {
  return (
    <li className="relative">
      {/* Shimmer for Post Image */}
      <Link to="#" className="grid-post_link">
        <Skeleton className="h-96 w-full object-cover bg-gray-500" />
      </Link>
      <div className="grid-post_user">
        {/* Shimmer for Creator Info */}
        <div className="flex items-center justify-start gap-2">
          <Skeleton className="w-8 h-8 rounded-full bg-gray-500" />
        </div>

        {/* Shimmer for Post Stats */}
        <div className="flex justify-start gap-4 mt-2">
          <Skeleton className="w-12 h-6 bg-gray-500" />
          <Skeleton className="w-12 h-6 bg-gray-500" />
        </div>
      </div>
    </li>
  );
};

export default ShimmerPostCard;
