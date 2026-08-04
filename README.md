# CharacterForge

Webová aplikace pro sdílení a správu postav stolních RPG her.
Bakalářská práce — Jindřich Kopejtko, Univerzita Pardubice 2026.

## Požadavky

- Node.js v22+
- npm v10+
- PostgreSQL 16+

## Instalace

1. Nainstaluj závislosti

npm install

2. Nastav proměnné prostředí — vytvoř soubor .env v kořenovém adresáři

Pro lokální PostgreSQL:
DATABASE_URL="postgresql://postgres:heslo@localhost:5432/characterforge"

Pro Supabase:
1. Vytvoř účet na https://supabase.com a založ nový projekt
2. V projektu přejdi na Settings → Database → Connection string → URI
3. Zkopíruj connection string a vlož ho do .env

DATABASE_URL="postgresql://postgres:[HESLO]@db.xxxxxxxxxxxx.supabase.co:5432/postgres"
NEXTAUTH_SECRET="zvol-nahodny-retezec"
NEXTAUTH_URL="http://localhost:3000"

3. Synchronizuj databázové schéma

npx prisma db push

4. Volitelně — naplň databázi testovacími daty

npm run seed

5. Spusť vývojový server

npm run dev

Aplikace bude dostupná na http://localhost:3000

## Testovací účty po spuštění seedu

| Username | Email | Heslo | Role |
|----------|-------|-------|------|
| DungeonMaster | dungeon@master.cz | Heslo123! | USER |
| ElaraWood | elara@elf.cz | Heslo123! | USER |
| IronForge | thorin@dwarf.cz | Heslo123! | USER |
| ShadowStep | shadow@rogue.cz | Heslo123! | USER |
| Admin | admin@characterforge.cz | Admin123! | ADMIN |

## Struktura projektu

src/app/ — stránky a API endpointy (Next.js App Router)
src/components/ — React komponenty
src/lib/ — pomocné funkce a konfigurace
src/types/ — TypeScript typy
prisma/ — databázové schéma a seed data
public/ — statické soubory

## Použité technologie

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth.js
- Zod
- Framer Motion