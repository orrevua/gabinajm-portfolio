import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
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
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'uid',
      title: 'Unique ID',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      description: 'Stable identifier for referencing this section in pages',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'subtitle_pt',
      title: 'Subtitle (PT)',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Color', value: 'color' },
              { title: 'Image', value: 'image' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'color',
          title: 'Background Color',
          type: 'string',
          description: 'Hex color, e.g. #f4f4f0',
          hidden: ({ parent }) => parent?.type !== 'color',
        }),
        defineField({
          name: 'image',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.type !== 'image',
        }),
        defineField({
          name: 'imageAlt',
          title: 'Image Alt Text',
          type: 'string',
          hidden: ({ parent }) => parent?.type !== 'image',
        }),
      ],
    }),
    defineField({
      name: 'overlay',
      title: 'Dark Overlay',
      type: 'boolean',
      description: 'Add a semi-transparent dark overlay on background images',
      initialValue: true,
    }),
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'py-0' },
          { title: 'Small', value: 'py-8' },
          { title: 'Medium', value: 'py-16' },
          { title: 'Large', value: 'py-24' },
        ],
        layout: 'radio',
      },
      initialValue: 'py-16',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (0, 1, 2...)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'uid.current' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `uid: ${subtitle}` : '' }
    },
  },
})
