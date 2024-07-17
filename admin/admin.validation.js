import Yup from "yup";

export const validateAdminSchema = Yup.object({
  email: Yup.string().required().trim().max(55).email().lowercase(),
  password: Yup.string().required().trim().min(4).max(20),
  firstName: Yup.string().required().trim().max(30),
  lastName: Yup.string().required().trim().max(30),
});

export const loginAdminValidationSchema = Yup.object({
  email: Yup.string().email().required().trim().lowercase(),
  password: Yup.string().required().trim(),
});
