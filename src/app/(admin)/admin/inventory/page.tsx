import { AlertCircle } from "lucide-react";
import { getAdminShop, getAdminInventory } from "@/lib/db/admin";
import { getTranslations } from '@/lib/i18n/server'
import { Card, CardContent } from "@/components/ui/card";
import { InventoryListWithDrawer } from "@/components/admin/inventory-list-with-drawer";

export default async function InventoryPage() {
  const shop = await getAdminShop();
  const { t } = await getTranslations();

  if (!shop) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
          <h2 className="text-xl font-bold text-gray-900">{t('shopNotFound')}</h2>
          <p className="text-gray-500">{t('contactSupport')}</p>
        </CardContent>
      </Card>
    );
  }

  const scooters = await getAdminInventory(shop.id);

  return (
    <InventoryListWithDrawer
      scooters={scooters}
      translations={{
        fleetInventory: t('fleetInventory'),
        manageInventory: t('manageInventory'),
        availabilityLink: t('availabilityLink'),
        addScooter: t('addScooter'),
        noScooters: t('noScooters'),
        deposit: t('deposit'),
        editScooter: t('editScooter'),
        updateDetails: t('updateDetails'),
        brand: t('brand'),
        modelName: t('modelName'),
        exampleModel: t('exampleModel'),
        engineSize: t('engineSize'),
        dailyPrice: t('dailyPrice'),
        depositAmount: t('depositAmount'),
        numberPlate: t('numberPlate'),
        mainImage: t('mainImage'),
        availableForRent: t('availableForRent'),
        saveChanges: t('saveChanges'),
        addNewScooter: t('addNewScooter'),
        expandFleet: t('expandFleet'),
        addToFleet: t('addToFleet'),
      }}
    />
  );
}
