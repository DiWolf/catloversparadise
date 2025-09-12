import "express";
import { UserWithRole } from "../../types/User";

declare global {
  namespace Express {
    interface User extends UserWithRole {
      // Extend UserWithRole for session
    }
  }
}
