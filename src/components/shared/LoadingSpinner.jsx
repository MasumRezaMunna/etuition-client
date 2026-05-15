export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-100 z-50">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-base-content/60 text-sm">Loading...</p>
      </div>
    </div>
  )
}
