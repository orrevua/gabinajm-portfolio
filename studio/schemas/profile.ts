import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity' },
    { name: 'hero', title: 'Hero' },
    { name: 'skills', title: 'Skills' },
  ],
  fields: [
    // --- Identity ---
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

    // --- Hero ---
    defineField({ name: 'greeting', title: 'Greeting', type: 'string', initialValue: 'Hi there!', description: 'Just the greeting, e.g. "Olá!" — the wave emoji is added automatically', group: 'hero' }),
    defineField({ name: 'greeting_pt', title: 'Greeting (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroName', title: 'Display Name', type: 'string', initialValue: 'Gabi', description: 'Name shown with gradient in the hero, e.g. "Gabi" or "Gabiiiii"', group: 'hero' }),
    defineField({ name: 'heroName_pt', title: 'Display Name (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaPrimaryLabel', title: 'Primary CTA Label', type: 'string', initialValue: 'Get in touch', group: 'hero' }),
    defineField({ name: 'ctaPrimaryLabel_pt', title: 'Primary CTA Label (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaPrimaryHref', title: 'Primary CTA Link', type: 'string', initialValue: '#contact', group: 'hero' }),
    defineField({ name: 'ctaSecondaryLabel', title: 'Secondary CTA Label', type: 'string', initialValue: 'Learn more', group: 'hero' }),
    defineField({ name: 'ctaSecondaryLabel_pt', title: 'Secondary CTA Label (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaSecondaryHref', title: 'Secondary CTA Link', type: 'string', initialValue: '#about', group: 'hero' }),

    // --- Skills ---
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
