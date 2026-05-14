'use client'

import { useState } from 'react'
import { CreateLoadInput, Load } from '@/types'
import LoadingSpinner from '../ui/LoadingSpinner'

interface Props {
  onSuccess: (load: Load) => void
}

const STEPS = [
  { id: 'contact', label: 'Contact Info' },
  { id: 'route', label: 'Route' },
  { id: 'cargo', label: 'Cargo Details' },
  { id: 'schedule', label: 'Schedule' }
]

export default function ShipmentForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<CreateLoadInput>({
    submitter_name: '',
    submitter_email: '',
    pickup_address: '',
    delivery_address: '',
    product_name: '',
    weight: 0,
    weight_unit: 'lbs',
    quantity: 1,
    pickup_date: '',
    pickup_time: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/loads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Failed to submit shipment. Please try again.')
      }

      const data = await response.json()
      onSuccess(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' || name === 'quantity' ? Number(value) : value
    }))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                idx <= currentStep ? 'bg-accent text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-2 hidden sm:block ${
                idx <= currentStep ? 'text-navy-900' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-in-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[280px]">
          {/* Step 1: Contact Info */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-900 border-b pb-2">Contact Information</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Full Name</label>
                  <input
                    required
                    type="text"
                    name="submitter_name"
                    value={formData.submitter_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Email Address</label>
                  <input
                    required
                    type="email"
                    name="submitter_email"
                    value={formData.submitter_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Route */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-900 border-b pb-2">Shipment Route</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Pickup Address</label>
                  <textarea
                    required
                    name="pickup_address"
                    value={formData.pickup_address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                    placeholder="123 Origin St, City, State, ZIP"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Delivery Address</label>
                  <textarea
                    required
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                    placeholder="456 Destination Ave, City, State, ZIP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Cargo Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-900 border-b pb-2">Cargo Details</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Product Name</label>
                  <input
                    required
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    placeholder="Electronics, Furniture, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-navy-700">Quantity</label>
                    <input
                      required
                      type="number"
                      min="1"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-navy-700">Weight</label>
                    <div className="flex">
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-l-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                      />
                      <select
                        name="weight_unit"
                        value={formData.weight_unit}
                        onChange={handleChange}
                        className="px-4 py-3 border border-l-0 border-slate-300 rounded-r-xl bg-slate-50 text-navy-700 outline-none focus:ring-2 focus:ring-accent font-semibold"
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Special Instructions (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Any specific details for the carrier or driver..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-navy-900 border-b pb-2">Pickup Schedule</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Pickup Date</label>
                  <input
                    required
                    type="date"
                    name="pickup_date"
                    value={formData.pickup_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-navy-700">Pickup Time</label>
                  <input
                    required
                    type="time"
                    name="pickup_time"
                    value={formData.pickup_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            disabled={loading}
            type="submit"
            className="flex-1 py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-navy-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : currentStep === STEPS.length - 1 ? (
              'Create Load Number'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
