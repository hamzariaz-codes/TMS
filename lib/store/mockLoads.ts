import { Load } from '@/types'
import { normalizeStoredLoad } from '@/lib/validation/load'
import fs from 'fs'
import path from 'path'

const seedLoads: Load[] = [
  {
    id: '1',
    load_number: 'LD-20260801-0001-A1',
    submitter_name: 'John Doe',
    submitter_email: 'john@example.com',
    pickup_address: '123 Main St, Chicago, IL',
    delivery_address: '456 Market St, Dallas, TX',
    product_name: 'Industrial Machinery Parts',
    weight: 12500,
    weight_unit: 'lbs',
    quantity: 4,
    pickup_date: '2026-08-05',
    pickup_time: '08:00',
    status: 'Pending',
    notes: 'Fragile cargo - handle with care',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    load_number: 'LD-20260801-0002-B2',
    submitter_name: 'Jane Smith',
    submitter_email: 'jane@acme.com',
    pickup_address: '789 Warehouse Blvd, Atlanta, GA',
    delivery_address: '101 Commerce Rd, Miami, FL',
    product_name: 'Electronics & Pallets',
    weight: 8400,
    weight_unit: 'lbs',
    quantity: 12,
    pickup_date: '2026-08-03',
    pickup_time: '14:30',
    status: 'In Transit',
    notes: 'Temperature control required',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
]

/**
 * Always hand out copies: callers mutate the records they get back (see
 * updateMockLoadStatus), and handing out the module-level seed array meant
 * those mutations changed the seed data for the lifetime of the process.
 */
export function initialMockLoadsCopy(): Load[] {
  return seedLoads.map(load => ({ ...load }))
}

const STORE_PATH = path.join(process.cwd(), '.mock_loads.json')

function loadStore(): Load[] {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        // Drop/repair malformed records so one bad row cannot break every
        // consumer that assumes a well-formed Load.
        return parsed
          .map(normalizeStoredLoad)
          .filter((load): load is Load => load !== null)
      }
      console.warn('Persistent mock store is not an array, reseeding.')
    }
  } catch (e) {
    console.warn('Error reading persistent mock store:', e)
  }
  // Initialize file with default loads if missing or unreadable
  const seeded = initialMockLoadsCopy()
  saveStore(seeded)
  return seeded
}

function saveStore(loads: Load[]) {
  try {
    // Write to a temp file and rename so a crash or concurrent request can
    // never leave a half-written (and therefore unparseable) store behind.
    const tempPath = `${STORE_PATH}.${process.pid}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(loads, null, 2), 'utf-8')
    fs.renameSync(tempPath, STORE_PATH)
  } catch (e) {
    console.warn('Error saving to persistent mock store:', e)
  }
}

export function getMockLoads(): Load[] {
  return loadStore()
}

export function resetMockLoads(): Load[] {
  const seeded = initialMockLoadsCopy()
  saveStore(seeded)
  return seeded
}

export function addMockLoad(load: Load): Load {
  const current = loadStore()
  const updated = [load, ...current]
  saveStore(updated)
  return load
}

export function updateMockLoadStatus(id: string, status: Load['status']): Load | null {
  const current = loadStore()
  const load = current.find(l => l.id === id)
  if (load) {
    load.status = status
    saveStore(current)
    return load
  }
  return null
}

export function deleteMockLoads(ids: string[]): boolean {
  const current = loadStore()
  const updated = current.filter(l => !ids.includes(l.id))
  saveStore(updated)
  return true
}
