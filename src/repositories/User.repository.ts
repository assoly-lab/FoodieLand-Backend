import { User as UserInterface } from "@/interfaces/User.interface";
import { User } from "@/models/User";
import { normalizeEmail } from "@/utils/email.utils";

export class UserRepository {
  
  async create(data: Partial<UserInterface>): Promise<UserInterface> {
    const user = new User(data);
    return await user.save();
  }
  
  async findByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<UserInterface | null> {
    const normalizedEmail = normalizeEmail(email);
    const query = User.findOne({
      $or: [
        { email },
        { email: normalizedEmail },
        { email: email.toLowerCase() },
      ],
    });
    if (includePassword) {
      query.select("+password");
    }
    const user = await query.exec();
    return user;
  }
  
  async findById(
    id: string,
    includePassword: boolean = false
  ): Promise<UserInterface | null> {
    const query = User.findById(id);
    if (includePassword) {
      query.select("+password");
    }
    return await query.exec();
  }
  
  async update(id: string, data: Partial<UserInterface>): Promise<UserInterface | null> {
    return await User.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }

}