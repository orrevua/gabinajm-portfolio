/**
 * Migration: consolidate shared data into Profile.
 * Move socialLinks, resumeUrl, technologies, pastExperience back to Profile.
 * Remove duplicates from homePage and aboutPage documents.
 */
import { exec } from 'child_process'
import { promisify } from 'util'
import { createClient } from '@sanity/client'

const execAsync = promisify(exec)

async function getCliToken() {
  const { stdout } = await execAsync('npx sanity debug --secrets 2>&1')
  const match = stdout.match(/Auth token:\s+(.+)/i)
  if (!match) throw new Error('Could not extract Sanity auth token.')
  return match[1].trim()
}

async function migrate() {
  console.log('Getting auth token...')
  const token = await getCliToken()

  const client = createClient({
    projectId: 'v0mc5w1c',
    dataset: 'production',
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  const [profile, homePage, aboutPage] = await Promise.all([
    client.getDocument('profile'),
    client.getDocument('homePage'),
    client.getDocument('aboutPage'),
  ])

  if (!profile) { console.log('No profile found!'); return }

  // --- Move shared data TO Profile ---
  console.log('\n--- Adding shared data to Profile ---')

  // socialLinks: prefer aboutPage (most recently set)
  const socialLinks = aboutPage?.socialLinks || homePage?.socialLinks || []
  // resumeUrl: prefer aboutPage
  const resumeUrl = aboutPage?.resumeUrl || homePage?.resumeUrl || null
  // technologies: from homePage
  const technologies = homePage?.technologies || []
  // pastExperience: from homePage
  const pastExperience = homePage?.pastExperience || []

  await client.patch('profile')
    .set({
      socialLinks,
      resumeUrl,
      technologies,
      pastExperience,
    })
    .commit()
  console.log(`Set ${socialLinks.length} socialLinks, resumeUrl, ${technologies.length} technologies, ${pastExperience.length} pastExperience on Profile`)

  // --- Clean homePage: remove shared fields ---
  console.log('\n--- Cleaning homePage ---')
  await client.patch('homePage')
    .unset(['socialLinks', 'resumeUrl', 'technologies', 'pastExperience'])
    .commit()
  console.log('Removed socialLinks, resumeUrl, technologies, pastExperience from homePage')

  // --- Clean aboutPage: remove shared fields ---
  if (aboutPage) {
    console.log('\n--- Cleaning aboutPage ---')
    await client.patch('aboutPage')
      .unset(['socialLinks', 'resumeUrl'])
      .commit()
    console.log('Removed socialLinks, resumeUrl from aboutPage')
  }

  console.log('\nMigration complete!')
}

migrate().catch(err => { console.error('Failed:', err); process.exit(1) })
