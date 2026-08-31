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
      required: true,
      defaultValue: 'Rana Community Hub',
    },
    {
      name: 'tagline',
      type: 'text',
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
                },
                {
                  name: 'heroSubheading',
                  type: 'textarea',
                },
                {
                  name: 'heroImages',
                  type: 'array',
                  labels: { singular: 'Hero Image', plural: 'Hero Images' },
                  admin: {
                    description:
                      'Full-bleed hero background. One image is shown static; two or more auto-rotate as a slideshow. Ignored if a Hero Video is set.',
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
                      defaultValue: 'Our History',
                    },
                    {
                      name: 'content',
                      type: 'richText',
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
                },
                {
                  name: 'historyAndBackground',
                  type: 'richText',
                },
                {
                  name: 'visionAndMission',
                  type: 'richText',
                },
                {
                  name: 'objectives',
                  type: 'richText',
                },
                {
                  name: 'heritageAndCulture',
                  type: 'richText',
                },
                {
                  name: 'achievements',
                  type: 'richText',
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
