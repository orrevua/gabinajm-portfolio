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
      description: 'e.g. "Product Designer"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_pt',
      title: 'Professional Title (PT)',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'Short introduction shown in the hero section',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio_pt',
      title: 'Short Bio (PT)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'avatar',
      title: 'Main Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Your main photo displayed on the home page hero',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'avatar' },
  },
})
