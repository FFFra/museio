const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const lost = require('lost')
const tipsy = require('postcss-tipsy')
const animation = require('postcss-animation')
const env = process.env.SPIKE_ENV
const Contentful = require('spike-contentful')

const locals = {}

module.exports = {
  reshape: htmlStandards({ locals: () => locals })
}

const newLocal = 'data.json';

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json'],
  reshape: htmlStandards({
    parser: sugarml,
    locals: (ctx) => locals,
    minify: env === 'production',
    retext: []
  }),
  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production',
    appendPlugins: [lost(), tipsy(), animation()]
  }),
  babel: jsStandards(),
  plugins: [
    new Contentful({
      addDataTo: locals,
      accessToken: '480640bb178b9eb1632c2730e0b37dfd46aee289385c8852592e63a779470a07',
      spaceId: '543uoj65nye4',
      contentTypes: [
        {
          name: 'cities',
          id: 'city',
          filters: {
            order: 'fields.slug'
          },
          transform: (city) => {
            return city.fields
          }
        },
        {
          name: 'features',
          id: 'features'
        },
        {
          name: 'museums',
          id: 'museum',
          transform: (museum) => {
            return museum.fields
          },
          filters: {
            order: 'fields.slug'
          },
          template: {
            path: 'views/museum.sgr',
            output: (museum) => { return `museum/${museum.slug}.html` }
          }
        },
        {
          name: 'pieces',
          id: 'piece',
          transform: (piece) => {
            return piece.fields
          },
          template: {
            path: 'views/story.sgr',
            output: (story) => { return `story/${story.slug}.html` }
          }
        },
        {
          name: 'recentstories',
          id: 'piece',
          transform: (piece) => {
            return piece.fields
          },
          filters: {
            limit: 38
          }
        },
        {
          name: 'art',
          id: 'art',
          transform: (art) => {
            return art.fields
          }
        },
        {
          name: 'location',
          id: 'location',
          transform: (location) => {
            return location.fields
          }
        }
      ]
    })
]
}
