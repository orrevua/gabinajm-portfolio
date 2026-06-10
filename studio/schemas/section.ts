import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Section Type',
      type: 'string',
      options: {
        list: [
          { title: 'Generic', value: 'generic' },
          { title: 'About Preview', value: 'about-preview' },
          { title: 'Past Experience', value: 'past-experience' },
          { title: 'Contact / Social Links', value: 'contact' },
          { title: 'Values', value: 'values' },
        ],
      },
      initialValue: 'generic',
    }),
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
      name: 'contentBlocks',
      title: 'Content Blocks',
      description: 'Structured content blocks (cards, values, etc.)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'infoCard',
          title: 'Info Card',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
            defineField({ name: 'body_pt', title: 'Body (PT)', type: 'text', rows: 6 }),
            defineField({
              name: 'chips',
              title: 'Chips / Tags',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
                  defineField({ name: 'label_pt', title: 'Label (PT)', type: 'string' }),
                  defineField({ name: 'color', title: 'Background Color', type: 'string', description: 'Hex e.g. #fee8db' }),
                ],
                preview: { select: { title: 'label', subtitle: 'color' } },
              }],
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Button Label',
              type: 'string',
            }),
            defineField({ name: 'ctaLabel_pt', title: 'CTA Button Label (PT)', type: 'string' }),
            defineField({
              name: 'ctaHref',
              title: 'CTA Button Link',
              type: 'url',
              validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'Info Card' } },
          },
        },
        {
          type: 'object',
          name: 'valueCards',
          title: 'Value Cards',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
            defineField({
              name: 'items',
              title: 'Values',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
                  defineField({ name: 'title_pt', title: 'Title (PT)', type: 'string' }),
                  defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.required() }),
                  defineField({ name: 'description_pt', title: 'Description (PT)', type: 'text', rows: 3 }),
                ],
                preview: { select: { title: 'title' } },
              }],
            }),
          ],
          preview: {
            select: { title: 'heading', items: 'items' },
            prepare({ title, items }) {
              return { title: title || `Value Cards (${items?.length || 0})` }
            },
          },
        },
        {
          type: 'object',
          name: 'companyLogos',
          title: 'Company Logos',
          fields: [
            defineField({
              name: 'companies',
              title: 'Companies',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'name', title: 'Company Name', type: 'string', validation: (rule) => rule.required() }),
                  defineField({ name: 'url', title: 'URL', type: 'url' }),
                  defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, validation: (rule) => rule.required() }),
                ],
                preview: { select: { title: 'name', media: 'logo' } },
              }],
            }),
          ],
          preview: {
            select: { companies: 'companies' },
            prepare({ companies }) {
              return { title: `Company Logos (${companies?.length || 0})` }
            },
          },
        },
        {
          type: 'object',
          name: 'socialLinksBlock',
          title: 'Social Links',
          fields: [
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [{
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
                    validation: (rule) => rule.required().uri({ allowRelative: false, scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
                preview: { select: { title: 'platform', subtitle: 'url' } },
              }],
            }),
            defineField({ name: 'availabilityText', title: 'Availability Text', type: 'string' }),
            defineField({ name: 'availabilityText_pt', title: 'Availability Text (PT)', type: 'string' }),
          ],
          preview: {
            select: { links: 'links' },
            prepare({ links }) {
              return { title: `Social Links (${links?.length || 0})` }
            },
          },
        },
        {
          type: 'object',
          name: 'aboutPreviewBlock',
          title: 'About Preview',
          fields: [
            defineField({ name: 'body', title: 'Summary Text', type: 'text', rows: 4 }),
            defineField({ name: 'body_pt', title: 'Summary Text (PT)', type: 'text', rows: 4 }),
            defineField({
              name: 'skills',
              title: 'Skill Tags',
              type: 'array',
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
            defineField({ name: 'resumeUrl', title: 'Resume URL', type: 'url', description: 'External link to resume (used as default fallback)' }),
            defineField({ name: 'resumeFile', title: 'Resume File', type: 'file', description: 'Upload resume/CV (PDF) — overrides Resume URL if set', options: { accept: 'application/pdf' } }),
            defineField({ name: 'showResume', title: 'Show Resume Link', type: 'boolean', initialValue: true }),
            defineField({ name: 'showSkills', title: 'Show Skill Tags', type: 'boolean', initialValue: true }),
          ],
          preview: {
            prepare() { return { title: 'About Preview' } },
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
      name: 'hasDropShadow',
      title: 'Has Drop Shadow',
      type: 'boolean',
      description: 'Toggle whether content blocks in this section should render with a drop shadow',
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
      name: 'pages',
      title: 'Pages',
      type: 'array',
      description: 'Which pages this section appears on',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
        ],
      },
      validation: (rule) => rule.required().min(1),
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
