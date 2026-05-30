import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      description: 'Add and reorder sections to build the homepage',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section',
          fields: [
            defineField({ name: 'greeting', title: 'Greeting', type: 'string', initialValue: 'Hi there! 👋' }),
            defineField({ name: 'greeting_pt', title: 'Greeting (PT)', type: 'string' }),
            defineField({ name: 'ctaPrimaryLabel', title: 'Primary CTA Label', type: 'string', initialValue: 'Get in touch' }),
            defineField({ name: 'ctaPrimaryLabel_pt', title: 'Primary CTA Label (PT)', type: 'string' }),
            defineField({ name: 'ctaPrimaryHref', title: 'Primary CTA Link', type: 'string', initialValue: '#contact' }),
            defineField({ name: 'ctaSecondaryLabel', title: 'Secondary CTA Label', type: 'string', initialValue: 'Learn more' }),
            defineField({ name: 'ctaSecondaryLabel_pt', title: 'Secondary CTA Label (PT)', type: 'string' }),
            defineField({ name: 'ctaSecondaryHref', title: 'Secondary CTA Link', type: 'string', initialValue: '#about' }),
          ],
          preview: {
            prepare() { return { title: 'Hero Section' } },
          },
        },
        {
          type: 'object',
          name: 'aboutSection',
          title: 'About Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'About Me' }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
            defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 6 }),
            defineField({ name: 'body_pt', title: 'Body Text (PT)', type: 'text', rows: 6 }),
            defineField({ name: 'showResume', title: 'Show Resume Link', type: 'boolean', initialValue: true }),
            defineField({ name: 'showSkills', title: 'Show Skills Tags', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'About Section' } },
          },
        },
        {
          type: 'object',
          name: 'projectsSection',
          title: 'Projects Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'My projects' }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
            defineField({ name: 'maxProjects', title: 'Max Projects', type: 'number', initialValue: 4 }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'Projects Section' } },
          },
        },
        {
          type: 'object',
          name: 'experienceSection',
          title: 'Past Experience Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Past Experience' }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'Past Experience' } },
          },
        },
        {
          type: 'object',
          name: 'videoSection',
          title: 'Video Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
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
            defineField({ name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false }),
            defineField({ name: 'loop', title: 'Loop', type: 'boolean', initialValue: false }),
            defineField({ name: 'muted', title: 'Muted', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'Video Section' } },
          },
        },
        {
          type: 'object',
          name: 'contactSection',
          title: 'Contact Section',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: "Let's talk" }),
            defineField({ name: 'heading_pt', title: 'Heading (PT)', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', initialValue: 'I will reply to you as soon as possible.' }),
            defineField({ name: 'subtitle_pt', title: 'Subtitle (PT)', type: 'string' }),
            defineField({ name: 'availabilityText', title: 'Availability Text', type: 'text', rows: 3 }),
            defineField({ name: 'availabilityText_pt', title: 'Availability Text (PT)', type: 'text', rows: 3 }),
            defineField({ name: 'showForm', title: 'Show Contact Form', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) { return { title: title || 'Contact Section' } },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'Home Page' } },
  },
})
