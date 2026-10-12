import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#f0f4f1] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Skeleton */}
        <div className="w-full h-48 bg-white rounded-3xl border border-gray-200/80 animate-pulse p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
        </div>

        {/* Section Title Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded-md w-48 animate-pulse"></div>
          {/* Product Cards Grid Skeleton */}
          <ProductSkeleton count={6} />
        </div>

      </div>
    </div>
  );
}