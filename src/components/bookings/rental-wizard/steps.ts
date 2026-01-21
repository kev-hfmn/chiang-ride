export interface RentalStep {
  id: string;
  title: string;
  description: string;
}

export const RENTAL_STEPS: RentalStep[] = [
  {
    id: "front",
    title: "Front View",
    description: "Take a clear photo of the front of the scooter.",
  },
  {
    id: "left",
    title: "Left Side",
    description: "Capture any existing scratches or dents on the left side.",
  },
  {
    id: "right",
    title: "Right Side",
    description: "Capture any existing scratches or dents on the right side.",
  },
  {
    id: "back",
    title: "Rear View",
    description: "Take a photo of the back, including the license plate.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Photograph the fuel gauge and odometer reading.",
  },
];
