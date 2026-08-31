-- CreateEnum
CREATE TYPE "midtrans_status" AS ENUM ('pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'refund');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "payment_status" ADD VALUE 'pending';
ALTER TYPE "payment_status" ADD VALUE 'failed';
ALTER TYPE "payment_status" ADD VALUE 'expired';
ALTER TYPE "payment_status" ADD VALUE 'cancelled';
ALTER TYPE "payment_status" ADD VALUE 'refunded';

-- CreateTable
CREATE TABLE "midtrans_transactions" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "midtransOrderId" TEXT NOT NULL,
    "transactionId" TEXT,
    "grossAmount" INTEGER NOT NULL,
    "paymentType" TEXT,
    "transactionStatus" "midtrans_status" NOT NULL DEFAULT 'pending',
    "fraudStatus" TEXT,
    "vaNumber" TEXT,
    "bank" TEXT,
    "snapToken" TEXT,
    "redirectUrl" TEXT,
    "transactionTime" TIMESTAMP(3),
    "expiryTime" TIMESTAMP(3),
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "midtrans_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "midtrans_transactions_midtransOrderId_key" ON "midtrans_transactions"("midtransOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "midtrans_transactions_transactionId_key" ON "midtrans_transactions"("transactionId");

-- AddForeignKey
ALTER TABLE "midtrans_transactions" ADD CONSTRAINT "midtrans_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
