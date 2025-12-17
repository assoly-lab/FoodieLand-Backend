import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from "@/config/auth.config";
import { normalizeEmail } from "@/utils/email.utils";
import { SystemRole } from "@/core/enumerations/RolesEnum";
import { User as UserInterface } from "@/interfaces/User.interface";

const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(SystemRole),
      default: SystemRole.USER,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(
        _,
        ret: Partial<
          mongoose.FlatRecord<UserInterface> &
            Required<{
              _id: mongoose.Types.ObjectId;
            }> & {
              __v: number;
            }
        >,
      ) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.email) {
    this.email = normalizeEmail(this.email);
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    console.log(this.password, candidatePassword);
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      systemRole: this.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const refreshToken = jwt.sign(
    {
      id: this._id,
      systemRole: this.role,

    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    },
  );

  this.refreshToken = refreshToken;
  this.save();

  return refreshToken;
};

export const User = model<UserInterface>("User", userSchema);
