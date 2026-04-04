import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      isAdmin?: boolean;
    }

    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      logout(callback: (err: any) => void): void;
    }
  }
}