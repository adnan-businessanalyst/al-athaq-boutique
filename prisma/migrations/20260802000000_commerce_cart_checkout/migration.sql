-- Commerce: variants, delivery, customers, orders, settings

CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "FulfillmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE "LocationVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_REVIEW');

ALTER TABLE "Product" ADD COLUMN "longDescription" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sku" TEXT,
    "priceHalalas" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'SA',
    "city" TEXT NOT NULL,
    "district" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "shippingFeeHalalas" INTEGER NOT NULL DEFAULT 0,
    "leadTimeDaysMin" INTEGER NOT NULL DEFAULT 1,
    "leadTimeDaysMax" INTEGER NOT NULL DEFAULT 3,
    "etaLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliverySlot" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DeliverySlot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommerceSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "purchasePolicy" TEXT NOT NULL,
    "deliveryInstructions" TEXT NOT NULL,
    "orderPrefix" TEXT NOT NULL DEFAULT 'ATH',
    "shopWhatsAppE164" TEXT,
    "currencyLabel" TEXT NOT NULL DEFAULT 'SAR',
    "orderSequence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommerceSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "country" TEXT NOT NULL DEFAULT 'SA',
    "postalCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "confirmationNumber" TEXT NOT NULL,
    "customerId" TEXT,
    "addressId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "isGuest" BOOLEAN NOT NULL DEFAULT true,
    "zoneId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "deliveryDate" DATE NOT NULL,
    "shippingFeeHalalas" INTEGER NOT NULL,
    "subtotalHalalas" INTEGER NOT NULL,
    "totalHalalas" INTEGER NOT NULL,
    "currencyLabel" TEXT NOT NULL DEFAULT 'SAR',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'PENDING',
    "locationVerificationStatus" "LocationVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "policyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "customerNotes" TEXT,
    "emailStubSentAt" TIMESTAMP(3),
    "whatsappStubNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "productName" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "variantLabel" TEXT NOT NULL,
    "unitPriceHalalas" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotalHalalas" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_isActive_idx" ON "ProductVariant"("isActive");
CREATE INDEX "DeliveryZone_country_city_idx" ON "DeliveryZone"("country", "city");
CREATE INDEX "DeliveryZone_isActive_idx" ON "DeliveryZone"("isActive");
CREATE INDEX "DeliverySlot_zoneId_idx" ON "DeliverySlot"("zoneId");
CREATE INDEX "DeliverySlot_isActive_idx" ON "DeliverySlot"("isActive");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");
CREATE INDEX "Address_city_idx" ON "Address"("city");
CREATE UNIQUE INDEX "Order_confirmationNumber_key" ON "Order"("confirmationNumber");
CREATE INDEX "Order_confirmationNumber_idx" ON "Order"("confirmationNumber");
CREATE INDEX "Order_email_idx" ON "Order"("email");
CREATE INDEX "Order_fulfillmentStatus_idx" ON "Order"("fulfillmentStatus");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliverySlot" ADD CONSTRAINT "DeliverySlot_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "DeliverySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
