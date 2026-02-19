import { Prisma, PrismaClient } from "../generated/prisma/client";
import {
  CreateUserData,
  EmailAlreadyExistsError,
  User,
  UserRepository,
} from "./user.repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByAuthProviderId(authProviderId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { authProviderId } });
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = (error.meta?.target as string[]) ?? [];
        if (target.includes("email")) {
          throw new EmailAlreadyExistsError(data.email);
        }
      }
      throw error;
    }
  }

  async update(
    authProviderId: string,
    data: Partial<Pick<User, "email" | "name">>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { authProviderId }, data });
  }

  async updateByEmail(
    email: string,
    data: Partial<Pick<User, "authProviderId" | "name">>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { email }, data });
  }

  async delete(authProviderId: string): Promise<void> {
    await this.prisma.user.delete({ where: { authProviderId } });
  }
}
