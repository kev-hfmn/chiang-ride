"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface BookingActionState {
  error?: string;
}

/**
 * Creates a new booking request for a scooter rental.
 * @param prevState - Previous action state (unused but required by useActionState)
 * @param formData - Form data containing booking details
 * @returns Error state if validation fails, otherwise redirects to bookings page
 */
export async function createBookingRequestAction(
  prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const supabase = createAdminClient();

  // Extract and validate form data
  const scooterId = formData.get("scooter_id");
  const shopId = formData.get("shop_id");
  const startDate = formData.get("start_date");
  const endDate = formData.get("end_date");
  const totalPriceStr = formData.get("total_price");
  const totalDaysStr = formData.get("total_days");
  const bookingFeeStr = formData.get("booking_fee");

  // Validate required fields
  if (!scooterId || typeof scooterId !== "string") {
    return { error: "Invalid scooter ID" };
  }
  if (!shopId || typeof shopId !== "string") {
    return { error: "Invalid shop ID" };
  }
  if (!startDate || typeof startDate !== "string") {
    return { error: "Start date is required" };
  }
  if (!endDate || typeof endDate !== "string") {
    return { error: "End date is required" };
  }

  // Parse and validate numeric fields
  const totalPrice = parseInt(totalPriceStr as string, 10);
  const totalDays = parseInt(totalDaysStr as string, 10);
  const bookingFee = parseInt(bookingFeeStr as string, 10) || 0;

  if (isNaN(totalPrice) || totalPrice <= 0) {
    return { error: "Invalid total price" };
  }
  if (isNaN(totalDays) || totalDays <= 0) {
    return { error: "Invalid rental duration" };
  }

  try {
    const { error } = await supabase.from("bookings").insert({
      scooter_id: scooterId,
      shop_id: shopId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      total_days: totalDays,
      status: "requested",
      customer_name: "Demo Renter", // Hardcoded for MVP
      renter_id: null, // No authenticated user for MVP
      booking_fee: bookingFee,
    });

    if (error) throw error;

    revalidatePath("/bookings");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return { error: `Failed to create booking: ${errorMessage}` };
  }

  redirect("/bookings");
}
