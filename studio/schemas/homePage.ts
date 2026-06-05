import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About Preview' },
    { name: 'projects', title: 'Projects' },
    { name: 'experience', title: 'Experience' },
    { name: 'video', title: 'Video' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    // --- Hero ---
    defineField({
      name: 'greeting',
      title: 'Greeting',
      type: 'string',
      initialValue: 'Hi there! 👋',
      group: 'hero',
    }),
    defineField({ name: 'greeting_pt', title: 'Greeting (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaPrimaryLabel', title: 'Primary CTA Label', type: 'string', initialValue: 'Get in touch', group: 'hero' }),
    defineField({ name: 'ctaPrimaryLabel_pt', title: 'Primary CTA Label (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaPrimaryHref', title: 'Primary CTA Link', type: 'string', initialValue: '#contact', group: 'hero' }),
    defineField({ name: 'ctaSecondaryLabel', title: 'Secondary CTA Label', type: 'string', initialValue: 'Learn more', group: 'hero' }),
    defineField({ name: 'ctaSecondaryLabel_pt', title: 'Secondary CTA Label (PT)', type: 'string', group: 'hero' }),
    defineField({ name: 'ctaSecondaryHref', title: 'Secondary CTA Link', type: 'string', initialValue: '#about', group: 'hero' }),

    // --- About Preview ---
    defineField({ name: 'aboutHeading', title: 'Heading', type: 'string', initialValue: 'About Me', group: 'about' }),
    defineField({ name: 'aboutHeading_pt', title: 'Heading (PT)', type: 'string', group: 'about' }),
    defineField({ name: 'aboutBody', title: 'Summary Text', type: 'text', rows: 4, description: 'Short preview of the about section for the home page', group: 'about' }),
    defineField({ name: 'aboutBody_pt', title: 'Summary Text (PT)', type: 'text', rows: 4, group: 'about' }),
    defineField({ name: 'showResume', title: 'Show Resume Link', type: 'boolean', initialValue: true, group: 'about' }),
    defineField({ name: 'showSkills', title: 'Show Skills Tags', type: 'boolean', initialValue: true, group: 'about' }),
    defineField({
      name: 'technologies',
      title: 'Skills Tags',
      type: 'array',
      description: 'Skill badges shown on the home about card',
      group: 'about',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
          defineField({ name: 'icon', title: 'Icon', type: 'image', description: 'Small icon (SVG or PNG)' }),
          defineField({ name: 'color', title: 'Badge Color', type: 'string', description: 'CSS class or hex for badge styling (e.g. bg-accent/10 text-accent)' }),
        ],
        preview: { select: { title: 'name', media: 'icon' } },
      }],
    }),

    // --- Projects ---
    defineField({ name: 'projectsHeading', title: 'Heading', type: 'string', initialValue: 'My projects', group: 'projects' }),
    defineField({ name: 'projectsHeading_pt', title: 'Heading (PT)', type: 'string', group: 'projects' }),
    defineField({ name: 'maxProjects', title: 'Max Projects to Show', type: 'number', initialValue: 4, group: 'projects' }),

    // --- Experience ---
    defineField({ name: 'experienceHeading', title: 'Heading', type: 'string', initialValue: 'Past Experience', group: 'experience' }),
    defineField({ name: 'experienceHeading_pt', title: 'Heading (PT)', type: 'string', group: 'experience' }),
    defineField({
      name: 'pastExperience',
      title: 'Company Logos',
      type: 'array',
      description: 'Company logos shown in the Past Experience section',
      group: 'experience',
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

    // --- Video ---
    defineField({ name: 'videoHeading', title: 'Heading', type: 'string', group: 'video' }),
    defineField({ name: 'videoSubtitle', title: 'Subtitle', type: 'string', group: 'video' }),
    defineField({ name: 'video', title: 'Upload Video', type: 'file', options: { accept: 'video/*' }, group: 'video' }),
    defineField({ name: 'videoExternalUrl', title: 'External Video URL', type: 'url', description: 'YouTube or Vimeo URL (used if no video uploaded)', group: 'video' }),
    defineField({ name: 'videoPoster', title: 'Poster / Thumbnail', type: 'image', options: { hotspot: true }, group: 'video' }),
    defineField({ name: 'videoAutoplay', title: 'Autoplay', type: 'boolean', initialValue: false, group: 'video' }),
    defineField({ name: 'videoLoop', title: 'Loop', type: 'boolean', initialValue: false, group: 'video' }),
    defineField({ name: 'videoMuted', title: 'Muted', type: 'boolean', initialValue: true, group: 'video' }),

    // --- Contact ---
    defineField({ name: 'contactHeading', title: 'Heading', type: 'string', initialValue: "Let's talk", group: 'contact' }),
    defineField({ name: 'contactHeading_pt', title: 'Heading (PT)', type: 'string', group: 'contact' }),
    defineField({ name: 'contactSubtitle', title: 'Subtitle', type: 'string', initialValue: 'I will reply to you as soon as possible.', group: 'contact' }),
    defineField({ name: 'contactSubtitle_pt', title: 'Subtitle (PT)', type: 'string', group: 'contact' }),
    defineField({ name: 'availabilityText', title: 'Availability Text', type: 'text', rows: 2, group: 'contact' }),
    defineField({ name: 'availabilityText_pt', title: 'Availability Text (PT)', type: 'text', rows: 2, group: 'contact' }),
    defineField({ name: 'showForm', title: 'Show Contact Form', type: 'boolean', initialValue: true, group: 'contact' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'contact',
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
    defineField({ name: 'resumeUrl', title: 'Resume URL', type: 'url', group: 'contact' }),
  ],
  preview: {
    prepare() { return { title: 'Home Page' } },
  },
})
