/**
 * Migration: Move about-preview data from homePage + Profile into a Section document.
 *
 * 1. Creates an "about-preview" section with content block containing:
 *    - body/body_pt from homePage.aboutBody/aboutBody_pt
 *    - skills from Profile.technologies
 *    - resumeUrl from Profile.resumeUrl
 *    - showResume from homePage.showResume
 *    - showSkills from homePage.showSkills
 *    - heading from homePage.aboutHeading
 * 2. Removes aboutHeading/aboutBody/showResume/showSkills from homePage
 * 3. Removes technologies/resumeUrl from Profile
 *
 * Usage: node studio/migrations/move-about-to-section.mjs [--dry-run]
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
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yrx7q093',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-15',
    token,
    useCdn: false,
  })

  // Fetch homePage data
  const homePage = await client.fetch(`*[_type == "homePage"][0] {
    aboutHeading, aboutHeading_pt, aboutBody, aboutBody_pt, showResume, showSkills
  }`)
  console.log('HomePage about data:', JSON.stringify(homePage, null, 2))

  // Fetch profile data (both published and draft)
  const profile = await client.fetch(`*[_id == "profile"][0] {
    technologies, resumeUrl
  }`)
  const profileDraft = await client.fetch(`*[_id == "drafts.profile"][0] {
    technologies, resumeUrl
  }`)
  const src = profileDraft || profile
  console.log('Profile skills data:', JSON.stringify(src, null, 2))

  // Check if about-preview section already exists
  const existing = await client.fetch(`*[_type == "section" && sectionType == "about-preview"][0]._id`)
  if (existing) {
    console.log(`About-preview section already exists (${existing}). Updating content block...`)
    // Update existing section with the data from homePage/Profile
    const contentBlock = {
      _type: 'aboutPreviewBlock',
      _key: 'about-preview-block',
      body: homePage?.aboutBody || '',
      body_pt: homePage?.aboutBody_pt || '',
      skills: (src?.technologies || []).map((t, i) => ({
        _key: `skill-${i}`,
        name: t.name,
        icon: t.icon,
        color: t.color,
      })),
      resumeUrl: src?.resumeUrl || undefined,
      showResume: homePage?.showResume ?? true,
      showSkills: homePage?.showSkills ?? true,
    }

    if (!DRY_RUN) {
      await client.patch(existing).set({
        title: homePage?.aboutHeading || 'About Me',
        title_pt: homePage?.aboutHeading_pt || undefined,
        contentBlocks: [contentBlock],
      }).commit()
      // Also patch draft if exists
      const draftId = `drafts.${existing}`
      const draftExists = await client.fetch(`defined(*[_id == $id][0])`, { id: draftId })
      if (draftExists) {
        await client.patch(draftId).set({
          title: homePage?.aboutHeading || 'About Me',
          title_pt: homePage?.aboutHeading_pt || undefined,
          contentBlocks: [contentBlock],
        }).commit()
      }
    }
    console.log('Updated existing about-preview section.')
  } else {
    // Create new about-preview section
    const sectionDoc = {
      _type: 'section',
      uid: { _type: 'slug', current: 'about-preview' },
      sectionType: 'about-preview',
      title: homePage?.aboutHeading || 'About Me',
      title_pt: homePage?.aboutHeading_pt || undefined,
      content: [],
      contentBlocks: [{
        _type: 'aboutPreviewBlock',
        _key: 'about-preview-block',
        body: homePage?.aboutBody || '',
        body_pt: homePage?.aboutBody_pt || '',
        skills: (src?.technologies || []).map((t, i) => ({
          _key: `skill-${i}`,
          name: t.name,
          icon: t.icon,
          color: t.color,
        })),
        resumeUrl: src?.resumeUrl || undefined,
        showResume: homePage?.showResume ?? true,
        showSkills: homePage?.showSkills ?? true,
      }],
      pages: ['home', 'about'],
      order: 10,
      hasDropShadow: false,
      padding: 'py-16',
    }

    console.log('Creating about-preview section:', JSON.stringify(sectionDoc, null, 2))
    if (!DRY_RUN) {
      const created = await client.create(sectionDoc)
      console.log(`Created about-preview section: ${created._id}`)
    }
  }

  // Clean up homePage — remove about fields
  const homePageId = await client.fetch(`*[_type == "homePage"][0]._id`)
  if (homePageId) {
    const unsetFields = ['aboutHeading', 'aboutHeading_pt', 'aboutBody', 'aboutBody_pt', 'showResume', 'showSkills']
    console.log(`Cleaning homePage (${homePageId}): unsetting ${unsetFields.join(', ')}`)
    if (!DRY_RUN) {
      await client.patch(homePageId).unset(unsetFields).commit()
      const draftHomeId = `drafts.${homePageId}`
      const draftExists = await client.fetch(`defined(*[_id == $id][0])`, { id: draftHomeId })
      if (draftExists) {
        await client.patch(draftHomeId).unset(unsetFields).commit()
      }
    }
  }

  // Clean up Profile — remove technologies and resumeUrl
  const unsetProfileFields = ['technologies', 'resumeUrl']
  console.log(`Cleaning Profile: unsetting ${unsetProfileFields.join(', ')}`)
  if (!DRY_RUN) {
    try {
      await client.patch('profile').unset(unsetProfileFields).commit()
    } catch { /* published might not exist */ }
    try {
      await client.patch('drafts.profile').unset(unsetProfileFields).commit()
    } catch { /* draft might not exist */ }
  }

  console.log('Migration complete!')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
