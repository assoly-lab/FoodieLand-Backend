import { SystemRole } from "@/core/enumerations/RolesEnum";
import { Document } from "mongoose";


export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: SystemRole;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}