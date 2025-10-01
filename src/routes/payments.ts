import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { payWithPaystack, payWithFlutterwave } from "../services/payments.js";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing endpoints
 */

/**
 * @swagger
 * /api/payments/paystack:
 *   post:
 *     summary: Initiate a Paystack payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               amount:
 *                 type: number
 *                 example: 10000
 *               bookingId:
 *                 type: string
 *                 example: "1234abcd"
 *     responses:
 *       200:
 *         description: Payment URL returned with commission info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                 commission:
 *                   type: number
 *       500:
 *         description: Paystack payment failed
 */
router.post("/paystack", async (req, res) => {
  try {
    const { email, amount, bookingId } = req.body;

    const commission = amount * 0.08;
    const netAmount = amount - commission;

    const response = await payWithPaystack(email, netAmount);

    await prisma.payment.create({
      data: { bookingId, amount: netAmount, method: "paystack", status: "pending" },
    });

    res.json({ paymentUrl: response.authorization_url, commission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Paystack payment failed" });
  }
});

/**
 * @swagger
 * /api/payments/flutterwave:
 *   post:
 *     summary: Initiate a Flutterwave payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               amount:
 *                 type: number
 *                 example: 10000
 *               bookingId:
 *                 type: string
 *                 example: "1234abcd"
 *     responses:
 *       200:
 *         description: Payment URL returned with commission info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                 commission:
 *                   type: number
 *       500:
 *         description: Flutterwave payment failed
 */
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
    console.error(error);
    res.status(500).json({ error: "Flutterwave payment failed" });
  }
});

export default router;
