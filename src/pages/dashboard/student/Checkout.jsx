import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../../../config/axios'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ applicationId, amount, tutorEmail, tuitionId }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    api.post('/payments/create-intent', { amount, applicationId, tuitionId })
      .then(r => setClientSecret(r.data.clientSecret))
      .catch(() => toast.error('Failed to initialize payment'))
  }, [amount, applicationId, tuitionId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setLoading(true)

    const card = elements.getElement(CardElement)
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await api.post('/payments/confirm', {
          applicationId,
          tuitionId,
          amount,
          tutorEmail,
          transactionId: paymentIntent.id,
        })
        toast.success('Payment successful! Tutor approved.')
        navigate('/dashboard/student/payments')
      } catch {
        toast.error('Payment recorded but confirmation failed. Contact support.')
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label"><span className="label-text font-medium">Card Details</span></label>
        <div className="border-2 border-base-300 rounded-xl p-4 bg-base-100 focus-within:border-primary transition-colors">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } } } }} />
        </div>
      </div>

      <div className="alert alert-info text-sm">
        <span>🔒 Test card: <strong>4242 4242 4242 4242</strong> | Any future date | Any CVC</span>
      </div>

      <button type="submit" disabled={!stripe || !clientSecret || loading} className="btn btn-success w-full btn-lg gap-2">
        {loading ? <span className="loading loading-spinner loading-sm"></span> : `💳 Pay ৳${parseInt(amount).toLocaleString()}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { applicationId } = useParams()
  const [searchParams] = useSearchParams()
  const amount = searchParams.get('amount') || 0
  const tutorEmail = searchParams.get('tutorEmail') || ''
  const tuitionId = searchParams.get('tuitionId') || ''

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-base-content/60 mt-1">Pay the tutor's first month fee to confirm the booking</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="bg-primary/10 rounded-2xl p-5 mb-6 text-center">
            <p className="text-sm text-base-content/60 mb-1">Amount to Pay</p>
            <p className="text-4xl font-black text-primary">৳{parseInt(amount).toLocaleString()}</p>
            <p className="text-sm text-base-content/60 mt-1">First month tuition fee</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-base-200 rounded-xl mb-6">
            <span className="text-2xl">👨‍🏫</span>
            <div>
              <p className="text-xs text-base-content/50">Tutor Email</p>
              <p className="font-medium text-sm">{tutorEmail}</p>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              applicationId={applicationId}
              amount={amount}
              tutorEmail={tutorEmail}
              tuitionId={tuitionId}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}
