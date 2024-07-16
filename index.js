import express from "express";
import connectDB from "./database-connection/connect.db.js";
import { printLightBlue } from "./utils/color.console.js";
import adminRoutes from "./admin/admin.controller.js";

const app = express();

//? make express use json
app.use(express.json());

//? database connection
await connectDB();

//? routes
app.use("/admin", adminRoutes);

//? assign port
const PORT = 8000;

//? listen to port
app.listen(PORT, () => {
  console.log(printLightBlue(`App is listening on port ${PORT}`));
});
