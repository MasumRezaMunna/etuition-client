import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-black text-primary/20 mb-4">404</div>
        <div className="text-6xl mb-6">🎓</div>
        <h1 className="text-4xl font-extrabold mb-4">Page Not Found</h1>
        <p className="text-base-content/60 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/" className="btn btn-primary btn-lg gap-2">
          🏠 Back to Home
        </Link>
      </div>
    </div>
  )
}
