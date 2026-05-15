import { motion } from 'framer-motion'

export function About() {
  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-extrabold text-center mb-6">About eTuitionBd</h1>
          <div className="card bg-base-100 shadow-xl p-8 space-y-6 text-base-content/80 leading-relaxed">
            <p className="text-lg">eTuitionBd is Bangladesh's leading tuition management platform, connecting students with qualified tutors since 2024.</p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[['500+', 'Verified Tutors'], ['1000+', 'Happy Students'], ['2000+', 'Tuitions Completed']].map(([n, l]) => (
                <div key={l} className="bg-primary/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-primary">{n}</p>
                  <p className="text-base-content/60 mt-1">{l}</p>
                </div>
              ))}
            </div>
            <p>Our mission is to make quality education accessible across Bangladesh by removing the friction between students seeking tutors and tutors seeking students. We verify every tutor profile, moderate every tuition post, and ensure transparent, secure payments.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10">Contact Us</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8 space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
              {[['📍', 'Address', 'Dhaka, Bangladesh'], ['📞', 'Phone', '+880 1700-000000'], ['✉️', 'Email', 'support@etuitionbd.com']].map(([icon, label, val]) => (
                <div key={label} className="bg-base-200 rounded-xl p-4">
                  <div className="text-3xl mb-2">{icon}</div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-base-content/60">{val}</p>
                </div>
              ))}
            </div>
            <div className="form-control"><label className="label"><span className="label-text">Name</span></label><input type="text" className="input input-bordered" placeholder="Your name" /></div>
            <div className="form-control"><label className="label"><span className="label-text">Email</span></label><input type="email" className="input input-bordered" placeholder="you@example.com" /></div>
            <div className="form-control"><label className="label"><span className="label-text">Message</span></label><textarea className="textarea textarea-bordered h-32" placeholder="How can we help?"></textarea></div>
            <button className="btn btn-primary w-full">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
