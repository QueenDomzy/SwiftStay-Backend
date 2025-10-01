import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Advertisement management
 */

/**
 * @swagger
 * /api/ads:
 *   post:
 *     summary: Create a new ad
 *     tags: [Ads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Summer Promo"
 *               content:
 *                 type: string
 *                 example: "Get 20% off on all bookings this summer!"
 *     responses:
 *       200:
 *         description: The created ad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *       500:
 *         description: Failed to create ad
 */
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const ad = await prisma.ad.create({ data: { title, content } });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ad" });
  }
});

/**
 * @swagger
 * /api/ads:
 *   get:
 *     summary: Get all active ads
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: List of active ads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 */
router.get("/", async (req, res) => {
  const ads = await prisma.ad.findMany({ where: { isActive: true } });
  res.json(ads);
});

export default router;
