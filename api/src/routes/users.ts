import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Mock user data
const mockUser = {
  id: 'u1',
  name: 'John Nomad',
  avatar: 'https://i.pravatar.cc/150?u=john',
  bio: 'Digital nomad since 2020. Currently exploring Southeast Asia.',
  country: 'United States',
  checkins: [
    { cityId: '1', cityName: 'Bangkok', date: '2024-06-15' },
    { cityId: '3', cityName: 'Canggu', date: '2024-05-20' },
    { cityId: '2', cityName: 'Lisbon', date: '2024-04-10' },
  ],
  reviews: 5,
  favorites: ['1', '2', '3', '9'],
  joinedAt: '2023-01-15'
}

// GET /api/user/profile - Get user profile
app.get('/profile', async (c) => {
  return c.json(mockUser)
})

// PUT /api/user/profile - Update user profile
app.put('/profile', async (c) => {
  const body = await c.req.json()
  Object.assign(mockUser, body)
  return c.json(mockUser)
})

// GET /api/user/checkins - Get user check-ins
app.get('/checkins', async (c) => {
  return c.json(mockUser.checkins)
})

// GET /api/user/favorites - Get user favorites
app.get('/favorites', async (c) => {
  return c.json(mockUser.favorites)
})

// POST /api/user/favorites - Add to favorites
app.post('/favorites', async (c) => {
  const { cityId } = await c.req.json()
  if (!mockUser.favorites.includes(cityId)) {
    mockUser.favorites.push(cityId)
  }
  return c.json({ success: true })
})

// DELETE /api/user/favorites/:cityId - Remove from favorites
app.delete('/favorites/:cityId', async (c) => {
  const cityId = c.req.param('cityId')
  mockUser.favorites = mockUser.favorites.filter(id => id !== cityId)
  return c.json({ success: true })
})

export { app as userRoutes }
