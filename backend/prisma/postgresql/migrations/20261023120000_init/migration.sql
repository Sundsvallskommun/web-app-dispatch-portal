-- CreateTable
CREATE TABLE "Host" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "municipalityId" INTEGER NOT NULL,
    "domain" TEXT,
    "idpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDP" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "entryPoint" TEXT NOT NULL,
    "idpCert" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IDP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Host_name_key" ON "Host"("name");

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_idpId_fkey" FOREIGN KEY ("idpId") REFERENCES "IDP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
