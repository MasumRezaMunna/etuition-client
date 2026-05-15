import { Link } from 'react-router-dom'
import { FaGraduationCap, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-auto">
      <div className="footer p-10 max-w-7xl mx-auto">
        <aside>
          <div className="flex items-center gap-2 mb-3">
            <FaGraduationCap className="text-primary text-3xl" />
            <span className="text-xl font-bold text-white">eTuitionBd</span>
          </div>
          <p className="max-w-xs text-neutral-content/70 text-sm">
            Bangladesh's premier platform connecting students with qualified tutors for quality education.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-neutral-content/60 hover:text-primary transition-colors"><FaFacebook size={20} /></a>
            <a href="#" className="text-neutral-content/60 hover:text-primary transition-colors"><FaXTwitter size={20} /></a>
            <a href="#" className="text-neutral-content/60 hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
            <a href="#" className="text-neutral-content/60 hover:text-primary transition-colors"><FaYoutube size={20} /></a>
          </div>
        </aside>
        <nav>
          <header className="footer-title">Quick Links</header>
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/tuitions" className="link link-hover">Browse Tuitions</Link>
          <Link to="/tutors" className="link link-hover">Find Tutors</Link>
          <Link to="/about" className="link link-hover">About Us</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </nav>
        <nav>
          <header className="footer-title">For Users</header>
          <Link to="/register" className="link link-hover">Register as Student</Link>
          <Link to="/register" className="link link-hover">Register as Tutor</Link>
          <Link to="/login" className="link link-hover">Login</Link>
        </nav>
        <nav>
          <header className="footer-title">Contact</header>
          <p className="text-sm">📍 Dhaka, Bangladesh</p>
          <p className="text-sm">📞 +880 1700-000000</p>
          <p className="text-sm">✉️ support@etuitionbd.com</p>
        </nav>
      </div>
      <div className="footer footer-center p-4 bg-neutral-800 text-neutral-content/50 text-sm">
        <p>© {new Date().getFullYear()} eTuitionBd. All rights reserved.</p>
      </div>
    </footer>
  )
}
