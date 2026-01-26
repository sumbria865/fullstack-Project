// src/server.ts
import "dotenv/config"; // load environment variables
import app from "./app";
import connectDB from "./configs/database";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // exit process if DB connection fails
  }
}

// Start everything
startServer();