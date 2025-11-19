-- CreateTable
CREATE TABLE "Municipality" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "municipalityId" INTEGER NOT NULL,
    "name" TEXT,
    "logotypeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Municipality_logotypeId_fkey" FOREIGN KEY ("logotypeId") REFERENCES "Logotype" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "host" TEXT NOT NULL,
    "orgId" INTEGER NOT NULL,
    "name" TEXT,
    "logotypeId" INTEGER,
    "municipalityId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Organization_logotypeId_fkey" FOREIGN KEY ("logotypeId") REFERENCES "Logotype" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Organization_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality" ("municipalityId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Logotype" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "filenameLightMode" TEXT NOT NULL,
    "urlLightMode" TEXT NOT NULL,
    "filenameDarkMode" TEXT,
    "urlDarkMode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_municipalityId_key" ON "Municipality"("municipalityId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_host_key" ON "Organization"("host");
