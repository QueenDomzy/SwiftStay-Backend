import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 SwiftStay Nigeria Backend Running");
});

// TODO: mount routes (auth, properties, bookings, payments, ads)
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import bookingRoutes from "./routes/bookings";
import paymentRoutes from "./routes/payments";
import adRoutes from "./routes/ads";

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ads", adRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});