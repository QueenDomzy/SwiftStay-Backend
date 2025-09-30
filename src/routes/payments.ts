import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { payWithPaystack, payWithFlutterwave } from "../services/payments";

const prisma = new PrismaClient();
const router = Router();

// Paystack payment
router.post("/paystack", async (req, res) => {
  try {
    const { email, amount, bookingId } = req.body;
    
    // auto 8% commission deduction
    const commission = amount * 0.08;
    const netAmount = amount - commission;
    
    const response = await payWithPaystack(email, netAmount);
    
    // Save payment record
    await prisma.payment.create({
      data: { bookingId, amount: netAmount, method: "paystack", status: "pending" },
    });
    
    res.json({ paymentUrl: response.authorization_url, commission });
  } catch (error) {
    res.status(500).json({ error: "Paystack payment failed" });
  }
});

// Flutterwave payment
router.post("/flutterwave", async (req, res) => {
  try {
    const { email, amount, bookingId } = req.body;
    
    const tx_ref = `swiftstay-${Date.now()}`;
    const commission = amount * 0.08;
    const netAmount = amount - commission;
    
    const response = await payWithFlutterwave(netAmount, email, tx_ref);
    
    await prisma.payment.create({
      data: { bookingId, amount: netAmount, method: "flutterwave", status: "pending" },
    });
    
    res.json({ paymentUrl: response.data.link, commission });
  } catch (error) {
    res.status(500).json({ error: "Flutterwave payment failed" });
  }
});

export default router;