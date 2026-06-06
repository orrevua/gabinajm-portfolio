/**
 * Migration: Remove pastExperience and socialLinks from Profile document.
 * These fields are now managed as Section documents.
 *
 * Usage: node studio/migrations/clean-profile-fields.mjs [--dry-run]
 */
import { exec } from 'child_process'
import { promisify } from 'util'
import { createClient } from '@sanity/client'

const execAsync = promisify(exec)
const DRY_RUN = process.argv.includes('--dry-run')

async function getCliToken() {
  const { stdout } = await execAsync('npx sanity debug --secrets 2>&1')
  const match = stdout.match(/Auth token:\s+(.+)/i)
  if (!match) throw new Error('Could not extract Sanity auth token.')
  return match[1].trim()
}

async function migrate() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== LIVE RUN ===')
  console.log('Getting auth token...')
  const token = await getCliToken()

  const client = createClient({
    projectId: 'v0mc5w1c',
    dataset: 'production',
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  const profile = await client.getDocument('profile')
  if (!profile) {
    console.log('No profile document found.')
    return
  }

  const fieldsToRemove = ['pastExperience', 'socialLinks'].filter((f) => profile[f] != null)

  if (fieldsToRemove.length === 0) {
    console.log('No fields to remove — profile is already clean.')
    return
  }

  console.log(`Removing fields from Profile: ${fieldsToRemove.join(', ')}`)

  if (!DRY_RUN) {
    await client.patch('profile').unset(fieldsToRemove).commit()
    console.log('Fields removed successfully.')
  } else {
    console.log('(dry run — no changes made)')
  }

  console.log('Done!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
