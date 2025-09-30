import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Create ad
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const ad = await prisma.ad.create({ data: { title, content } });
    
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ad" });
  }
});

// Get active ads
router.get("/", async (req, res) => {
  const ads = await prisma.ad.findMany({ where: { isActive: true } });
  res.json(ads);
});

export default router;