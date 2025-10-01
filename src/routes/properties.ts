import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management endpoints
 */

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Add a new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - price
 *               - description
 *               - images
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hotel XYZ
 *               location:
 *                 type: string
 *                 example: Lagos
 *               price:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: Luxury hotel
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *               ownerId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Property created successfully
 *       500:
 *         description: Failed to add property
 */
router.post("/", async (req, res) => {
  try {
    const { name, location, price, description, images, ownerId } = req.body;
    const property = await prisma.property.create({
      data: { name, location, price, description, images, ownerId },
    });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to add property" });
  }
});

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get("/", async (req, res) => {
  const properties = await prisma.property.findMany({ include: { owner: true } });
  res.json(properties);
});

export default router;
