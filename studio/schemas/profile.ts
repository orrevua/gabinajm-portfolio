import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity' },
    { name: 'skills', title: 'Skills' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g. "Product Designer"',
      validation: (rule) => rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'title_pt',
      title: 'Professional Title (PT)',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'Short introduction shown in the hero section',
      validation: (rule) => rule.required(),
      group: 'identity',
    }),
    defineField({
      name: 'bio_pt',
      title: 'Short Bio (PT)',
      type: 'text',
      rows: 3,
      group: 'identity',
    }),
    defineField({
      name: 'avatar',
      title: 'Main Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Your main photo displayed on the home page hero',
      group: 'identity',
    }),

    // --- Skills & Experience ---
    defineField({
      name: 'technologies',
      title: 'Skills / Technologies',
      type: 'array',
      description: 'Skill badges shared across pages',
      group: 'skills',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'icon', title: 'Icon', type: 'image', description: 'Small icon (SVG or PNG)' }),
          defineField({ name: 'color', title: 'Badge Color', type: 'string', description: 'CSS class or hex' }),
        ],
        preview: { select: { title: 'name', media: 'icon' } },
      }],
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'Link to downloadable resume/CV',
      group: 'skills',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'avatar' },
  },
})
