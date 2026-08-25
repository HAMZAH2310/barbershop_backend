-- CreateEnum
CREATE TYPE "barber_status" AS ENUM ('available', 'working', 'on_break');

-- AlterTable
ALTER TABLE "barbers" ADD COLUMN     "status" "barber_status" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "queueNumber" INTEGER;
