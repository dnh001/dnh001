import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Simple in-memory store for demo (use D1 in production)
const users = new Map()
const sessions = new Map()

// Mock user data
const mockUsers = [
  {
    id: 'u1',
    name: 'John Nomad',
    email: 'john@example.com',
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
]

// Initialize with mock data
mockUsers.forEach(u => users.set(u.id, u))

// Auth schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  avatar: z.string().url().optional()
})

// Helper: generate session token
const generateToken = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Helper: get user from header
const getUserFromHeader = (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  return sessions.get(token)
}

// POST /api/auth/register - Register new user
app.post('/register', async (c) => {
  const body = await c.req.json()
  const data = registerSchema.parse(body)

  // Check if email exists
  const existingUser = Array.from(users.values()).find(u => u.email === data.email)
  if (existingUser) {
    return c.json({ error: 'Email already registered' }, 400)
  }

  const newUser = {
    id: `u${Date.now()}`,
    name: data.name,
    email: data.email,
    avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    bio: '',
    country: '',
    checkins: [],
    reviews: 0,
    favorites: [],
    joinedAt: new Date().toISOString().split('T')[0]
  }

  users.set(newUser.id, newUser)

  // Create session
  const token = generateToken()
  sessions.set(token, newUser.id)

  return c.json({ user: newUser, token }, 201)
})

// POST /api/auth/login - Login user
app.post('/login', async (c) => {
  const body = await c.req.json()
  const data = loginSchema.parse(body)

  const user = Array.from(users.values()).find(u => u.email === data.email)
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // In production, verify password hash
  // For demo, skip password check

  const token = generateToken()
  sessions.set(token, user.id)

  return c.json({ user, token })
})

// POST /api/auth/logout - Logout user
app.post('/logout', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    sessions.delete(token)
  }
  return c.json({ success: true })
})

// GET /api/auth/me - Get current user
app.get('/me', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const user = users.get(userId)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(user)
})

// GET /api/auth/profile - Get user profile (public)
app.get('/profile/:id', async (c) => {
  const user = users.get(c.req.param('id'))
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  // Return public profile
  const { email, ...publicProfile } = user
  return c.json(publicProfile)
})

// PUT /api/auth/profile - Update current user profile
app.put('/profile', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json()
  const data = updateProfileSchema.parse(body)

  const user = users.get(userId)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const updatedUser = { ...user, ...data }
  users.set(userId, updatedUser)

  return c.json(updatedUser)
})

// GET /api/auth/checkins - Get user check-ins
app.get('/checkins', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const user = users.get(userId)
  return c.json(user?.checkins || [])
})

// POST /api/auth/checkins - Add check-in
app.post('/checkins', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const { cityId, cityName } = await c.req.json()

  const user = users.get(userId)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  const checkin = {
    cityId,
    cityName,
    date: new Date().toISOString().split('T')[0]
  }

  user.checkins = [checkin, ...user.checkins]
  users.set(userId, user)

  return c.json(checkin, 201)
})

// GET /api/auth/favorites - Get user favorites
app.get('/favorites', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const user = users.get(userId)
  return c.json(user?.favorites || [])
})

// POST /api/auth/favorites - Add to favorites
app.post('/favorites', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const { cityId } = await c.req.json()

  const user = users.get(userId)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  if (!user.favorites.includes(cityId)) {
    user.favorites.push(cityId)
    users.set(userId, user)
  }

  return c.json({ success: true })
})

// DELETE /api/auth/favorites/:cityId - Remove from favorites
app.delete('/favorites/:cityId', async (c) => {
  const userId = getUserFromHeader(c)
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const cityId = c.req.param('cityId')

  const user = users.get(userId)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  user.favorites = user.favorites.filter(id => id !== cityId)
  users.set(userId, user)

  return c.json({ success: true })
})

export { app as authRoutes }
