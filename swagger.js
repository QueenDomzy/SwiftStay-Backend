const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SwiftStay Nigeria API",
      version: "1.0.0",
      description: "API documentation for SwiftStay Nigeria platform",
    },
    servers: [
      {
        url: "http://localhost:3000", // change if hosted
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
