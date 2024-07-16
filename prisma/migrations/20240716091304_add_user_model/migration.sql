-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'READER');

-- CreateEnum
CREATE TYPE "AccountVerification" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "accountVerification" "AccountVerification" NOT NULL DEFAULT 'PENDING',
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
