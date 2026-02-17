export interface User {
  id: string;
  authProviderId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  termsAcceptedVersion: string;
  termsAcceptedAt: Date;
  privacyAcceptedVersion: string;
  privacyAcceptedAt: Date;
}

export interface CreateUserData {
  authProviderId: string;
  email: string;
  name: string;
  termsAcceptedVersion: string;
  privacyAcceptedVersion: string;
  termsAcceptedAt: Date;
  privacyAcceptedAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByAuthProviderId(authProviderId: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(
    authProviderId: string,
    data: Partial<Pick<User, "email" | "name">>,
  ): Promise<User>;
  updateByEmail(
    email: string,
    data: Partial<Pick<User, "authProviderId" | "name">>,
  ): Promise<User>;
  delete(authProviderId: string): Promise<void>;
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`);
    this.name = "EmailAlreadyExistsError";
  }
}
