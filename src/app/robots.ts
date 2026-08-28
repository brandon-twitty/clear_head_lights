import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dealer/'], // Prevent Google from indexing internal dashboards
    },
    sitemap: 'https://stlclearheadlights.com/sitemap.xml',
  }
}
