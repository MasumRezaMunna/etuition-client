import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../config/axios'
import TuitionCard from '../components/shared/TuitionCard'
import { FaSearch, FaUserCheck, FaHandshake, FaStar, FaShieldAlt, FaBolt, FaHeadset } from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Home() {
  const [tuitions, setTuitions] = useState([])
  const [tutors, setTutors] = useState([])

  useEffect(() => {
    api.get('/tuitions/latest').then((r) => setTuitions(r.data)).catch(() => {})
    api.get('/users/tutors?limit=6').then((r) => setTutors(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero min-h-[85vh] bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-4 py-20 gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-center text-white p-8">
                  <div className="text-8xl mb-4">🎓</div>
                  <p className="text-2xl font-bold">Learn. Grow. Succeed.</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-base-100 rounded-2xl p-4 shadow-xl">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-base-content/60">Active Tutors</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-base-100 rounded-2xl p-4 shadow-xl">
                <p className="text-2xl font-bold text-success">1000+</p>
                <p className="text-sm text-base-content/60">Happy Students</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="badge badge-primary badge-outline mb-4">Bangladesh's #1 Tuition Platform</div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Find Your <span className="text-primary">Perfect</span> Tutor Today
            </h1>
            <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
              Connect with verified, experienced tutors for every subject and class level. Post your tuition requirements and get matched instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/tuitions" className="btn btn-primary btn-lg gap-2">
                <FaSearch /> Browse Tuitions
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Become a Tutor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to connect students with the right tutors</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <FaSearch className="text-4xl text-primary" />, title: 'Post a Tuition', desc: 'Students post their tuition requirements including subject, class, location, schedule and budget.' },
              { icon: <FaUserCheck className="text-4xl text-secondary" />, title: 'Get Verified Tutors', desc: 'Admin reviews and approves the post. Qualified tutors browse and apply with their credentials.' },
              { icon: <FaHandshake className="text-4xl text-success" />, title: 'Start Learning', desc: 'Review applications, select the best tutor, complete payment securely via Stripe, and begin!' },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="card bg-base-100 shadow-md text-center p-8 card-hover">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <div className="badge badge-outline mx-auto mb-3">Step {i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-base-content/60">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Tuitions */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="section-title">Latest Tuition Posts</h2>
            <p className="section-subtitle">Fresh tuition opportunities posted by students across Bangladesh</p>
          </motion.div>
          {tuitions.length === 0 ? (
            <p className="text-center text-base-content/50 py-12">No tuitions yet. Be the first to post!</p>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {tuitions.map((t) => (
                <motion.div key={t._id} variants={fadeUp}>
                  <TuitionCard tuition={t} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center mt-10">
            <Link to="/tuitions" className="btn btn-outline btn-primary btn-lg">
              View All Tuitions →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Tutors */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="section-title">Meet Our Tutors</h2>
            <p className="section-subtitle">Verified, experienced tutors ready to help you achieve your goals</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tutors.map((tutor) => (
              <motion.div key={tutor._id} variants={fadeUp}>
                <div className="card bg-base-100 shadow-md card-hover">
                  <div className="card-body items-center text-center p-6">
                    <div className="avatar mb-3">
                      <div className="w-20 rounded-full ring ring-primary ring-offset-2">
                        <img src={tutor.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`} alt={tutor.name} />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{tutor.name}</h3>
                    <div className="badge badge-secondary badge-outline text-xs">Tutor</div>
                    <p className="text-sm text-base-content/60 mt-2 line-clamp-2">{tutor.phone ? `📞 ${tutor.phone}` : 'Available for tuitions'}</p>
                    <Link to={`/tutors/${tutor._id}`} className="btn btn-primary btn-sm btn-outline mt-3">
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-10">
            <Link to="/tutors" className="btn btn-outline btn-secondary btn-lg">
              View All Tutors →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="section-title">Why Choose eTuitionBd?</h2>
            <p className="section-subtitle">Built for Bangladesh. Trusted by thousands.</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <FaShieldAlt className="text-3xl text-primary" />, title: 'Verified Tutors', desc: 'Every tutor is reviewed and verified by our admin team.' },
              { icon: <FaBolt className="text-3xl text-warning" />, title: 'Fast Matching', desc: 'Get matched with the right tutor within hours of posting.' },
              { icon: <FaStar className="text-3xl text-success" />, title: 'Quality Assured', desc: 'Only approved, high-quality tuition posts reach tutors.' },
              { icon: <FaHeadset className="text-3xl text-info" />, title: '24/7 Support', desc: 'Our support team is always ready to help you.' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="card bg-base-200 shadow-sm p-6 text-center card-hover">
                <div className="flex justify-center mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-base-content/60">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
