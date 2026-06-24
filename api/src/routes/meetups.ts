import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Mock meetups data
const meetups = [
  {
    id: '1',
    title: 'Nomad Lunch Bangkok',
    description: 'Weekly nomad lunch meetup at a local Thai restaurant. Great opportunity to meet fellow digital nomads!',
    cityId: '1',
    cityName: 'Bangkok',
    location: 'The Hive Thonglor, 159 Thonglor 8, Bangkok',
    date: '2026-07-05',
    time: '12:00',
    maxAttendees: 20,
    currentAttendees: 12,
    organizer: { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=john' },
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
  },
  {
    id: '2',
    title: 'Coworking Session Lisbon',
    description: 'Work together in a beautiful coworking space. Networking and collaboration encouraged!',
    cityId: '2',
    cityName: 'Lisbon',
    location: 'Heden Coworking, R. do Poco dos Negros 19, Lisbon',
    date: '2026-07-08',
    time: '10:00',
    maxAttendees: 30,
    currentAttendees: 18,
    organizer: { name: 'Ana Costa', avatar: 'https://i.pravatar.cc/150?u=ana' },
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  },
  {
    id: '3',
    title: 'Beach Day Canggu',
    description: 'Relax and socialize at Finns Beach Club. Surf, swim, and meet other nomads!',
    cityId: '3',
    cityName: 'Canggu',
    location: 'Finns Beach Club, Jl. Pantai Berawa, Canggu',
    date: '2026-07-12',
    time: '14:00',
    maxAttendees: 50,
    currentAttendees: 35,
    organizer: { name: 'Made Suryani', avatar: 'https://i.pravatar.cc/150?u=made' },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
  },
  {
    id: '4',
    title: 'Tech Talk Mexico City',
    description: 'Monthly tech talk series featuring local and international speakers.',
    cityId: '4',
    cityName: 'Mexico City',
    location: 'WeWork Reforma, Paseo de la Reforma 296',
    date: '2026-07-15',
    time: '18:00',
    maxAttendees: 100,
    currentAttendees: 67,
    organizer: { name: 'Carlos Rodriguez', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800'
  },
  {
    id: '5',
    title: 'Sunrise Yoga Da Nang',
    description: 'Start your day with yoga on the beach. All levels welcome!',
    cityId: '5',
    cityName: 'Da Nang',
    location: 'My Khe Beach, Da Nang',
    date: '2026-07-20',
    time: '06:00',
    maxAttendees: 25,
    currentAttendees: 15,
    organizer: { name: 'Thu Nguyen', avatar: 'https://i.pravatar.cc/150?u=thu' },
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
  }
]

const querySchema = z.object({
  cityId: z.string().optional(),
  upcoming: z.string().transform(v => v === 'true').optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
})

// GET /api/meetups - List meetups
app.get('/', async (c) => {
  const query = querySchema.parse(c.req.query())

  let filteredMeetups = [...meetups]

  if (query.cityId) {
    filteredMeetups = filteredMeetups.filter(m => m.cityId === query.cityId)
  }

  if (query.upcoming) {
    const today = new Date()
    filteredMeetups = filteredMeetups.filter(m => new Date(m.date) >= today)
  }

  filteredMeetups.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return c.json({
    meetups: filteredMeetups.slice(0, query.limit),
    total: filteredMeetups.length
  })
})

// GET /api/meetups/upcoming - Get upcoming meetups
app.get('/upcoming', async (c) => {
  const limit = z.coerce.number().min(1).max(20).default(5).parse(c.req.query('limit') || '5')
  const today = new Date()
  const upcoming = meetups
    .filter(m => new Date(m.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
  return c.json(upcoming)
})

// GET /api/meetups/:id - Get meetup by ID
app.get('/:id', async (c) => {
  const meetup = meetups.find(m => m.id === c.req.param('id'))
  if (!meetup) {
    return c.json({ error: 'Meetup not found' }, 404)
  }
  return c.json(meetup)
})

export { app as meetupRoutes }
