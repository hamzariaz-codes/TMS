import { CreateLoadInput, Load, LoadStatus } from '@/types'

export const LOAD_STATUSES: LoadStatus[] = ['Pending', 'Picked Up', 'In Transit', 'Delivered']

const MAX_TEXT = 500
const MAX_LONG_TEXT = 2000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/

export function isValidStatus(value: unknown): value is LoadStatus {
  return typeof value === 'string' && (LOAD_STATUSES as string[]).includes(value)
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export type ValidationResult =
  | { ok: true; value: CreateLoadInput }
  | { ok: false; error: string }

/**
 * Whitelists and type-checks a submitted load. Everything that reaches the
 * database or the fallback store goes through here, so callers can never set
 * server-owned fields (id, load_number, status, created_at) or store values of
 * the wrong type — a malformed record used to persist and then break every
 * render of the dashboard.
 */
export function validateCreateLoadInput(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const raw = body as Record<string, unknown>

  const submitter_name = asText(raw.submitter_name)
  const submitter_email = asText(raw.submitter_email)
  const pickup_address = asText(raw.pickup_address)
  const delivery_address = asText(raw.delivery_address)
  const product_name = asText(raw.product_name)
  const pickup_date = asText(raw.pickup_date)
  const pickup_time = asText(raw.pickup_time)
  const notes = asText(raw.notes)

  if (!submitter_name) return { ok: false, error: 'Submitter name is required.' }
  if (!submitter_email) return { ok: false, error: 'Submitter email is required.' }
  if (!EMAIL_PATTERN.test(submitter_email)) return { ok: false, error: 'Submitter email is not a valid email address.' }
  if (!pickup_address) return { ok: false, error: 'Pickup address is required.' }
  if (!delivery_address) return { ok: false, error: 'Delivery address is required.' }
  if (!product_name) return { ok: false, error: 'Product name is required.' }

  if (
    submitter_name.length > MAX_TEXT ||
    submitter_email.length > MAX_TEXT ||
    product_name.length > MAX_TEXT ||
    pickup_address.length > MAX_LONG_TEXT ||
    delivery_address.length > MAX_LONG_TEXT ||
    notes.length > MAX_LONG_TEXT
  ) {
    return { ok: false, error: 'One or more fields exceed the maximum allowed length.' }
  }

  const weight = Number(raw.weight)
  if (!Number.isFinite(weight) || weight < 0) {
    return { ok: false, error: 'Weight must be a non-negative number.' }
  }

  const quantity = Number(raw.quantity)
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: 'Quantity must be a whole number of at least 1.' }
  }

  const weight_unit = raw.weight_unit === 'kg' ? 'kg' : 'lbs'

  if (!DATE_PATTERN.test(pickup_date) || Number.isNaN(Date.parse(pickup_date))) {
    return { ok: false, error: 'Pickup date must be a valid date in YYYY-MM-DD format.' }
  }
  if (!TIME_PATTERN.test(pickup_time)) {
    return { ok: false, error: 'Pickup time must be in HH:MM format.' }
  }

  return {
    ok: true,
    value: {
      submitter_name,
      submitter_email,
      pickup_address,
      delivery_address,
      product_name,
      weight,
      weight_unit,
      quantity,
      pickup_date,
      pickup_time,
      notes: notes || undefined,
    },
  }
}

/**
 * Repairs a record read back from the fallback store. Records written before
 * input validation existed (or hand-edited files) can be missing fields or hold
 * the wrong types; returning a well-formed Load keeps the dashboard from
 * throwing on them.
 */
export function normalizeStoredLoad(raw: unknown): Load | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const record = raw as Record<string, unknown>
  const id = asText(record.id)
  if (!id) return null

  const weight = Number(record.weight)
  const quantity = Number(record.quantity)
  const created_at = asText(record.created_at)
  const notes = asText(record.notes)

  return {
    id,
    load_number: asText(record.load_number) || 'UNKNOWN',
    submitter_name: asText(record.submitter_name),
    submitter_email: asText(record.submitter_email),
    pickup_address: asText(record.pickup_address),
    delivery_address: asText(record.delivery_address),
    product_name: asText(record.product_name),
    weight: Number.isFinite(weight) ? weight : 0,
    weight_unit: record.weight_unit === 'kg' ? 'kg' : 'lbs',
    quantity: Number.isFinite(quantity) ? quantity : 0,
    pickup_date: asText(record.pickup_date),
    pickup_time: asText(record.pickup_time),
    status: isValidStatus(record.status) ? record.status : 'Pending',
    ...(notes ? { notes } : {}),
    created_at: created_at && !Number.isNaN(Date.parse(created_at)) ? created_at : new Date(0).toISOString(),
  }
}
