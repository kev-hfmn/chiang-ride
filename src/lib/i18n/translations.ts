export type Language = "en" | "th";

export const translations = {
  en: {
    // Shops list page
    exploreShops: "Explore Shops",
    findTrustedRentals: "Find trusted rentals across Chiang Mai",
    filters: "Filters",
    verified: "Verified",
    reliableScooterRentals: "Reliable scooter rentals for travelers.",
    noShopsFound: "No shops found yet",
    beFirstToList: "Be the first to list your rental shop on Chiang Ride.",

    // Shop detail page
    backToExplore: "Back to Explore",
    verifiedPartner: "Verified Partner",
    depositPolicy: "Deposit Policy",
    defaultDepositPolicy:
      "Standard 1000 THB cash deposit or original passport required.",
    defaultShopDescription:
      "A great local shop offering reliable scooters and friendly service.",
    availableBikes: "Available Bikes",
    available: "Available",
    unavailable: "Unavailable",
    bookNow: "Book Now",
    perDay: "/day",

    // Scooter detail page
    backToHome: "Back to Home",
    automatic: "Automatic",
    rentalRates: "Rental Rates",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    depositRequired: "Deposit Required",
    refundableDeposit: "refundable deposit",
    availability: "Availability (Next 14 Days)",
    bookThisScooter: "Book This Scooter",

    // Common
    chiangMaiThailand: "Chiang Mai, Thailand",

    // Shop Admin Dashboard
    partnerDashboard: "Partner Dashboard",
    welcomeBack: "Welcome back",
    settings: "Settings",
    addBike: "Add Bike",
    demoModeActive: "Demo Mode Active",
    demoModeMessage: "We couldn't find your shop, so we loaded a demo profile.",
    fleet: "Fleet",
    activeBookings: "Active",
    pendingRequests: "Pending",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    noRecentBookings: "No recent bookings",
    days: "days",

    guest: "Guest",

    // Shop Admin - Inventory
    fleetInventory: "Your Fleet",
    manageInventory: "Manage your bikes and pricing.",
    availabilityLink: "Availability",
    addScooter: "Add Scooter",
    noScooters: "No scooters in your fleet yet.",
    shopNotFound: "Shop Not Found",
    contactSupport: "Please log in or contact support.",
    deposit: "Deposit",

    // Shop Admin - Bookings
    bookings: "Bookings",
    noBookings: "No bookings found.",
    guestUser: "Guest User",
    noContactInfo: "No contact info",
    total: "Total",
    reject: "Reject",
    accept: "Accept",
    markCompleted: "Mark Completed",
    startRental: "Start Rental",

    // Statuses
    statusActive: "Active",
    statusConfirmed: "Confirmed",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    statusRejected: "Rejected",
    statusPending: "Pending",

    // Shop Admin - Settings
    shopSettings: "Shop Settings",
    manageSettings: "Manage your shop profile, location, and policies.",
    basicInfo: "Basic Info",
    shopName: "Shop Name",
    description: "Description",
    location: "Location",
    address: "Address",
    city: "City",
    latitude: "Latitude",
    longitude: "Longitude",
    locationTip:
      "Tip: Find coordinates on Google Maps by right-clicking your location.",
    defaultDepositAmount: "Default Deposit Amount (THB)",
    depositPolicyText: "Deposit Policy Text",
    depositPolicyHint:
      "This will be shown to renters on your shop and scooter pages.",
    saveChanges: "Save Changes",
    seedScriptHint:
      "Please run the database seed script to create a demo shop.",

    // Add/Edit Scooter
    addNewScooter: "Add New Scooter",
    editScooter: "Edit Scooter",
    expandFleet: "Expand your fleet.",
    updateDetails: "Update details and availability.",
    brand: "Brand",
    modelName: "Model Name",
    engineSize: "Engine (cc)",
    dailyPrice: "Daily Price (฿)",
    depositAmount: "Deposit (฿)",
    numberPlate: "Number Plate",
    mainImage: "Main Image",
    addToFleet: "Add to Fleet",
    availableForRent: "Available for Rent (Active)",
    unauthorized: "Unauthorized",
    noPermissionEdit: "You do not have permission to edit this scooter.",
    returnToInventory: "Return to Inventory",
    exampleModel: "e.g. Click 160, NMAX",

    // Loading states
    loading: "Loading...",
    findingYourRide: "Finding your next ride",
    openingShopDashboard: "Opening shop dashboard",

    // Shop Admin - Calendar
    calendarAvailability: "Availability",
    calendarSubtitle: "Next 2 weeks at a glance.",
    calendarAvailable: "Available",
    calendarBooked: "Booked",
    calendarScooter: "Scooter",

    // Navigation
    navHome: "Home",
    navExplore: "Explore",
    navRides: "Rides",
    navProfile: "Profile",
    navDashboard: "Dashboard",
    navFleet: "Fleet",
    navCalendar: "Calendar",
    navBookings: "Bookings",
    navAdmin: "Admin",
    navRenter: "Renter",
    navShop: "Shop",
    navShopManagement: "Shop Management",
    navRenterMenu: "Renter Menu",
    navHomeDashboard: "Home Dashboard",
    navFindShop: "Find a Shop",
    navMyBookings: "My Bookings",
    navAccountProfile: "Account Profile",
    navShopOverview: "Shop Overview",
    navManageInventory: "Manage Inventory",
    navShopCalendar: "Shop Calendar",
    navActiveOrders: "Active Orders",
    navGlobalSettings: "Global Settings",
  },
  th: {
    // Shops list page
    exploreShops: "สำรวจร้านเช่า",
    findTrustedRentals: "ค้นหาร้านเช่าที่เชื่อถือได้ในเชียงใหม่",
    filters: "ตัวกรอง",
    verified: "ยืนยันแล้ว",
    reliableScooterRentals:
      "บริการเช่ามอเตอร์ไซค์ที่เชื่อถือได้สำหรับนักท่องเที่ยว",
    noShopsFound: "ยังไม่พบร้านเช่า",
    beFirstToList: "เป็นคนแรกที่ลงทะเบียนร้านเช่าของคุณบน Chiang Ride",

    // Shop detail page
    backToExplore: "กลับไปสำรวจ",
    verifiedPartner: "พาร์ทเนอร์ที่ยืนยันแล้ว",
    depositPolicy: "นโยบายมัดจำ",
    defaultDepositPolicy: "มัดจำเงินสด 1,000 บาท หรือหนังสือเดินทางตัวจริง",
    defaultShopDescription:
      "ร้านท้องถิ่นที่ดีพร้อมมอเตอร์ไซค์คุณภาพและบริการเป็นกันเอง",
    availableBikes: "มอเตอร์ไซค์ที่พร้อมให้เช่า",
    available: "ว่าง",
    unavailable: "ไม่ว่าง",
    bookNow: "จองเลย",
    perDay: "/วัน",

    // Scooter detail page
    backToHome: "กลับหน้าแรก",
    automatic: "ออโต้",
    rentalRates: "ราคาเช่า",
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
    depositRequired: "ต้องวางมัดจำ",
    refundableDeposit: "มัดจำคืนได้",
    availability: "ตารางว่าง (14 วันข้างหน้า)",
    bookThisScooter: "จองมอเตอร์ไซค์นี้",

    // Common
    chiangMaiThailand: "เชียงใหม่, ประเทศไทย",

    // Shop Admin Dashboard
    partnerDashboard: "แดชบอร์ดพาร์ทเนอร์",
    welcomeBack: "ยินดีต้อนรับกลับ",
    settings: "การตั้งค่า",
    addBike: "เพิ่มรถ",
    demoModeActive: "โหมดสาธิตใช้งานอยู่",
    demoModeMessage: "เราหากร้านของคุณไม่พบ จึงแสดงข้อมูลสาธิตแทน",
    fleet: "รถทั้งหมด",
    activeBookings: "การจองที่ใช้งานอยู่",
    pendingRequests: "คำขอที่รออนุมัติ",
    recentActivity: "กิจกรรมล่าสุด",
    viewAll: "ดูทั้งหมด",
    noRecentBookings: "ไม่มีการจองล่าสุด",
    days: "วัน",
    guest: "ลูกค้าทั่วไป",

    // Shop Admin - Inventory
    fleetInventory: "รถทั้งหมดในระบบ",
    manageInventory: "จัดการรถและราคาของคุณ",
    availabilityLink: "ตารางว่าง",
    addScooter: "เพิ่มรถ",
    noScooters: "ยังไม่มีรถในระบบ",
    shopNotFound: "ไม่พบร้านค้า",
    contactSupport: "กรุณาเข้าสู่ระบบหรือติดต่อฝ่ายสนับสนุน",
    deposit: "มัดจำ",

    // Shop Admin - Bookings
    bookings: "การจอง",
    noBookings: "ไม่พบการจอง",
    guestUser: "ผู้ใช้งานทั่วไป",
    noContactInfo: "ไม่มีข้อมูลติดต่อ",
    total: "ยอดรวม",
    reject: "ปฏิเสธ",
    accept: "ยอมรับ",
    markCompleted: "ทำเครื่องหมายว่าเสร็จสิ้น",
    startRental: "เริ่มการเช่า",

    // Statuses
    statusActive: "ใช้งานอยู่",
    statusConfirmed: "ยืนยันแล้ว",
    statusCompleted: "เสร็จสิ้น",
    statusCancelled: "ยกเลิกแล้ว",
    statusRejected: "ปฏิเสธแล้ว",
    statusPending: "รออนุมัติ",

    // Shop Admin - Settings
    shopSettings: "ตั้งค่าร้านค้า",
    manageSettings: "จัดการข้อมูลร้านค้า ที่ตั้ง และนโยบาย",
    basicInfo: "ข้อมูลพื้นฐาน",
    shopName: "ชื่อร้าน",
    description: "รายละเอียด",
    location: "ที่ตั้ง",
    address: "ที่อยู่",
    city: "เมือง",
    latitude: "ละติจูด",
    longitude: "ลองจิจูด",
    locationTip: "เคล็ดลับ: หาพิกัดบน Google Maps โดยคลิกขวาที่จุดที่ต้องการ",
    defaultDepositAmount: "จำนวนเงินมัดจำเริ่มต้น (บาท)",
    depositPolicyText: "ข้อความนโยบายมัดจำ",
    depositPolicyHint: "ข้อความนี้จะแสดงให้ลูกค้าเห็นในหน้าร้านและหน้ารถ",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    seedScriptHint: "กรุณารันสคริปต์ seed เพื่อสร้างร้านค้าตัวอย่าง",

    // Add/Edit Scooter
    addNewScooter: "เพิ่มรถใหม่",
    editScooter: "แก้ไขข้อมูลรถ",
    expandFleet: "เพิ่มรถในระบบของคุณ",
    updateDetails: "อัพเดทรายละเอียดและสถานะความพร้อม",
    brand: "ยี่ห้อ",
    modelName: "รุ่น",
    engineSize: "ขนาดเครื่องยนต์ (ซีซี)",
    dailyPrice: "ราคาเช่ารายวัน (บาท)",
    depositAmount: "เงินมัดจำ (บาท)",
    addToFleet: "เพิ่มในรายการรถ",
    availableForRent: "เปิดให้เช่า (ใช้งาน)",
    unauthorized: "ไม่ได้รับอนุญาต",
    noPermissionEdit: "คุณไม่มีสิทธิ์แก้ไขข้อมูลรถคันนี้",
    returnToInventory: "กลับหน้ารายการรถ",
    exampleModel: "เช่น Click 160, NMAX",

    // Loading states
    loading: "กำลังโหลด...",
    findingYourRide: "กำลังค้นหารถให้คุณ",
    openingShopDashboard: "กำลังเปิดแดชบอร์ดร้านค้า",

    // Shop Admin - Calendar
    calendarAvailability: "ตารางว่าง",
    calendarSubtitle: "ภาพรวม 2 สัปดาห์ข้างหน้า",
    calendarAvailable: "ว่าง",
    calendarBooked: "ถูกจองแล้ว",
    calendarScooter: "รถ",

    // Navigation
    navHome: "หน้าแรก",
    navExplore: "สำรวจ",
    navRides: "การเช่า",
    navProfile: "โปรไฟล์",
    navDashboard: "แดชบอร์ด",
    navFleet: "รถ",
    navCalendar: "ปฏิทิน",
    navBookings: "การจอง",
    navAdmin: "จัดการ",
    navRenter: "ผู้เช่า",
    navShop: "ร้านค้า",
    navShopManagement: "จัดการร้านค้า",
    navRenterMenu: "เมนูผู้เช่า",
    navHomeDashboard: "หน้าแรก",
    navFindShop: "ค้นหาร้าน",
    navMyBookings: "การจองของฉัน",
    navAccountProfile: "บัญชีผู้ใช้",
    navShopOverview: "ภาพรวมร้าน",
    navManageInventory: "จัดการรถ",
    navShopCalendar: "ปฏิทินร้าน",
    navActiveOrders: "ออเดอร์ที่ใช้งาน",
    navGlobalSettings: "ตั้งค่าทั่วไป",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
