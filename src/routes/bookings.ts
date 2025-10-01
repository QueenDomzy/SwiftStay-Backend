import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../services/email.js";
import { sendSMS } from "../services/sms.js";
import { generateQR } from "../services/qr.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management for SwiftStay
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - propertyId
 *               - checkIn
 *               - checkOut
 *               - totalCost
 *               - phone
 *               - email
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               propertyId:
 *                 type: integer
 *                 example: 101
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-10"
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-15"
 *               totalCost:
 *                 type: number
 *                 example: 50000
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking:
 *                   type: object
 *                   example:
 *                     id: 1
 *                     userId: 1
 *                     propertyId: 101
 *                     checkIn: "2025-10-10"
 *                     checkOut: "2025-10-15"
 *                     totalCost: 50000
 *                 qrCode:
 *                   type: string
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *       500:
 *         description: Failed to create booking
 */

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
