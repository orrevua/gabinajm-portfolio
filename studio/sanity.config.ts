import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import type { StructureBuilder } from 'sanity/structure'
import { schemaTypes } from './schemas'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Profile')
        .icon(() => '👤')
        .child(
          S.documentTypeList('profile').title('Profile')
        ),
      S.divider(),
      S.listItem()
        .title('Home Page')
        .icon(() => '🏠')
        .child(
          S.documentTypeList('homePage').title('Home Page')
        ),
      S.listItem()
        .title('About Page')
        .icon(() => '📄')
        .child(
          S.documentTypeList('aboutPage').title('About Page')
        ),
      S.divider(),
      S.listItem()
        .title('Projects')
        .icon(() => '🎨')
        .child(S.documentTypeList('project').title('Projects')),
      S.listItem()
        .title('Sections')
        .icon(() => '📦')
        .child(S.documentTypeList('section').title('Sections')),
    ])

export default defineConfig({
  name: 'gabi-portfolio',
  title: 'Gabi Portfolio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
