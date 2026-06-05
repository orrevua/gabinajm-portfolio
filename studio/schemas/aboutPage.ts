import { defineType, defineField } from 'sanity'

const richTextBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'Quote', value: 'blockquote' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (rule) =>
              rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
          }),
        ],
      },
    ],
  },
}

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'bio', title: 'Bio Card' },
    { name: 'values', title: 'Values' },
    { name: 'contact', title: 'Contact & Links' },
  ],
  fields: [
    // --- Hero Section ---
    defineField({
      name: 'heroImage',
      title: 'About Page Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo shown on the About page header',
      group: 'hero',
    }),

    // --- Bio Card ---
    defineField({
      name: 'bioHeading',
      title: 'Bio Card Heading',
      type: 'string',
      description: 'e.g. "Hi, I\'m Gabi,"',
      initialValue: "Hi, I'm Gabi,",
      group: 'bio',
    }),
    defineField({
      name: 'bioHeading_pt',
      title: 'Bio Card Heading (PT)',
      type: 'string',
      group: 'bio',
    }),
    defineField({
      name: 'bio',
      title: 'Full Bio',
      type: 'array',
      of: [richTextBlock],
      description: 'Full biography displayed on the About page',
      group: 'bio',
    }),
    defineField({
      name: 'bio_pt',
      title: 'Full Bio (PT)',
      type: 'array',
      of: [richTextBlock],
      group: 'bio',
    }),
    defineField({
      name: 'skillChips',
      title: 'Skill Chips',
      description: 'Colored skill badges displayed on the bio card',
      type: 'array',
      group: 'bio',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label_pt',
              title: 'Label (PT)',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Small icon (SVG or PNG) shown next to the label',
            }),
            defineField({
              name: 'color',
              title: 'Background Color',
              type: 'string',
              description: 'Hex color e.g. #fee8db',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'color', media: 'icon' },
          },
        },
      ],
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
      description: 'Link to downloadable resume/CV',
      group: 'bio',
    }),

    // --- Values ---
    defineField({
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'string',
      initialValue: 'My values',
      group: 'values',
    }),
    defineField({
      name: 'valuesHeading_pt',
      title: 'Values Section Heading (PT)',
      type: 'string',
      group: 'values',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      description: 'Numbered value cards',
      type: 'array',
      group: 'values',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'title_pt', title: 'Title (PT)', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: 'description_pt', title: 'Description (PT)', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),

    // --- Contact & Links ---
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'contact',
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
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'About Page' } },
  },
})
