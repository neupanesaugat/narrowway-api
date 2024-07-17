import Yup from "yup";

export const validateCourseSchema = Yup.object({
  name: Yup.string().required().trim().max(60),
  price: Yup.number().required().min(0),
  duration: Yup.number().required().min(1),
});
