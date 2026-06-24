import { Hono } from 'hono'
import { z } from 'zod'
import { cities, getCityById, getCityBySlug, getTrendingCities, getTopRatedCities } from '../data/cities'

const app = new Hono()

// Query schema for validation
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['score', 'cost', 'wifi', 'checkins']).default('score'),
  filter: z.string().optional(),
  search: z.string().optional(),
})

// GET /api/cities - List all cities
app.get('/', async (c) => {
  const query = querySchema.parse(c.req.query())

  let filteredCities = [...cities]

  // Apply search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase()
    filteredCities = filteredCities.filter(city =>
      city.name.toLowerCase().includes(searchLower) ||
      city.country.toLowerCase().includes(searchLower)
    )
  }

  // Apply tag filter
  if (query.filter) {
    filteredCities = filteredCities.filter(city =>
      city.tags.includes(query.filter!)
    )
  }

  // Apply sorting
  switch (query.sort) {
    case 'score':
      filteredCities.sort((a, b) => b.nomadScore - a.nomadScore)
      break
    case 'cost':
      filteredCities.sort((a, b) => a.costIndex - b.costIndex)
      break
    case 'wifi':
      filteredCities.sort((a, b) => b.internetSpeed - a.internetSpeed)
      break
    case 'checkins':
      filteredCities.sort((a, b) => b.checkins - a.checkins)
      break
  }

  // Pagination
  const total = filteredCities.length
  const start = (query.page - 1) * query.limit
  const paginatedCities = filteredCities.slice(start, start + query.limit)

  return c.json({
    cities: paginatedCities,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit)
  })
})

// GET /api/cities/trending - Get trending cities
app.get('/trending', async (c) => {
  const limit = z.coerce.number().min(1).max(20).default(5).parse(c.req.query('limit') || '5')
  const trending = getTrendingCities(limit)
  return c.json({ cities: trending })
})

// GET /api/cities/top-rated - Get top rated cities
app.get('/top-rated', async (c) => {
  const limit = z.coerce.number().min(1).max(20).default(5).parse(c.req.query('limit') || '5')
  const topRated = getTopRatedCities(limit)
  return c.json({ cities: topRated })
})

// GET /api/cities/:id - Get city by ID
app.get('/:id', async (c) => {
  const city = getCityById(c.req.param('id'))
  if (!city) {
    return c.json({ error: 'City not found' }, 404)
  }
  return c.json(city)
})

// GET /api/cities/slug/:slug - Get city by slug
app.get('/slug/:slug', async (c) => {
  const city = getCityBySlug(c.req.param('slug'))
  if (!city) {
    return c.json({ error: 'City not found' }, 404)
  }
  return c.json(city)
})

export { app as cityRoutes }
