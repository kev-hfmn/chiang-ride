import { Loader2 } from "lucide-react";
import { getTranslations } from "@/lib/i18n/server";

export default async function Loading() {
  const { t } = await getTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">🏪</span>
        </div>
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin absolute -bottom-1 -right-1" />
      </div>
      <div className="text-center">
        <p className="text-gray-600 font-medium">{t("loading")}</p>
        <p className="text-gray-400 text-sm">{t("openingShopDashboard")}</p>
      </div>
    </div>
  );
}
