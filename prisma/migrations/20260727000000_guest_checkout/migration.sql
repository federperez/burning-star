-- Guest checkout: customer and delivery data live on the order.
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "Order"
ADD COLUMN "accessToken" TEXT,
ADD COLUMN "customerEmail" TEXT,
ADD COLUMN "customerName" TEXT,
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "shippingAddress" TEXT,
ADD COLUMN "apartment" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "province" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "notes" TEXT;

CREATE UNIQUE INDEX "Order_accessToken_key" ON "Order"("accessToken");

ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Keep a snapshot of each purchased product so old orders remain readable
-- even when a product is edited or removed later.
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "OrderItem"
ADD COLUMN "productName" TEXT,
ADD COLUMN "productImageUrl" TEXT;

UPDATE "OrderItem" AS item
SET
  "productName" = product."name",
  "productImageUrl" = product."imageUrl"
FROM "Product" AS product
WHERE item."productId" = product."id";

ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
