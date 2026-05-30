import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'bioHeading',
      title: 'Bio Card Heading',
      type: 'string',
      description: 'Heading inside the bio card (e.g. "Hi, I\'m Gabi,")',
      initialValue: "Hi, I'm Gabi,",
    }),
    defineField({
      name: 'bioHeading_pt',
      title: 'Bio Card Heading (PT)',
      type: 'string',
    }),
    defineField({
      name: 'valuesHeading',
      title: 'Values Section Heading',
      type: 'string',
      initialValue: 'My values',
    }),
    defineField({
      name: 'valuesHeading_pt',
      title: 'Values Section Heading (PT)',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      description: 'Numbered value cards displayed on the About page',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title_pt',
              title: 'Title (PT)',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description_pt',
              title: 'Description (PT)',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
    defineField({
      name: 'skillChips',
      title: 'Skill Chips',
      description: 'Colored skill badges displayed on the bio card',
      type: 'array',
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
              name: 'color',
              title: 'Background Color',
              type: 'string',
              description: 'Hex color e.g. #fee8db',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'color' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'About Page' } },
  },
})
