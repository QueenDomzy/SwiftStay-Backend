import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Swagger Setup ----------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SwiftStay Nigeria API",
      version: "1.0.0",
      description: "API documentation for SwiftStay Nigeria platform",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ["./routes/*.js"], // <-- Make sure this path points to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// -----------------------------------

// Root route
app.get("/", (req, res) => {
  res.send("🚀 SwiftStay Nigeria Backend Running");
});

// Routes
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import adRoutes from "./routes/ads.js";

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ads", adRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
});
