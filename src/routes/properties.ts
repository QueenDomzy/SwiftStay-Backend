import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Add property
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

// Get all properties
router.get("/", async (req, res) => {
  const properties = await prisma.property.findMany({ include: { owner: true } });
  res.json(properties);
});

export default router;