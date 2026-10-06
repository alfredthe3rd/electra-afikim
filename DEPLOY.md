# פריסה לשרת (אקספים)

האתר רץ בשרת כשני קונטיינרים (`docker-compose.yml`):
- **app** — Next.js + Payload, מאזין רק על `127.0.0.1:3000`. ה-reverse proxy של אקספים מפנה אליו.
- **db** — PostgreSQL 17. הנתונים נשמרים ב-`../database/pgdata`.

המדיה (קבצים שהועלו בפאנל) נשמרת ב-`./media` על השרת, לא ב-Vercel Blob.

## מבנה תיקיות בשרת

```
/srv/sites/electra-afikim-group.co.il/
├── files/      ← הקוד (git clone), כולל media/ ו-.env
└── database/   ← pgdata/ של PostgreSQL
```

## התקנה ראשונה

```bash
cd ~/files
git clone -b about-page https://github.com/alfredthe3rd/electra-afikim.git .
cp .env.example .env
nano .env          # למלא סיסמה ו-PAYLOAD_SECRET (הוראות בתוך הקובץ)
mkdir -p media
```

### העברת התוכן מ-Neon

ערך ה-`DATABASE_URL_UNPOOLED` נמצא ב-Vercel ← Settings ← Environment Variables.

```bash
# 1. גיבוי מ-Neon לקובץ
docker run --rm postgres:17-alpine pg_dump "<DATABASE_URL_UNPOOLED>" \
  --no-owner --no-privileges -Fc > ~/neon.dump

# 2. הפעלת מסד הנתונים בלבד
docker compose up -d db

# 3. שחזור
docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges' < ~/neon.dump
```

### העברת המדיה מ-Vercel Blob

```bash
docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/w -w /w node:22-alpine \
  node scripts/download-media.mjs https://hebrew-cms.vercel.app ./media
```

### הפעלה

```bash
docker compose up -d --build
curl -I http://127.0.0.1:3000
```

## עדכון קוד

```bash
cd ~/files
git pull
docker compose up -d --build
```

## פקודות שימושיות

| מה | פקודה |
|---|---|
| מצב הקונטיינרים | `docker compose ps` |
| לוגים של האתר | `docker compose logs -f app` |
| הפעלה מחדש | `docker compose restart app` |
| גיבוי ידני של המסד | `docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > backup.dump` |

## הערות

- **migrations:** הסכמה הגיעה עם הגיבוי מ-Neon, ולכן לא צריך migrations בהתקנה הראשונה. לפני שינוי מבנה ב-collections צריך להוסיף אותן (`npx payload migrate:create`).
- **BLOB_READ_WRITE_TOKEN** לא מוגדר בשרת בכוונה. בלעדיו Payload שומר קבצים מקומית.
- **Vercel** נשאר פעיל עד שהשרת עובד, אבל שימו לב: תוכן שיוזן שם אחרי ההעברה לא יגיע לשרת.
