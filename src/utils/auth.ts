import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
}

const generateToken = (user: TokenPayload): string => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

export default generateToken;