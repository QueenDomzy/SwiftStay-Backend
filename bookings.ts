import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../services/email";
import { sendSMS } from "../services/sms";
import { generateQR } from "../services/qr";

const prisma = new PrismaClient();
const router = Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, checkIn, checkOut, totalCost, phone, email } = req.body;
    
    const booking = await prisma.booking.create({
      data: { userId, propertyId, checkIn, checkOut, totalCost },
    });
    
    // Generate QR code
    const qrCode = await generateQR(`Booking ID: ${booking.id}, User: ${userId}`);
    
    // Send Email confirmation
    await sendEmail(
      email,
      "Your SwiftStay Booking Confirmation",
      `<h3>Thank you for booking with SwiftStay!</h3>
       <p>Booking ID: ${booking.id}</p>
       <p>Check-in: ${checkIn}</p>
       <p>Check-out: ${checkOut}</p>
       <p>Total: ₦${totalCost}</p>
       <img src="${qrCode}" alt="Booking QR Code"/>`
    );
    
    // Send SMS notification
    await sendSMS(phone, `SwiftStay Booking Confirmed! ID: ${booking.id}, Amount: ₦${totalCost}`);
    
    res.json({ booking, qrCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;