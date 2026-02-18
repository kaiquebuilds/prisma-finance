import {
  EmailAlreadyExistsError,
  User,
  UserRepository,
} from "../repositories/user.repository";
import { env } from "@/env";
import logger from "@/lib/logger";

export interface FindOrCreateUserParams {
  authProviderId: string;
  email: string;
  name: string;
}

export async function findOrCreateUser(
  userRepo: UserRepository,
  params: FindOrCreateUserParams,
): Promise<User> {
  const { authProviderId, email, name } = params;

  const existing = await userRepo.findByAuthProviderId(authProviderId);
  if (existing) {
    return existing;
  }

  try {
    return await userRepo.create({
      authProviderId,
      email,
      name,
      termsAcceptedVersion: env.CURRENT_TERMS_OF_SERVICE_VERSION,
      privacyAcceptedVersion: env.CURRENT_PRIVACY_POLICY_VERSION,
      termsAcceptedAt: new Date(),
      privacyAcceptedAt: new Date(),
    });
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      logger.warn("Email collision during user creation", {
        authProviderId,
        email,
      });

      return await userRepo.updateByEmail(email, { authProviderId });
    }

    throw error;
  }
}
