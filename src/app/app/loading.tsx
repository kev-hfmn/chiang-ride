import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">🛵</span>
        </div>
        <Loader2 className="w-6 h-6 text-green-600 animate-spin absolute -bottom-1 -right-1" />
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">Loading...</p>
        <p className="text-gray-400 text-sm">Finding your next ride</p>
      </div>
    </div>
  );
}
