export type Language = 'en' | 'th'

export const translations = {
  en: {
    // Shops list page
    exploreShops: 'Explore Shops',
    findTrustedRentals: 'Find trusted rentals across Chiang Mai',
    filters: 'Filters',
    verified: 'Verified',
    reliableScooterRentals: 'Reliable scooter rentals for travelers.',
    noShopsFound: 'No shops found yet',
    beFirstToList: 'Be the first to list your rental shop on Chiang Ride.',

    // Shop detail page
    backToExplore: 'Back to Explore',
    verifiedPartner: 'Verified Partner',
    depositPolicy: 'Deposit Policy',
    defaultDepositPolicy: 'Standard 1000 THB cash deposit or original passport required.',
    defaultShopDescription: 'A great local shop offering reliable scooters and friendly service.',
    availableBikes: 'Available Bikes',
    available: 'Available',
    unavailable: 'Unavailable',
    bookNow: 'Book Now',
    perDay: '/day',

    // Scooter detail page
    backToHome: 'Back to Home',
    automatic: 'Automatic',
    rentalRates: 'Rental Rates',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    depositRequired: 'Deposit Required',
    refundableDeposit: 'refundable deposit',
    availability: 'Availability (Next 14 Days)',
    bookThisScooter: 'Book This Scooter',

    // Common
    chiangMaiThailand: 'Chiang Mai, Thailand',
  },
  th: {
    // Shops list page
    exploreShops: 'สำรวจร้านเช่า',
    findTrustedRentals: 'ค้นหาร้านเช่าที่เชื่อถือได้ในเชียงใหม่',
    filters: 'ตัวกรอง',
    verified: 'ยืนยันแล้ว',
    reliableScooterRentals: 'บริการเช่ามอเตอร์ไซค์ที่เชื่อถือได้สำหรับนักท่องเที่ยว',
    noShopsFound: 'ยังไม่พบร้านเช่า',
    beFirstToList: 'เป็นคนแรกที่ลงทะเบียนร้านเช่าของคุณบน Chiang Ride',

    // Shop detail page
    backToExplore: 'กลับไปสำรวจ',
    verifiedPartner: 'พาร์ทเนอร์ที่ยืนยันแล้ว',
    depositPolicy: 'นโยบายมัดจำ',
    defaultDepositPolicy: 'มัดจำเงินสด 1,000 บาท หรือหนังสือเดินทางตัวจริง',
    defaultShopDescription: 'ร้านท้องถิ่นที่ดีพร้อมมอเตอร์ไซค์คุณภาพและบริการเป็นกันเอง',
    availableBikes: 'มอเตอร์ไซค์ที่พร้อมให้เช่า',
    available: 'ว่าง',
    unavailable: 'ไม่ว่าง',
    bookNow: 'จองเลย',
    perDay: '/วัน',

    // Scooter detail page
    backToHome: 'กลับหน้าแรก',
    automatic: 'ออโต้',
    rentalRates: 'ราคาเช่า',
    daily: 'รายวัน',
    weekly: 'รายสัปดาห์',
    monthly: 'รายเดือน',
    depositRequired: 'ต้องวางมัดจำ',
    refundableDeposit: 'มัดจำคืนได้',
    availability: 'ตารางว่าง (14 วันข้างหน้า)',
    bookThisScooter: 'จองมอเตอร์ไซค์นี้',

    // Common
    chiangMaiThailand: 'เชียงใหม่, ประเทศไทย',
  },
} as const

export type TranslationKey = keyof typeof translations.en
