-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);
