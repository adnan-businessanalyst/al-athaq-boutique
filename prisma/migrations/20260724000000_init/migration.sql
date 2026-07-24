-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'svg');

-- CreateEnum
CREATE TYPE "FeaturedPosition" AS ENUM ('LARGE', 'WIDE', 'SMALL_A', 'SMALL_B');

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT 'Tradition you can carry home.',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroMediaUrl" TEXT NOT NULL,
    "heroMediaType" "MediaType" NOT NULL DEFAULT 'image',
    "heroPosterUrl" TEXT,
    "ctaPrimaryLabel" TEXT NOT NULL,
    "ctaPrimaryHref" TEXT NOT NULL,
    "ctaSecondaryLabel" TEXT NOT NULL,
    "ctaSecondaryHref" TEXT NOT NULL,
    "storyHeading" TEXT NOT NULL,
    "storyParagraph1" TEXT NOT NULL,
    "storyParagraph2" TEXT NOT NULL,
    "storyCtaLabel" TEXT NOT NULL,
    "storyCtaHref" TEXT NOT NULL,
    "storyMediaUrl" TEXT NOT NULL,
    "storyMediaType" "MediaType" NOT NULL DEFAULT 'image',
    "storyPosterUrl" TEXT,
    "storyBgUrl" TEXT NOT NULL,
    "storyBgType" "MediaType" NOT NULL DEFAULT 'image',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedTile" (
    "id" TEXT NOT NULL,
    "position" "FeaturedPosition" NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'image',
    "posterUrl" TEXT,
    "alt" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'image',
    "posterUrl" TEXT,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedTile_position_key" ON "FeaturedTile"("position");

-- CreateIndex
CREATE INDEX "FeaturedTile_sortOrder_idx" ON "FeaturedTile"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_sortOrder_idx" ON "Product"("sortOrder");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
