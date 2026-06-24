import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Mock reviews data
const reviews: Record<string, any[]> = {
  '1': [
    {
      id: 'r1',
      cityId: '1',
      author: { name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=mike' },
      rating: 4.5,
      title: 'Great for digital nomads',
      content: 'Bangkok has everything a digital nomad needs. Great cafes with fast WiFi, affordable food, and an amazing nightlife. The BTS and MRT make getting around easy.',
      pros: ['Affordable', 'Great food', 'Good infrastructure', 'Vibrant nightlife'],
      cons: ['Air quality issues', 'Traffic can be bad', 'Hot weather'],
      visitedAt: '2024-05',
      createdAt: '2024-06-01',
      likes: 45
    },
    {
      id: 'r2',
      cityId: '1',
      author: { name: 'Lisa Wang', avatar: 'https://i.pravatar.cc/150?u=lisa' },
      rating: 4.0,
      title: 'Love the food and culture',
      content: 'The food here is incredible and so cheap! I was able to live comfortably on $1000/month. The temple hopping was a highlight of my trip.',
      pros: ['Amazing food', 'Cheap living', 'Beautiful temples', 'Good massage'],
      cons: ['Language barrier', 'Scammy taxi drivers', 'Pollution'],
      visitedAt: '2024-04',
      createdAt: '2024-05-15',
      likes: 32
    }
  ],
  '2': [
    {
      id: 'r3',
      cityId: '2',
      author: { name: 'Thomas Mueller', avatar: 'https://i.pravatar.cc/150?u=thomas' },
      rating: 5.0,
      title: 'Best city in Europe for nomads',
      content: 'Lisbon ticks all the boxes. Safe, beautiful, great weather, affordable by European standards, and the Portuguese people are incredibly welcoming. The nomad community is thriving here.',
      pros: ['Safe', 'Great weather', 'Beautiful architecture', 'Good WiFi everywhere', 'Welcoming locals'],
      cons: ['Getting more expensive', 'Housing shortage', 'Some bureaucracy'],
      visitedAt: '2024-06',
      createdAt: '2024-06-10',
      likes: 78
    }
  ]
}

// Query schema
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
})

// GET /api/reviews/:cityId - Get reviews for a city
app.get('/:cityId', async (c) => {
  const cityId = c.req.param('cityId')
  const query = querySchema.parse(c.req.query())

  const cityReviews = reviews[cityId] || []
  const total = cityReviews.length
  const start = (query.page - 1) * query.limit
  const paginatedReviews = cityReviews.slice(start, start + query.limit)

  return c.json({
    reviews: paginatedReviews,
    total,
    page: query.page,
    limit: query.limit
  })
})

// POST /api/reviews/:cityId - Create a review
app.post('/:cityId', async (c) => {
  const cityId = c.req.param('cityId')
  const body = await c.req.json()

  const newReview = {
    id: `r${Date.now()}`,
    cityId,
    author: { name: 'Anonymous', avatar: 'https://i.pravatar.cc/150?u=anon' },
    rating: body.rating,
    title: body.title,
    content: body.content,
    pros: body.pros || [],
    cons: body.cons || [],
    visitedAt: body.visitedAt,
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0
  }

  if (!reviews[cityId]) {
    reviews[cityId] = []
  }
  reviews[cityId].unshift(newReview)

  return c.json(newReview, 201)
})

export { app as reviewRoutes }
