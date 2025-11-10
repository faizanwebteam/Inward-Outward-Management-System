import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inward–Outward Management System API",
      version: "1.0.0",
      description: "API documentation for Company, Supplier, and Customer modules",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to route files where Swagger comments are written
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Function to setup Swagger in app.js or server.js
export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
