export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-4 animate-pulse"
        >
          {/* Top Emoji + Title Area */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
            </div>
          </div>

          {/* Bottom Price Area */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-200 rounded-xs w-16"></div>
              <div className="h-6 bg-gray-200 rounded-md w-24"></div>
            </div>
            <div className="h-7 bg-gray-200 rounded-lg w-14"></div>
          </div>
        </div>
      ))}
    </div>
  );
}