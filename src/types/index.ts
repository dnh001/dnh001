export interface City {
  id: string
  name: string
  slug: string
  country: string
  countryCode: string
  continent: string
  nomadScore: number
  costIndex: number
  internetSpeed: number
  weather: {
    temp: number
    humidity: number
    description: string
  }
  safety: number
  description: string
  imageUrl: string
  checkins: number
  reviews: number
  tags: string[]
}

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  coverImage: string
  category: string
  cityId?: string
  cityName?: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
}

export interface Meetup {
  id: string
  title: string
  cityId: string
  cityName: string
  location: string
  date: string
  time: string
  maxAttendees: number
  currentAttendees: number
  organizer: {
    name: string
    avatar: string
  }
  imageUrl?: string
}

export interface Review {
  id: string
  cityId: string
  author: {
    name: string
    avatar: string
  }
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  visitedAt: string
  createdAt: string
  likes: number
}

export interface User {
  id: string
  name: string
  avatar: string
  bio?: string
  country?: string
  checkins: number
  reviews: number
  favorites: string[]
  joinedAt: string
}
