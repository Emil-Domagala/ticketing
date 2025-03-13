import jwt from 'jsonwebtoken';

export interface UserPayload {
  email: string;
  id: string;
}

export const createToken = (email: string, id: string) => {
  return jwt.sign({ email, id }, process.env.JWT_KEY!);
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
};
