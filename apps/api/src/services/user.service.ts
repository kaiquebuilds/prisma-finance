import { Prisma, PrismaClient, User } from "../generated/prisma/client";
import { env } from "@/env";
import logger from "@/lib/logger";

export interface FindOrCreateUserParams {
  authProviderId: string;
  email: string;
  name: string;
}

export async function findOrCreateUser(
  prisma: PrismaClient,
  params: FindOrCreateUserParams,
): Promise<User> {
  const { authProviderId, email, name } = params;

  try {
    return await prisma.user.upsert({
      where: { authProviderId },
      update: {},
      create: {
        authProviderId,
        email,
        name,
        termsAcceptedVersion: env.CURRENT_TERMS_OF_SERVICE_VERSION,
        privacyAcceptedVersion: env.CURRENT_PRIVACY_POLICY_VERSION,
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[]) ?? [];

      if (target.includes("email")) {
        logger.warn("Email collision during user creation", {
          authProviderId,
          email,
        });

        return await prisma.user.update({
          where: { email },
          data: { authProviderId },
        });
      }
    }

    throw error;
  }
}
