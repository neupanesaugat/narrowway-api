import express from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { validateCourseSchema } from "./course.validation.js";
import Course from "./course.model.js";
import jwt from "jsonwebtoken";
import Admin from "../admin/admin.model.js";

const router = express.Router();

//* add course
router.post(
  "/add",

  // validate token
  async (req, res, next) => {
    validateReqBody(validateCourseSchema);
    //? extract token from req.headers
    const authorization = req.headers.authorization;

    const splittedToken = authorization?.split(" "); //? splitting Bearer and token , ? => checking whether or not there is Authorization
    const token = splittedToken?.length === 2 ? splittedToken[1] : null; //? splittedToken has array of length 2, so token will be available only of there is Authorization and token, ? in middle refers to ternary operator

    //? if not token, throw error
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //? verify token, (if verification fails, throw error)
    let payload;

    try {
      const sign = "klsdfjlksjlk";
      payload = jwt.verify(token, sign);
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log(payload);

    //? find admin using payload
    const admin = await Admin.findOne({ email: payload.email });

    //? if not admin, throw error
    if (!admin) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //? extracting id of admin from the token
    req.loggedInUserId = admin._id; // adding new field in request with admin id

    next();
  },

  // call next function (add course)
  async (req, res) => {
    //extract new course from req.body
    const newCourse = req.body;

    newCourse.addedBy = req.loggedInUserId; //? adding field addedBy in newCourse and passing the admin id from req.loggedInUserId

    // add course
    await Course.create(newCourse);

    //send res
    return res.status(201).send({ message: "Course is added successfully" });
  }
);

//* get course list
router.get(
  "/list",
  //validate token
  async (req, res, next) => {
    validateReqBody(validateCourseSchema);
    //? extract token from req.headers
    const authorization = req.headers.authorization;

    const splittedToken = authorization?.split(" "); //? splitting Bearer and token , ? => checking whether or not there is Authorization
    const token = splittedToken?.length === 2 ? splittedToken[1] : null; //? splittedToken has array of length 2, so token will be available only of there is Authorization and token, ? in middle refers to ternary operator

    //? if not token, throw error
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //? verify token, (if verification fails, throw error)
    let payload;

    try {
      const sign = "klsdfjlksjlk";
      payload = jwt.verify(token, sign);
    } catch (error) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    console.log(payload);

    //? find admin using payload
    const admin = await Admin.findOne({ email: payload.email });

    //? if not admin, throw error
    if (!admin) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //? extracting id of admin from the token
    req.loggedInUserId = admin._id; // adding new field in request with admin id

    next();
  },

  //get admin list
  async (req, res) => {
    const courses = await Course.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "admins",
          localField: "addedBy",
          foreignField: "_id",
          as: "adminDetails",
        },
      },

      {
        $project: {
          _id: 0,
          name: 1,
          price: 1,
          duration: 1,
          adminEmail: { $first: "$adminDetails.email" },
          adminName: {
            $concat: [
              { $first: "$adminDetails.firstName" },
              " ",
              { $first: "$adminDetails.lastName" },
            ],
          },
        },
      },
    ]);
    return res.status(200).send({ message: "Success", courseList: courses });
  }
);

export default router;
