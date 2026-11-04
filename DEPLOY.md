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
# branch: deploy-docker (until it is merged into the main working branch)
git clone -b deploy-docker https://github.com/alfredthe3rd/electra-afikim.git .
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

## העלאת לוח הבקרה (פעם אחת בלבד)

העדכון הראשון שכולל את לוח הבקרה מריץ migration שיוצר את הטבלאות החדשות וממלא אותן בתוכן הקיים. הוא רק מוסיף: הוא לא מוחק ולא משנה חטיבות או מדיה קיימות.

**הסדר חשוב.** במסד בשרת יש שורה בשם `dev` בטבלת `payload_migrations`, שנשארה ממצב פיתוח. אם היא קיימת כשהקוד החדש עולה, Payload עוצר על שאלה שאין מי שיענה עליה, והאתר נתקע בלי לענות לאף בקשה.

```bash
cd ~/files

# 1. מקום פנוי בדיסק
df -h /

# 2. גיבוי
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB"' > ~/before-cms.dump
tar czf ~/before-cms-media.tgz media
ls -la ~/before-cms.dump ~/before-cms-media.tgz

# 3. הסרת הסימון, ובדיקה שהוא באמת ירד (צריך לחזור 0)
docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DELETE FROM payload_migrations WHERE batch = -1" -c "SELECT count(*) FROM payload_migrations WHERE batch = -1"'

# 4. עדכון הקוד
git pull
docker compose up -d --build

# 5. הבקשה הראשונה מריצה את ה-migration (כמה שניות)
curl -sS -o /dev/null -w "%{http_code} %{time_total}s
" -m 120 http://127.0.0.1:3000/
docker compose logs --tail=30 app
```

### אם משהו השתבש

```bash
git log --oneline -2                 # לזהות את הגרסה הקודמת
git checkout <הגרסה הקודמת>
docker compose down
docker compose up -d db
docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges' < ~/before-cms.dump
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

- **migrations:** כל שינוי מבנה ב-collections או ב-globals חייב migration: `npx payload migrate:create <שם>`, ואז להריץ מקומית `npx payload migrate`. ה-`push` כבוי גם בפיתוח. בשרת ה-migrations רצות אוטומטית בבקשה הראשונה אחרי עדכון.
- **תוכן:** כל הטקסטים, התמונות, הקישורים והסרטונים מנוהלים בפאנל (`src/globals`). אל תחזירו תוכן לקוד. התוכן ההתחלתי נמצא ב-`src/migrations/seed` ורץ פעם אחת בלבד.
- **BLOB_READ_WRITE_TOKEN** לא מוגדר בשרת בכוונה. בלעדיו Payload שומר קבצים מקומית.
- **Vercel** נשאר פעיל עד שהשרת עובד, אבל שימו לב: תוכן שיוזן שם אחרי ההעברה לא יגיע לשרת.
