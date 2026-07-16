import { SocialAnimations } from './SocialAnimations'
import { SocialCarousel } from './SocialCarousel'

export default function SocialResponsibilityPage() {
  return (
    <>
      <SocialAnimations />

      {/* אזור 1 - הירו וידאו */}
      <section className="social-hero">
        <video
          autoPlay
          className="social-hero-video"
          loop
          muted
          playsInline
          src="/social-hero.mp4"
        />
      </section>

      {/* אזור 2 - כותרות */}
      <section className="social-titles">
        <h1 className="social-title">אחריות חברתית</h1>
        <p className="social-subtitle">
          כקבוצה המשרתת מיליוני אזרחים וכשותפה בפרויקטים המעצבים
          את התחבורה והתנועה בישראל, חשוב לנו לשמור על סטנדרטים של
          מחויבות, אחריות ושותפות.
        </p>
      </section>

      {/* אזור 3 - שלוש קוביות */}
      <section className="social-cards-section">
        <div className="social-cards">
          <article className="social-card">
            <img alt="" className="social-card-icon" src="/socail%20page/icon%20socail%201.svg" />
            <h3 className="social-card-title">אחריות סביבתית</h3>
            <p className="social-card-text">
              התייעלות אנרגטית, צמצום פליטות פחמן, מעבר לאנרגיות
              מתחדשות, מניעת זיהום ומחזור.
            </p>
            <ul className="social-card-list">
              <li>צי אוטובוסים חשמלי</li>
              <li>עמידה בתקני זיהום</li>
              <li>הפחתת פליטות</li>
            </ul>
          </article>

          <article className="social-card">
            <img alt="" className="social-card-icon" src="/socail%20page/icon%20socail%202.svg" />
            <h3 className="social-card-title">אחריות קהילתית</h3>
            <p className="social-card-text">
              שמירה על זכויות אדם, תנאי העסקה הוגנים, גיוון והכלה,
              בטיחות בעבודה ותרומה לקהילה.
            </p>
            <ul className="social-card-list">
              <li>שילוב וגיוון אוכלוסיות</li>
              <li>יצירת מקומות תעסוקה</li>
              <li>פעילות והתנדבות בקהילה</li>
            </ul>
          </article>

          <article className="social-card">
            <img alt="" className="social-card-icon" src="/socail%20page/icon%20social%203.svg" />
            <h3 className="social-card-title">אחריות תאגידית</h3>
            <p className="social-card-text">
              ניהול תקין של החברה. כולל את מבנה הדירקטוריון, שקיפות
              מול משקיעים, מניעת שחיתות וניגודי עניינים, ואתיקה מקצועית.
            </p>
            <ul className="social-card-list">
              <li>התנהלות אתית</li>
              <li>ציות לרגולציה</li>
              <li>בקרת איכות</li>
            </ul>
          </article>
        </div>
      </section>

      {/* אזור 4 - כותרות + כפתור */}
      <section className="social-cta-section">
        <h2 className="social-cta-title">לפניות, שאלות והצעות בנושא אחריות חברתית</h2>
        <a className="division-cta" href="/contact">ליצירת קשר</a>
      </section>

      {/* אזור 5 - קרוסלת תמונות */}
      <SocialCarousel />
    </>
  )
}
