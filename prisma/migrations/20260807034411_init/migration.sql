/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNo]` on the table `invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceNo` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "invoiceNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invoice_invoiceNo_key" ON "invoice"("invoiceNo");
