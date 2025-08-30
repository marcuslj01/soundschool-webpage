import { MetadataRoute } from 'next'
import { getAllMidis } from '@/lib/firestore/midifiles'
import { getPacks } from '@/lib/firestore/pack'
import { getFLPs } from '@/lib/firestore/flp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://soundschoolmidis.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/midi`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/flps`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic product pages
  const midiFiles = await getAllMidis()
  const packs = await getPacks()
  const flps = await getFLPs()

  const midiPages = midiFiles.map((midi) => ({
    url: `${baseUrl}/midi?id=${midi.id}`,
    lastModified: midi.created_at ? new Date(midi.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const packPages = packs.map((pack) => ({
    url: `${baseUrl}/pack?id=${pack.id}`,
    lastModified: pack.created_at ? new Date(pack.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const flpPages = flps.map((flp) => ({
    url: `${baseUrl}/flp?id=${flp.id}`,
    lastModified: flp.created_at ? new Date(flp.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...midiPages, ...packPages, ...flpPages]
}
