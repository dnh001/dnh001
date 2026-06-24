import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Mock articles data
const articles = [
  {
    id: '1',
    title: 'Complete Guide to Thailand Digital Nomad Visa 2024',
    slug: 'thailand-visa-guide',
    summary: 'Everything you need to know about Thailand\'s new LTR visa for remote workers, including eligibility, application process, and required documents.',
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    category: 'Visa',
    cityId: '1',
    cityName: 'Thailand',
    author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    publishedAt: '2024-06-15',
    readTime: 8,
    content: ''
  },
  {
    id: '2',
    title: 'Best Coworking Spaces in Lisbon',
    slug: 'lisbon-coworking',
    summary: 'A curated list of the best coworking spaces in Lisbon for digital nomads, from budget options to premium workspaces.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    category: 'Work',
    cityId: '2',
    cityName: 'Lisbon',
    author: { name: 'Marco Silva', avatar: 'https://i.pravatar.cc/150?u=marco' },
    publishedAt: '2024-06-10',
    readTime: 5,
    content: ''
  },
  {
    id: '3',
    title: 'How to Open a Bank Account as a Nomad',
    slug: 'nomad-bank-account',
    summary: 'Step-by-step guide to opening bank accounts abroad without residency, covering Wise, Revolut, and local bank options.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    category: 'Finance',
    author: { name: 'Emma Watson', avatar: 'https://i.pravatar.cc/150?u=emma' },
    publishedAt: '2024-06-08',
    readTime: 10,
    content: ''
  },
  {
    id: '4',
    title: 'Da Nang: The Rising Star of Southeast Asia',
    slug: 'da-nang-guide',
    summary: 'Why Da Nang should be your next destination. From beaches to mountains, here\'s everything you need to know.',
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    category: 'Destination',
    cityId: '5',
    cityName: 'Da Nang',
    author: { name: 'Minh Tran', avatar: 'https://i.pravatar.cc/150?u=minh' },
    publishedAt: '2024-06-05',
    readTime: 7,
    content: ''
  },
  {
    id: '5',
    title: 'Taxes for Digital Nomads: A Complete Guide',
    slug: 'nomad-taxes',
    summary: 'Understanding tax obligations as a digital nomad. Learn about tax residence, double taxation treaties, and popular tax-friendly countries.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    category: 'Finance',
    author: { name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?u=alex' },
    publishedAt: '2024-06-01',
    readTime: 12,
    content: ''
  },
  {
    id: '6',
    title: 'Canggu Living: A Month-by-Month Guide',
    slug: 'canggu-living',
    summary: 'What to expect living in Canggu Bali, from accommodation costs to visa runs and everything in between.',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    category: 'Lifestyle',
    cityId: '3',
    cityName: 'Canggu',
    author: { name: 'Made Suryani', avatar: 'https://i.pravatar.cc/150?u=made' },
    publishedAt: '2024-05-28',
    readTime: 9,
    content: ''
  }
]

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  category: z.string().optional(),
  cityId: z.string().optional(),
})

// GET /api/articles - List all articles
app.get('/', async (c) => {
  const query = querySchema.parse(c.req.query())

  let filteredArticles = [...articles]

  if (query.category) {
    filteredArticles = filteredArticles.filter(a => a.category === query.category)
  }

  if (query.cityId) {
    filteredArticles = filteredArticles.filter(a => a.cityId === query.cityId)
  }

  const total = filteredArticles.length
  const start = (query.page - 1) * query.limit
  const paginatedArticles = filteredArticles.slice(start, start + query.limit)

  return c.json({
    articles: paginatedArticles,
    total,
    page: query.page,
    limit: query.limit
  })
})

// GET /api/articles/latest - Get latest articles
app.get('/latest', async (c) => {
  const limit = z.coerce.number().min(1).max(20).default(6).parse(c.req.query('limit') || '6')
  const latest = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
  return c.json(latest)
})

// GET /api/articles/:id - Get article by ID
app.get('/:id', async (c) => {
  const article = articles.find(a => a.id === c.req.param('id'))
  if (!article) {
    return c.json({ error: 'Article not found' }, 404)
  }
  return c.json(article)
})

export { app as articleRoutes }
