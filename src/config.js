require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  staging: typeof process.env.STAGING !== 'undefined' && (process.env.STAGING === true || process.env.STAGING === 'true') ? true : false,
  geoBlock: typeof process.env.GEOBLOCK === 'undefined' ? true : (process.env.GEOBLOCK === 'true' || process.env.GEOBLOCK === true),
  playerHost: typeof process.env.STAGING !== 'undefined' && (process.env.STAGING === true || process.env.STAGING === 'true') ? 'https://staging.player.dotstudiopro.com' : 'https://player.dotstudiopro.com',
  dev: {
    domain: 'http://localhost:3000'
  },
  live: {
    domain: environment.isProduction ? '//americanbeautystar.com' : '//dev.americanbeautystar.com'
  },
  googleAnalytics: 'UA-106753337-1',
  mailchimpAPIKey: 'bcf5c331b8bac637777f4fc6ab85c279-us16',
  api: {
    baseUrl: 'https://api.myspotlight.tv',
    timeout: 10000,
    dspApiKey: '464f9d1621f0799f4c4b7a2e884b21e4be81d222', // TODO: ignore the fact it says Nosey for now :)
    company_id: '592709ff97f81578165aa389', // ABS
    defaultCountryCode: 'US'
  },
  wpApi: {
    baseUrl: typeof process.env.STAGING !== 'undefined' && (process.env.STAGING === true || process.env.STAGING === 'true') ? 'dev.api.americanbeautystar.com' : 'api.americanbeautystar.com',
    timeout: 10000,
  },
  app: {
    title: 'American Beauty Star',
    description: 'American Beauty Star',
    head: {
      titleTemplate: '%s - American Beauty Star',
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // Disable tap highlight on IE
        { name: 'msapplication-tap-highlight', content: 'no' },
        // Add to homescreen for Chrome on Android
        { name: 'mobile-web-app-capable', content: 'yes' },
        // Add to homescreen for Safari on IOS
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-title', content: 'American Beauty Star' },
        // Tile icon for Win8 (144x144 + tile color)
        { name: 'msapplication-TileImage', content: 'mstile-150x150.png' },
        { name: 'msapplication-TileColor', content: '#FB0086' },
        { name: 'application-name', content: 'American Beauty Star' },
        { name: 'theme-color', content: '#FB0086' },

        // impact radius site verification
        { name: 'ir-site-verification-token', content: '-513822165' },

        // google site verification
        { name: 'google-site-verification', content: '_l8Ej2IbJGiZVvAcOhxipt9uC5Gr6FOfhcVTUNVsTuQ' },

        // Top level metadata
        { name: 'author', content: 'NBC' },
        { name: 'copyright', content: 'NBC' },
        {
          name: 'description',
          content: 'American Beauty Star - Hosted by Supermodel Adriana Lima on Lifetime TV.'
        },
        { name: 'keywords', content: 'ABS, tv, shows, online, watch' },

        // Links to mobile apps in play stores
        // { name: 'apple-itunes-app', content: 'app-id=1190636061' },
        // { name: 'google-play-app', content: 'app-id=com.dotstudioz.dotstudioPRO.nosey' },
        { property: 'fb:app_id', content: '254529085040669' },

        // Social-specific metadata below
        {
          property: "og:description",
          content: "American Beauty Star - Hosted by Supermodel Adriana Lima on Lifetime TV."
        },
        { property: "og:image", content: "https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/08154416/Webp.net-resizeimage.png" },
        { property: "og:site_name", content: "American Beauty Star" },
        { property: "og:title", content: "American Beauty Star" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://www.americanbeautystar.com" },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@AmBeautyStar' },
        {
          name: 'twitter:description',
          content: 'American Beauty Star'
        },
        { name: 'twitter:image:src', content: 'http://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/08154416/Webp.net-resizeimage.png' },
        { name: 'twitter:site', content: '@AmBeautyStar' },
        { name: 'twitter:title', content: 'American Beauty Star' },
        // End social metadata

      ],
      link: [
        // Add to homescreen for Chrome on Android
        { rel: 'icon', sizes: '32x32', href: 'favicon-32x32.png' },
        { rel: 'icon', sizes: '16x16', href: 'favicon-16x16.png' },
        { rel: 'icon', sizes: '192x192', href: 'chromeFavicon.png' },
        // Add to homescreen for Safari on IOS
        { rel: 'apple-touch-icon', sizes: '180x180', href: 'appleFavicon.png' },
        // Manifest
        { rel: 'manifest', href: '/manifest.json'},
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#FB0086'},
      ]
    },
    lockScreenShown: 'LOCK_SCREEN_SHOWN',
    logo: '//nosey.com/img/nosey-logo.png',
    links: {
      // android: 'https://play.google.com/store/apps/details?id=com.dotstudioz.dotstudioPRO.nosey&hl=en',
      // appleTv: 'https://itunes.apple.com/us/app/nosey-watch-full-tv-episodes-tv-shows/id1190636061?mt=8',
      // ios: 'https://itunes.apple.com/us/app/nosey-watch-full-tv-episodes-tv-shows/id1190636061?mt=8',
      // roku: 'https://channelstore.roku.com/details/143535/nosey'
    }
  },
}, environment);
