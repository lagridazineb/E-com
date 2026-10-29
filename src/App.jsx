import { useState } from 'react'

// ---- À MODIFIER ----
const PRICE = 299              // سعر الباك (درهم) — التوصيل مجاني
const WHATSAPP = '918129779732' // رقم واتساب بدون + وبدون مسافات
// --------------------

const PACKS = {
  rose: { label: 'الباك الوردي', color: '#e59ab3', box: 'rose-box.jpg', towel: 'rose-serviette.jpg', bonnet: 'rose-bonnet.jpg' },
  mauve: { label: 'الباك البنفسجي', color: '#8e5aa8', box: 'mauve-box.jpg', towel: 'mauve-serviette.jpg', bonnet: 'mauve-bonnet.jpg' },
}

const itemsOf = (p) => [
  { name: 'قبعة الساتان', text: 'تحمي الشعر أثناء النوم وتقلل التجعد عند الاستيقاظ.', img: p.bonnet },
  { name: 'منشفة الشعر', text: 'ميكروفايبر سريعة الامتصاص، تجفف دون تجعد.', img: p.towel },
  { name: 'مشط الخشب', text: 'يفك التشابك بلطف دون كهرباء ساكنة.', img: 'peigne.jpg' },
  { name: 'مشط التدليك', text: 'يدلك فروة الرأس ويحفزها.', img: 'massage.jpg', fit: 'contain' },
  { name: 'مشط التطبيق', text: 'يضع الزيوت والسيروم مباشرة على الجذور.', img: 'applicateur.jpg', fit: 'contain' },
]
const PROMISES = ['٥ منتجات في باك واحد', 'توصيل مجاني لجميع مدن المغرب', 'الدفع عند الاستلام', 'اختاري اللون: وردي أو بنفسجي']

const fmt = (n) => `${n} درهم`

function PackChips({ value, onChange }) {
  return (
    <div className="packs" role="radiogroup" aria-label="اختاري الباك">
      {Object.entries(PACKS).map(([k, p]) => (
        <button type="button" key={k} role="radio" aria-checked={value === k} className={`chip${value === k ? ' on' : ''}`} onClick={() => onChange(k)}>
          <span className="dot" style={{ background: p.color }} />{p.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [pack, setPack] = useState('rose')
  const p = PACKS[pack]
  return (
    <>
      <div className="bar">التوصيل مجاني لجميع الطلبات</div>
      <header className="nav">
        <span className="logo">Slaay <i>care</i></span>
        <button className="pill" onClick={() => setOpen(true)}>اطلبي الآن</button>
      </header>

      <main>
        <section className="video-hero">
          <video src="/img/vid.mp4" autoPlay muted loop playsInline preload="auto" />
        </section>

        <section className="hero">
          <div className="hero-text">
            <p className="kicker">العناية بالشعر</p>
            <h1>روتين العناية الكامل، في علبة واحدة.</h1>
            <p className="lead">قبعة ساتان، أمشاط، منشفة وأداة التطبيق: كل ما تحتاجينه لشعر ناعم، سهل التسريح ومحمي.</p>
            <PackChips value={pack} onChange={setPack} />
            <div className="hero-cta">
              <button className="btn" onClick={() => setOpen(true)}>اطلبي الباك — {fmt(PRICE)}</button>
              <span className="note">الدفع عند الاستلام · التوصيل مجاني</span>
            </div>
          </div>
          <div className="arch"><img key={pack} src={`/img/${p.box}`} alt={p.label} /></div>
        </section>

        <section className="section" id="pack">
          <h2>ماذا يحتوي {p.label}</h2>
          <div className="grid">
            {itemsOf(p).map((it) => (
              <article className="card" key={it.name}>
                <div className="thumb"><img src={`/img/${it.img}`} alt={it.name} loading="lazy" style={{ objectFit: it.fit || 'cover' }} /></div>
                <h3>{it.name}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="offer">
          <h2>الباك الكامل</h2>
          <p className="price">{fmt(PRICE)}</p>
          <ul>{PROMISES.map((x) => <li key={x}>{x}</li>)}</ul>
          <button className="btn light" onClick={() => setOpen(true)}>اشتري الآن</button>
        </section>
      </main>

      <footer className="foot">© 2026 Slaay Care. جميع الحقوق محفوظة.</footer>
      <div className="sticky"><button className="btn" onClick={() => setOpen(true)}>اطلبي الآن — {fmt(PRICE)}</button></div>
      {open && <Order pack={pack} setPack={setPack} onClose={() => setOpen(false)} />}
    </>
  )
}

function Order({ pack, setPack, onClose }) {
  const [qty, setQty] = useState(1)
  const [f, setF] = useState({ name: '', phone: '', city: '', address: '' })
  const [err, setErr] = useState({})
  const total = qty * PRICE
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const fields = [['name', 'الاسم الكامل'], ['phone', 'رقم الهاتف'], ['city', 'المدينة'], ['address', 'العنوان']]

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'أدخلي اسمك الكامل'
    if (!/^(\+?212|0)[5-7]\d{8}$/.test(f.phone.replace(/\s/g, ''))) er.phone = 'رقم هاتف مغربي غير صحيح'
    if (!f.city.trim()) er.city = 'أدخلي مدينتك'
    if (!f.address.trim()) er.address = 'أدخلي عنوانك'
    setErr(er)
    if (Object.keys(er).length) return
    const msg = `طلب جديد — Slaay Care\n${qty} × ${PACKS[pack].label} = ${fmt(total)}\nالتوصيل: مجاني\nالمجموع: ${fmt(total)}\n\nالاسم: ${f.name}\nالهاتف: ${f.phone}\nالمدينة: ${f.city}\nالعنوان: ${f.address}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <button type="button" className="x" onClick={onClose} aria-label="إغلاق">✕</button>
        <h3>طلبك من Slaay Care</h3>
        <PackChips value={pack} onChange={setPack} />
        <div className="qty">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="أقل">−</button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="أكثر">+</button>
        </div>
        {fields.map(([k, label]) => (
          <label key={k}>{label}
            <input value={f[k]} onChange={set(k)} inputMode={k === 'phone' ? 'tel' : 'text'} aria-invalid={!!err[k]} />
            {err[k] && <small>{err[k]}</small>}
          </label>
        ))}
        <dl className="sum">
          <div><dt>المجموع الفرعي</dt><dd>{fmt(total)}</dd></div>
          <div><dt>التوصيل</dt><dd>مجاني</dd></div>
          <div className="tot"><dt>المجموع</dt><dd>{fmt(total)}</dd></div>
        </dl>
        <button className="btn full" type="submit">تأكيد الطلب</button>
        <p className="note c">الدفع عند الاستلام. يُرسل طلبك عبر واتساب.</p>
      </form>
    </div>
  )
}
