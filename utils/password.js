import bcrypt from "bcrypt";

export const generateHashedPassword = async (plainPassword, saltRound) => {
  const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
  return hashedPassword;
};
