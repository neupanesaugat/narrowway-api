import express from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { generateHashedPassword } from "../utils/password.js";
import Admin from "./admin.model.js";
import { validateAdminSchema } from "./admin.validation.js";

const router = express.Router();

//* register admin
router.post(
  "/register",
  validateReqBody(validateAdminSchema),
  async (req, res) => {
    //? extract new Admin
    const newAdmin = req.body;

    //? find admin with provided email
    const admin = await Admin.findOne({ email: newAdmin.email });

    //? if admin exist, throw error
    if (admin) {
      return res.status(409).send({ message: "Admin already exist" });
    }

    //? generate hashed password
    const plainPassword = newAdmin.password;
    const saltRound = 10; // increases randomness
    //calling function from utils/password
    const hashedPassword = await generateHashedPassword(
      plainPassword,
      saltRound
    );
    newAdmin.password = hashedPassword;

    //? add admin data to database
    await Admin.create(newAdmin);
    return res.status(200).send({ message: "Admin data added successfully" });
  }
);

export default router;
