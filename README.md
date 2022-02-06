# Seadex

A Certain Smoke's Index

## Getting Started

1. Set up the database. We use PostgreSQL. Then, create the tables:

```sql
CREATE TABLE IF NOT EXISTS "shows" ("id" UUID , "isMovie" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "releases" ("id" UUID , "releaseGroup" TEXT NOT NULL, "notes" TEXT, "dualAudio" BOOLEAN NOT NULL DEFAULT false, "nyaaLink" TEXT, "bbtLink" TEXT, "toshLink" TEXT, "isRelease" BOOLEAN NOT NULL DEFAULT true, "isBestVideo" BOOLEAN NOT NULL DEFAULT true, "incomplete" BOOLEAN NOT NULL DEFAULT false, "isExclusiveRelease" BOOLEAN NOT NULL DEFAULT false, "isBroken" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "shows_releases" ("show" UUID  REFERENCES "shows" ("id"), "release" UUID NOT NULL  REFERENCES "releases" ("id"), "type" VARCHAR(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("show","release"));
CREATE UNIQUE INDEX "shows_releases_release" ON "shows_releases" ("release");
CREATE TABLE IF NOT EXISTS "show_names" ("id" UUID , "show" UUID  REFERENCES "shows" ("id"), "title" TEXT NOT NULL, "language" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id","show"));
CREATE UNIQUE INDEX "show_names_title_language" ON "show_names" ("title", "language");
```

2. Set up the environment variables based on `.env.example`.
3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
