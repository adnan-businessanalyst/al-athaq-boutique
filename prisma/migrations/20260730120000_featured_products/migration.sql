-- Replace FeaturedTile with Featured (product slots 1–4)

DROP TABLE IF EXISTS "FeaturedTile";
DROP TYPE IF EXISTS "FeaturedPosition";

CREATE TABLE "Featured" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Featured_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Featured_position_key" ON "Featured"("position");

CREATE INDEX "Featured_productId_idx" ON "Featured"("productId");

CREATE INDEX "Featured_position_idx" ON "Featured"("position");

ALTER TABLE "Featured" ADD CONSTRAINT "Featured_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
