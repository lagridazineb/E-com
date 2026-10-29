import { useState } from 'react'

// ---- À MODIFIER ----
const PRICE = 299          // prix du pack (dh)
const SHIPPING = 30        // frais de livraison (dh)
const FREE_FROM = 3        // livraison gratuite à partir de X packs
const WHATSAPP = '918089118428' // ton numéro WhatsApp (format international, sans +)
// --------------------

const ITEMS = [
  { name: 'Bonnet en satin', text: 'Protège la fibre pendant la nuit, moins de frisottis au réveil.', img: 'bonnet.png' },
  { name: 'Peigne en bois', text: 'Démêle en douceur, sans électricité statique.', img: 'peigne-bois.png' },
  { name: 'Peigne de massage', text: 'Détend et stimule le cuir chevelu.', img: 'massage.png' },
  { name: 'Peigne applicateur', text: 'Dépose huiles et sérums directement sur la racine.', img: 'applicateur.png' },
]
const PROMISES = ['Serviette microfibre rose + chouchou satin inclus', 'Un seul pack, tout le rituel', 'Paiement à la livraison', 'Livraison partout au Maroc']

const fmt = (n) => `${n} dh`

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="bar">Livraison gratuite à partir de {FREE_FROM} packs</div>
      <header className="nav">
        <span className="logo">Slaay <i>care</i></span>
        <button className="pill" onClick={() => setOpen(true)}>Commander</button>
      </header>

      <main>
      <section className="video-hero">
        <video src="/img/vid.mp4" autoPlay muted loop playsInline preload="auto" />
     </section>
        <section className="hero">
          <div className="hero-text">
            <p className="kicker">Soin cheveux</p>
            <h1>Le rituel complet,<br />dans une seule boîte.</h1>
            <p className="lead">Bonnet, peignes, serviette et applicateur : tout ce qu’il faut pour des cheveux doux, démêlés et protégés.</p>
            <div className="hero-cta">
              <button className="btn" onClick={() => setOpen(true)}>Commander le pack — {fmt(PRICE)}</button>
              <span className="note">Paiement à la livraison</span>
            </div>
          </div>
          <div className="arch"><img src="/img/pack.png" alt="Le pack Slaay Care ouvert" /></div>
        </section>

        <section className="section" id="pack">
          <h2>Ce que contient le pack</h2>
          <div className="grid">
            {ITEMS.map((it) => (
              <article className="card" key={it.name}>
                <div className="thumb"><img src={`/img/${it.img}`} alt={it.name} loading="lazy" /></div>
                <h3>{it.name}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
          <p className="extra">Et aussi : une serviette microfibre rose et un chouchou en satin.</p>
        </section>

        <section className="offer">
          <h2>Le pack complet</h2>
          <p className="price">{fmt(PRICE)}</p>
          <ul>{PROMISES.map((p) => <li key={p}>{p}</li>)}</ul>
          <button className="btn light" onClick={() => setOpen(true)}>Acheter maintenant</button>
        </section>
      </main>

      <footer className="foot">© 2026 Slaay Care. Tous droits réservés.</footer>
      <div className="sticky"><button className="btn" onClick={() => setOpen(true)}>Commander — {fmt(PRICE)}</button></div>
      {open && <Order onClose={() => setOpen(false)} />}
    </>
  )
}

function Order({ onClose }) {
  const [qty, setQty] = useState(1)
  const [f, setF] = useState({ name: '', phone: '', city: '', address: '' })
  const [err, setErr] = useState({})
  const ship = qty >= FREE_FROM ? 0 : SHIPPING
  const total = qty * PRICE + ship
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Entre ton nom complet'
    if (!/^(\+?212|0)[5-7]\d{8}$/.test(f.phone.replace(/\s/g, ''))) er.phone = 'Numéro marocain invalide'
    if (!f.city.trim()) er.city = 'Entre ta ville'
    if (!f.address.trim()) er.address = 'Entre ton adresse'
    setErr(er)
    if (Object.keys(er).length) return
    const msg = `Commande Slaay Care\n${qty} × Pack complet = ${fmt(qty * PRICE)}\nLivraison : ${ship ? fmt(ship) : 'gratuite'}\nTotal : ${fmt(total)}\n\nNom : ${f.name}\nTél : ${f.phone}\nVille : ${f.city}\nAdresse : ${f.address}`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <button type="button" className="x" onClick={onClose} aria-label="Fermer">✕</button>
        <h3>Ton pack Slaay Care</h3>
        <div className="qty">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Moins">−</button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Plus">+</button>
        </div>
        {['name:Nom complet', 'phone:Téléphone', 'city:Ville', 'address:Adresse'].map((s) => {
          const [k, label] = s.split(':')
          return (
            <label key={k}>{label}
              <input value={f[k]} onChange={set(k)} inputMode={k === 'phone' ? 'tel' : 'text'} aria-invalid={!!err[k]} />
              {err[k] && <small>{err[k]}</small>}
            </label>
          )
        })}
        <dl className="sum">
          <div><dt>Sous-total</dt><dd>{fmt(qty * PRICE)}</dd></div>
          <div><dt>Livraison</dt><dd>{ship ? fmt(ship) : 'Gratuite'}</dd></div>
          <div className="tot"><dt>Total</dt><dd>{fmt(total)}</dd></div>
        </dl>
        <button className="btn full" type="submit">Confirmer la commande</button>
        <p className="note c">Paiement à la livraison. Ta commande est envoyée sur WhatsApp.</p>
      </form>
    </div>
  )
}
