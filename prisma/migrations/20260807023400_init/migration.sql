/*
  Warnings:

  - You are about to drop the column `amountRecived` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amountReceived` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "amountRecived",
ADD COLUMN     "amountReceived" INTEGER NOT NULL,
ALTER COLUMN "change" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "payment_orderId_key" ON "payment"("orderId");
