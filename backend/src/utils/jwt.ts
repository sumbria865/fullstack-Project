import jwt from "jsonwebtoken";

export const generateToken = (payload: {
  id: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
