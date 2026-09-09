import type { GlobalConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website Settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Rana Community Hub',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home Page',
          fields: [
            {
              name: 'home',
              type: 'group',
              fields: [
                {
                  name: 'heroHeading',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'heroSubheading',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'heroImages',
                  type: 'array',
                  labels: { singular: 'Hero Image', plural: 'Hero Images' },
                  admin: {
                    description:
                      'Full-bleed hero background for desktop/tablet. One image is shown static; two or more auto-rotate as a slideshow. Ignored if a Hero Video is set.',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'heroImagesMobile',
                  type: 'array',
                  labels: { singular: 'Mobile Hero Image', plural: 'Mobile Hero Images' },
                  admin: {
                    description:
                      'Optional — a separate hero background for phone screens. A single wide desktop photo usually crops badly on a narrow screen, so upload a portrait/square-friendly version of the same scene here. Leave empty to reuse the desktop Hero Images above on mobile too. Ignored if a Hero Video is set.',
                  },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'heroVideo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Optional — an uploaded video file (mp4) plays full-bleed behind the hero, muted and looping. Takes priority over Hero Images if set.',
                  },
                },
                {
                  name: 'introText',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'history',
                  type: 'group',
                  label: 'History Section',
                  admin: {
                    description:
                      'Shown on the Home page above "Our Villages". Leave Content blank to hide the section.',
                  },
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      localized: true,
                      defaultValue: 'Our History',
                    },
                    {
                      name: 'content',
                      type: 'richText',
                      localized: true,
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'About Us',
          fields: [
            {
              name: 'about',
              type: 'group',
              fields: [
                {
                  name: 'introduction',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'historyAndBackground',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'visionAndMission',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'objectives',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'heritageAndCulture',
                  type: 'richText',
                  localized: true,
                },
                {
                  name: 'achievements',
                  type: 'richText',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & Social',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'address',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'phone',
                  type: 'text',
                },
                {
                  name: 'email',
                  type: 'text',
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                },
              ],
            },
            {
              name: 'social',
              type: 'array',
              labels: {
                singular: 'Social Link',
                plural: 'Social Links',
              },
              fields: [
                {
                name: 'platform',
                type: 'text',
                localized: true,
                },
                {
                  name: 'url',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
