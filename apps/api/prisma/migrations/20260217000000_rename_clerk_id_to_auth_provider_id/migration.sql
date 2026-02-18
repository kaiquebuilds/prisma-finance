-- RenameColumn
ALTER TABLE "User" RENAME COLUMN "clerkId" TO "authProviderId";

-- RenameIndex
ALTER INDEX "User_clerkId_key" RENAME TO "User_authProviderId_key";
