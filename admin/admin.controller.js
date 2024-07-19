import Admin from "./admin.model.js";
import express from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { generateHashedPassword } from "../utils/password.js";
import {
  loginAdminValidationSchema,
  validateAdminSchema,
} from "./admin.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const hashedPassword = await bcrypt.generateHashedPassword(
      plainPassword,
      saltRound
    );
    newAdmin.password = hashedPassword;

    //? add admin data to database
    await Admin.create(newAdmin);
    return res.status(200).send({ message: "Admin data added successfully" });
  }
);

//* login admin
router.get(
  "/login",
  validateReqBody(loginAdminValidationSchema),
  async (req, res) => {
    //? extract login credentials from req.body
    const loginCredentials = req.body;

    //? find admin using email
    const admin = await Admin.findOne({ email: loginCredentials.email });

    //? if not admin found, throw error
    if (!admin) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }
    //? check for password match
    const plainPassword = loginCredentials.password;
    const hashedPassword = admin.password;
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

    //? hide password
    admin.password = undefined;

    //? if not password match, throw error
    if (!isPasswordMatch) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    //? generate access token
    const payload = { email: admin.email }; //? object format as we are using json web format
    const sign = "klsdfjlksjlk"; //? signature through which we can decrypt the token

    const token = jwt.sign(payload, sign); //? imagine as token through which we can access payload

    //? send res
    return res
      .status(200)
      .send({ message: "Success", adminDetails: admin, accessToken: token });
  }
);

export default router;
