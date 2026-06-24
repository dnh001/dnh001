import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { cityRoutes } from './routes/cities'
import { articleRoutes } from './routes/articles'
import { meetupRoutes } from './routes/meetups'
import { reviewRoutes } from './routes/reviews'
import { userRoutes } from './routes/users'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// API Routes
app.route('/api/cities', cityRoutes)
app.route('/api/articles', articleRoutes)
app.route('/api/meetups', meetupRoutes)
app.route('/api/reviews', reviewRoutes)
app.route('/api/user', userRoutes)
app.route('/api/auth', authRoutes)

// Error handling
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: err.message || 'Internal Server Error' }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

export default app
