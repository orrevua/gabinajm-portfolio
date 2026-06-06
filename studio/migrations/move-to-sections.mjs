/**
 * Migration: Create section documents from Profile and AboutPage data.
 *
 * Creates 3 new section documents:
 *   1. past-experience — from Profile.pastExperience (companies with logos)
 *   2. contact — from Profile.socialLinks
 *   3. values — from AboutPage.values
 *
 * Also migrates existing section documents from `page` (string) to `pages` (array).
 *
 * Usage: node studio/migrations/move-to-sections.mjs [--dry-run]
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

  const [profile, aboutPage, existingSections] = await Promise.all([
    client.getDocument('profile'),
    client.getDocument('aboutPage'),
    client.fetch(`*[_type == "section"]`),
  ])

  if (!profile) {
    console.log('No profile found — aborting.')
    return
  }

  const transaction = client.transaction()

  // 1. Create past-experience section from Profile.pastExperience
  const pastExperience = profile.pastExperience || []
  if (pastExperience.length > 0) {
    const companies = pastExperience.map((pe) => ({
      _type: 'object',
      _key: crypto.randomUUID().slice(0, 8),
      name: pe.name,
      url: pe.url || undefined,
      logo: pe.logo,
    }))

    const doc = {
      _type: 'section',
      sectionType: 'past-experience',
      title: 'Past Experience',
      title_pt: 'Experiência',
      uid: { _type: 'slug', current: 'past-experience' },
      subtitle: null,
      content: [],
      contentBlocks: [
        {
          _type: 'companyLogos',
          _key: crypto.randomUUID().slice(0, 8),
          companies,
        },
      ],
      pages: ['home'],
      order: 10,
      padding: 'py-16',
      overlay: false,
      hasDropShadow: false,
    }

    console.log(`\nCreating past-experience section with ${companies.length} companies`)
    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2))
    } else {
      transaction.create(doc)
    }
  } else {
    console.log('\nNo pastExperience data on Profile — skipping.')
  }

  // 2. Create contact section from Profile.socialLinks
  const socialLinks = profile.socialLinks || []
  if (socialLinks.length > 0) {
    const links = socialLinks.map((sl) => ({
      _type: 'object',
      _key: crypto.randomUUID().slice(0, 8),
      platform: sl.platform,
      url: sl.url,
    }))

    const doc = {
      _type: 'section',
      sectionType: 'contact',
      title: 'Get in touch',
      title_pt: 'Entre em contato',
      uid: { _type: 'slug', current: 'contact' },
      subtitle: "I'm always open to new opportunities and collaborations.",
      subtitle_pt: 'Estou sempre aberta a novas oportunidades e colaborações.',
      content: [],
      contentBlocks: [
        {
          _type: 'socialLinksBlock',
          _key: crypto.randomUUID().slice(0, 8),
          links,
          availabilityText: 'Available for freelance work',
          availabilityText_pt: 'Disponível para trabalho freelance',
        },
      ],
      pages: ['home', 'about'],
      order: 100,
      padding: 'py-16',
      overlay: false,
      hasDropShadow: false,
    }

    console.log(`\nCreating contact section with ${links.length} social links`)
    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2))
    } else {
      transaction.create(doc)
    }
  } else {
    console.log('\nNo socialLinks on Profile — skipping.')
  }

  // 3. Create values section from AboutPage.values
  const values = aboutPage?.values || []
  if (values.length > 0) {
    const items = values.map((v) => ({
      _type: 'object',
      _key: crypto.randomUUID().slice(0, 8),
      title: v.title,
      title_pt: v.title_pt || undefined,
      description: v.description,
      description_pt: v.description_pt || undefined,
    }))

    const doc = {
      _type: 'section',
      sectionType: 'values',
      title: aboutPage?.valuesHeading || 'My values',
      title_pt: aboutPage?.valuesHeading_pt || 'Meus valores',
      uid: { _type: 'slug', current: 'values' },
      subtitle: null,
      content: [],
      contentBlocks: [
        {
          _type: 'valueCards',
          _key: crypto.randomUUID().slice(0, 8),
          heading: aboutPage?.valuesHeading || 'My values',
          heading_pt: aboutPage?.valuesHeading_pt || 'Meus valores',
          items,
        },
      ],
      pages: ['about'],
      order: 5,
      padding: 'py-16',
      overlay: false,
      hasDropShadow: false,
    }

    console.log(`\nCreating values section with ${items.length} value cards`)
    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2))
    } else {
      transaction.create(doc)
    }
  } else {
    console.log('\nNo values on AboutPage — skipping.')
  }

  // 4. Migrate existing sections: page (string) → pages (array)
  const toMigrate = existingSections.filter((s) => typeof s.page === 'string' && !s.pages)
  if (toMigrate.length > 0) {
    console.log(`\nMigrating ${toMigrate.length} existing sections from page → pages`)
    for (const section of toMigrate) {
      console.log(`  ${section._id}: page="${section.page}" → pages=["${section.page}"]`)
      if (!DRY_RUN) {
        transaction.patch(section._id, (patch) =>
          patch.set({ pages: [section.page] }).unset(['page'])
        )
      }
    }
  } else {
    console.log('\nNo existing sections need page → pages migration.')
  }

  if (!DRY_RUN) {
    console.log('\nCommitting transaction...')
    const result = await transaction.commit()
    console.log(`Transaction committed: ${result.transactionId}`)
  }

  console.log('\nMigration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
