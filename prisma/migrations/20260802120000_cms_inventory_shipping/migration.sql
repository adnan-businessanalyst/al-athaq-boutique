-- Variant inventory + size/weight; shipping methods; policies

ALTER TABLE "ProductVariant" ADD COLUMN "size" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN "weightGrams" INTEGER;
ALTER TABLE "ProductVariant" ADD COLUMN "quantityAvailable" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "CommerceSettings" ADD COLUMN "shippingPolicy" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CommerceSettings" ADD COLUMN "returnPolicy" TEXT NOT NULL DEFAULT '';

CREATE TABLE "ShippingMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "feeHalalas" INTEGER NOT NULL DEFAULT 0,
    "etaLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ShippingMethod_isActive_idx" ON "ShippingMethod"("isActive");
CREATE INDEX "ShippingMethod_sortOrder_idx" ON "ShippingMethod"("sortOrder");

ALTER TABLE "Order" ADD COLUMN "shippingMethodId" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippingMethodName" TEXT;

ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "ShippingMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
