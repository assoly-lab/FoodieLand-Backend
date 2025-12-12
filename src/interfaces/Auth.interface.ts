import { SystemRole } from "@/core/enumerations/RolesEnum";
import { User } from "@/interfaces/User.interface";

export interface LoginResponse {
  user: Partial<User>;
  token: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
  role: SystemRole
}