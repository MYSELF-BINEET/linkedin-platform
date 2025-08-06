export default function SkeletonPost() {
  return (
    <div className="bg-white p-4 rounded shadow animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div>
          <div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-300 rounded mb-4"></div>
      <div className="flex gap-4">
        <div className="w-10 h-4 bg-gray-300 rounded"></div>
        <div className="w-10 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
