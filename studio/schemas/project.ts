import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Company Name',
      type: 'string',
      description: 'Displayed below the title in gradient color (e.g. "Quinto Andar")',
    }),
    defineField({
      name: 'subtitle_pt',
      title: 'Subtitle (PT)',
      type: 'string',
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description_pt',
      title: 'Description (PT)',
      type: 'text',
      rows: 5,
      description: 'Portuguese version. Falls back to English if empty.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mainImageCrop',
      title: 'Card Image Crop Position',
      type: 'string',
      description: 'Which part of the image to show on the project card',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Center (default)', value: 'center' },
          { title: 'Bottom', value: 'bottom' },
          { title: 'Full (no crop, fit entire image)', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'mainImageSize',
      title: 'Main Image Display Size',
      type: 'string',
      description: 'How large the hero image appears on the project page',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large (default)', value: 'large' },
          { title: 'Full Width', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),
    defineField({
      name: 'heroColor',
      title: 'Hero Background Color',
      type: 'string',
      description: 'Hex color for the hero section background (e.g. #3ddc97)',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'UI', value: 'ui' },
                  { title: 'UX', value: 'ux' },
                  { title: 'Design System', value: 'design system' },
                  { title: 'Branding', value: 'branding' },
                  { title: 'Illustration', value: 'illustration' },
                  { title: 'Other', value: 'other' },
                ],
              },
              initialValue: 'other',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'category' },
          },
        },
      ],
    }),
    defineField({
      name: 'contentSections',
      title: 'Content Sections',
      description: 'Add sections to build the project case study page',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textBlock',
          title: 'Text Block',
          fields: [
            defineField({
              name: 'sectionLabel',
              title: 'Section Label',
              type: 'string',
              description: 'Small colored label above the heading (e.g. "The Challenge")',
            }),
            defineField({
              name: 'sectionLabel_pt',
              title: 'Section Label (PT)',
              type: 'string',
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 8,
            }),
            defineField({
              name: 'body_pt',
              title: 'Body (PT)',
              type: 'text',
              rows: 8,
            }),
            defineField({
              name: 'bullets',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'bullets_pt',
              title: 'Bullet Points (PT)',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'sectionLabel' },
            prepare({ title, subtitle }) {
              return { title: title || 'Text Block', subtitle: subtitle || '' }
            },
          },
        },
        {
          type: 'object',
          name: 'fullWidthImage',
          title: 'Full Width Image',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'bgColor',
              title: 'Background Color',
              type: 'string',
              description: 'Optional hex color behind the image (e.g. #eee)',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'caption_pt',
              title: 'Caption (PT)',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Full Width Image', media }
            },
          },
        },
        {
          type: 'object',
          name: 'imageGallery',
          title: 'Image Gallery',
          fields: [
            defineField({
              name: 'columns',
              title: 'Columns',
              type: 'number',
              options: { list: [2, 3, 4] },
              initialValue: 2,
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                    }),
                  ],
                },
              ],
            }),
            defineField({
              name: 'bgColor',
              title: 'Background Color',
              type: 'string',
              description: 'Optional hex color behind the gallery',
            }),
          ],
          preview: {
            select: { images: 'images' },
            prepare({ images }) {
              return { title: `Gallery (${images?.length || 0} images)` }
            },
          },
        },
        {
          type: 'object',
          name: 'impactCards',
          title: 'Impact / Metrics Cards',
          fields: [
            defineField({
              name: 'cards',
              title: 'Cards',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'metric',
                      title: 'Metric',
                      type: 'string',
                      description: 'e.g. "+40%"',
                    }),
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      description: 'e.g. "increase in conversion"',
                    }),
                    defineField({
                      name: 'label_pt',
                      title: 'Label (PT)',
                      type: 'string',
                    }),
                  ],
                  preview: {
                    select: { title: 'metric', subtitle: 'label' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { cards: 'cards' },
            prepare({ cards }) {
              return { title: `Impact Cards (${cards?.length || 0})` }
            },
          },
        },
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Video Block',
          fields: [
            defineField({
              name: 'video',
              title: 'Upload Video',
              type: 'file',
              options: { accept: 'video/*' },
            }),
            defineField({
              name: 'externalUrl',
              title: 'External Video URL',
              description: 'YouTube or Vimeo URL (used if no video is uploaded)',
              type: 'url',
            }),
            defineField({
              name: 'poster',
              title: 'Poster / Thumbnail',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
              ],
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({ name: 'caption_pt', title: 'Caption (PT)', type: 'string' }),
            defineField({ name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false }),
            defineField({ name: 'loop', title: 'Loop', type: 'boolean', initialValue: false }),
            defineField({ name: 'muted', title: 'Muted', type: 'boolean', initialValue: true }),
            defineField({
              name: 'bgColor',
              title: 'Background Color',
              type: 'string',
              description: 'Optional hex color behind the video',
            }),
          ],
          preview: {
            select: { title: 'caption' },
            prepare({ title }) {
              return { title: title || 'Video Block' }
            },
          },
        },
        {
          type: 'object',
          name: 'colorStrip',
          title: 'Color Strip Section',
          fields: [
            defineField({
              name: 'sectionLabel',
              title: 'Section Label',
              type: 'string',
            }),
            defineField({
              name: 'sectionLabel_pt',
              title: 'Section Label (PT)',
              type: 'string',
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'subtitle_pt',
              title: 'Subtitle (PT)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'bgColor',
              title: 'Background Color',
              type: 'string',
              description: 'Hex color for the strip (e.g. #9ceaef)',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'Hex color for text (e.g. #400039)',
              initialValue: '#400039',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'bullets',
              title: 'Bullet Points',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'title', title: 'Title', type: 'string' }),
                    defineField({ name: 'title_pt', title: 'Title (PT)', type: 'string' }),
                    defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
                    defineField({ name: 'text_pt', title: 'Text (PT)', type: 'text', rows: 3 }),
                  ],
                  preview: { select: { title: 'title' } },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'sectionLabel' },
            prepare({ title }) {
              return { title: title || 'Color Strip' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'link',
      title: 'Live URL',
      type: 'url',
      description: 'Link to the live project',
    }),
    defineField({
      name: 'repository',
      title: 'Repository URL',
      type: 'url',
      description: 'Link to the source code',
    }),
    defineField({
      name: 'cardColor',
      title: 'Card Color',
      type: 'object',
      description: 'Custom card colors. Leave empty to use the default palette.',
      fields: [
        defineField({
          name: 'bg',
          title: 'Background',
          type: 'string',
          description: 'Hex color e.g. #3ddc97',
        }),
        defineField({
          name: 'fg',
          title: 'Text Color',
          type: 'string',
          description: 'Hex color e.g. #400039',
        }),
        defineField({
          name: 'border',
          title: 'Border/Tag Color',
          type: 'string',
          description: 'Hex color e.g. #400039',
        }),
      ],
    }),
    defineField({
      name: 'cardStyle',
      title: 'Card Style',
      type: 'string',
      description: 'Large: floating mockup image, content bottom-left. Small: image fills top with rounded corners, content below.',
      options: {
        list: [
          { title: 'Large (mockup float)', value: 'large' },
          { title: 'Small (cover image)', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),
    defineField({
      name: 'password',
      title: 'Password Protection',
      type: 'string',
      description: 'If set, visitors must enter this password to view the project. Leave empty for public access.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this project on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'mainImage' },
  },
})
