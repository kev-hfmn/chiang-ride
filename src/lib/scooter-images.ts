// Curated Unsplash photos for different scooter types
// All photos are free to use under Unsplash license

const SCOOTER_IMAGES: Record<string, string> = {
  // Honda models
  "honda-click":
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80",
  "honda-pcx":
    "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600&q=80",
  "honda-scoopy":
    "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80",
  "honda-forza":
    "https://images.unsplash.com/photo-1622185135505-2d795003f6f6?w=600&q=80",
  "honda-adv":
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",

  // Yamaha models
  "yamaha-nmax":
    "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&q=80",
  "yamaha-aerox":
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80",
  "yamaha-filano":
    "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=600&q=80",
  "yamaha-xmax":
    "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600&q=80",
  "yamaha-lexi":
    "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&q=80",

  // Vespa models
  vespa: "https://images.unsplash.com/photo-1558981033-0f0309284409?w=600&q=80",
  "vespa-sprint":
    "https://images.unsplash.com/photo-1558981033-0f0309284409?w=600&q=80",
  "vespa-sprint-150":
    "https://images.unsplash.com/photo-1558981033-0f0309284409?w=600&q=80",
  "vespa-primavera":
    "https://images.unsplash.com/photo-1558981033-0f0309284409?w=600&q=80",

  // GPX models
  "gpx-drone":
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  "gpx-drone-150":
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",

  // Generic fallbacks by brand
  honda: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80",
  yamaha:
    "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&q=80",
  suzuki:
    "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80",
  gpx: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",

  // Default fallback
  default:
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80",
};

// Color variations for visual variety
const COLOR_VARIANTS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80", // Red scooter
  "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&q=80", // White scooter
  "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80", // Black scooter
  "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600&q=80", // Silver scooter
  "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&q=80", // Blue scooter
  "https://images.unsplash.com/photo-1595787572747-c767c9021caf?w=600&q=80", // Classic vespa
  "https://images.unsplash.com/photo-1622185135505-2d795003f6f6?w=600&q=80", // Modern scooter
  "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&q=80", // Street scooter
];

export function getScooterImage(
  brand?: string,
  model?: string,
  scooterId?: string,
): string {
  if (!brand && !model) {
    // Use scooterId to pick a consistent but varied image
    if (scooterId) {
      const index = Math.abs(hashCode(scooterId)) % COLOR_VARIANTS.length;
      return COLOR_VARIANTS[index];
    }
    return SCOOTER_IMAGES.default;
  }

  const brandLower = (brand || "").toLowerCase();
  const modelLower = (model || "").toLowerCase();

  // Try exact brand-model match
  const exactKey = `${brandLower}-${modelLower}`.replace(/\s+/g, "-");
  if (SCOOTER_IMAGES[exactKey]) {
    return SCOOTER_IMAGES[exactKey];
  }

  // Try partial model match
  for (const key of Object.keys(SCOOTER_IMAGES)) {
    if (modelLower.includes(key.split("-")[1] || "")) {
      return SCOOTER_IMAGES[key];
    }
  }

  // Try brand fallback
  if (SCOOTER_IMAGES[brandLower]) {
    return SCOOTER_IMAGES[brandLower];
  }

  // Use scooterId for consistent variety
  if (scooterId) {
    const index = Math.abs(hashCode(scooterId)) % COLOR_VARIANTS.length;
    return COLOR_VARIANTS[index];
  }

  return SCOOTER_IMAGES.default;
}

// Simple hash function for consistent image selection
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
