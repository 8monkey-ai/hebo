-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "provider_configs" ADD COLUMN     "organization_id" TEXT NOT NULL;
