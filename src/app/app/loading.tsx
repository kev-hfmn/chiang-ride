import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Image src="https://iili.io/fg6gAZb.md.png" alt="Chiang Ride" width={40} height={40} className="w-10 h-10" />
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
