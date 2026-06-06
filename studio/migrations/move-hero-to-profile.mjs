/**
 * Migration: Move hero fields from homePage to Profile.
 * Moves greeting, heroName, CTA labels/links.
 *
 * Usage: node studio/migrations/move-hero-to-profile.mjs [--dry-run]
 */
import { exec } from 'child_process'
import { promisify } from 'util'
import { createClient } from '@sanity/client'

const execAsync = promisify(exec)
const DRY_RUN = process.argv.includes('--dry-run')

const HERO_FIELDS = [
  'greeting', 'greeting_pt',
  'heroName', 'heroName_pt',
  'ctaPrimaryLabel', 'ctaPrimaryLabel_pt', 'ctaPrimaryHref',
  'ctaSecondaryLabel', 'ctaSecondaryLabel_pt', 'ctaSecondaryHref',
]

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

  const [profile, homePage] = await Promise.all([
    client.getDocument('profile'),
    client.getDocument('homePage'),
  ])

  if (!profile) { console.log('No profile found — aborting.'); return }

  const toMove = {}
  for (const field of HERO_FIELDS) {
    if (homePage?.[field] != null) {
      toMove[field] = homePage[field]
    }
  }

  if (Object.keys(toMove).length === 0) {
    console.log('No hero fields found on homePage — nothing to migrate.')
    return
  }

  console.log('Moving fields to Profile:', Object.keys(toMove).join(', '))
  for (const [key, value] of Object.entries(toMove)) {
    console.log(`  ${key}: ${JSON.stringify(value)}`)
  }

  if (!DRY_RUN) {
    await client.patch('profile').set(toMove).commit()
    console.log('Set fields on Profile.')

    await client.patch('homePage').unset(HERO_FIELDS).commit()
    console.log('Removed fields from homePage.')
  } else {
    console.log('(dry run — no changes made)')
  }

  console.log('Done!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
