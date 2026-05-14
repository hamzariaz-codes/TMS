export type LoadStatus = 'Pending' | 'Picked Up' | 'In Transit' | 'Delivered'

export interface Load {
  id: string
  load_number: string
  submitter_name: string
  submitter_email: string
  pickup_address: string
  delivery_address: string
  product_name: string
  weight: number
  weight_unit: 'lbs' | 'kg'
  quantity: number
  pickup_date: string
  pickup_time: string
  status: LoadStatus
  notes?: string
  created_at: string
}

export interface CreateLoadInput {
  submitter_name: string
  submitter_email: string
  pickup_address: string
  delivery_address: string
  product_name: string
  weight: number
  weight_unit: 'lbs' | 'kg'
  quantity: number
  pickup_date: string
  pickup_time: string
  notes?: string
}

export interface LoadStats {
  total: number
  pending: number
  pickedUp: number
  inTransit: number
  delivered: number
}

export type ToastType = 'success' | 'error'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}
