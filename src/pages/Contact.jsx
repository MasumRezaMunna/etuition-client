export default function Contact() {
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
