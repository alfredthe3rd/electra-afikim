import Link from 'next/link'

export function AboutTeaser() {
  return (
    <section className="about-teaser">
      <h2 className="about-teaser-title">שותפים אסטרטגיים בפתרונות תחבורה מתקדמים</h2>
      <p className="about-teaser-text">
        קבוצת אלקטרה אפיקים היא קבוצת התחבורה המובילה בישראל, הפועלת כקורת גג אחת למכלול רחב של
        פתרונות תחבורה מתקדמים. הקבוצה משלבת תכנון, הפעלה, טכנולוגיה, תשתיות, הכשרה, תחזוקה
        וחדשנות - כדי לייצר מערכות תחבורה חכמות, בטוחות ויעילות.
      </p>
      <Link className="division-cta about-teaser-cta" href="/about">
        אודות אלקטרה אפיקים
      </Link>
    </section>
  )
}
