import { JWT_REFRESH_SECRET } from "@/config/auth.config";
import { BadRequestError, UnauthorizedError } from "@/core/errors/AppErrors";
import { LoginResponse, TokenPayload } from "@/interfaces/Auth.interface";
import { User, UserPayload } from "@/interfaces/User.interface";
import { UserRepository } from "@/repositories/User.repository";
import jwt from "jsonwebtoken";


export class AuthService {
  private userRepository: UserRepository;
  
  constructor(){
    this.userRepository = new UserRepository();
  }
  
  private async _createLoginResponse(
    user: User,
  ): Promise<LoginResponse> {
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    await this.userRepository.update(String(user._id), {
      refreshToken: refreshToken,
    });
    
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  }
  
  async register(userData: UserPayload): Promise<User> {

    if (userData.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        userData.email,
        true
      );
      if (userWithEmail) {
        throw new BadRequestError("Email is already registered");
      }
    }
    return await this.userRepository.create(userData);
  }
  
  async login(
    identifier: string,
    password: string,
  ): Promise<LoginResponse> {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const user = isEmail &&  await this.userRepository.findByEmail(identifier, true)

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }
    return this._createLoginResponse(user);
  }
  
  async refreshToken(
    refreshToken: string,
  ): Promise<LoginResponse> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET as string
      ) as TokenPayload;
      const user = await this.userRepository.findById(decoded.id, true);
      if (!user) {
        throw new UnauthorizedError("Invalid refresh token");
      }
      return await this._createLoginResponse(user);
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }
  
  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: "" });
  }

}