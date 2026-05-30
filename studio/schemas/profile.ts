import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g. "Full-Stack Engineer" or "UX Designer"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_pt',
      title: 'Professional Title (PT)',
      type: 'string',
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio (Hero)',
      type: 'text',
      rows: 4,
      description: 'Short introduction displayed in the hero section',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio_pt',
      title: 'Bio (Hero) (PT)',
      type: 'text',
      rows: 4,
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'aboutBio',
      title: 'About Me (Long Bio)',
      type: 'text',
      rows: 8,
      description: 'Longer bio displayed in the About Me section. If empty, falls back to the hero bio.',
    }),
    defineField({
      name: 'aboutBio_pt',
      title: 'About Me (Long Bio) (PT)',
      type: 'text',
      rows: 8,
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Email', value: 'email' },
                  { title: 'Instagram', value: 'instagram' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ allowRelative: false, scheme: ['http', 'https', 'mailto'] }),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'Link to downloadable resume/CV',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies & Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'pastExperience',
      title: 'Past Experience',
      type: 'array',
      description: 'Company logos shown in the Past Experience section',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Company Name', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: 'name', media: 'logo' } },
      }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'avatar' },
  },
})
