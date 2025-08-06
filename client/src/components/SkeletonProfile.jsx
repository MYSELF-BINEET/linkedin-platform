export default function SkeletonProfile() {
  return (
    <div className="max-w-lg mx-auto bg-white p-4 rounded shadow animate-pulse">
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
        <div className="w-32 h-5 bg-gray-300 rounded mb-1"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
      <div className="w-2/3 h-3 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-3">
        {Array(3).fill().map((_, i) => (
          <div key={i} className="w-full h-4 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
}
