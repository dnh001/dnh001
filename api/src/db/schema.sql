-- Cloudflare D1 Database Schema
-- Digital Nomad Hub (dnh001.com)

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  continent TEXT NOT NULL,
  nomad_score REAL DEFAULT 0,
  cost_index INTEGER DEFAULT 0,
  internet_speed INTEGER DEFAULT 0,
  weather_temp INTEGER DEFAULT 0,
  weather_humidity INTEGER DEFAULT 0,
  weather_description TEXT,
  safety_score REAL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  checkins_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  tags TEXT, -- JSON array
  coordinates_lat REAL,
  coordinates_lng REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  cover_image TEXT,
  category TEXT NOT NULL,
  city_id TEXT,
  author_id TEXT NOT NULL,
  content TEXT,
  read_time INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published',
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (city_id) REFERENCES cities(id),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Meetups table
CREATE TABLE IF NOT EXISTS meetups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  city_id TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  max_attendees INTEGER DEFAULT 20,
  current_attendees INTEGER DEFAULT 0,
  organizer_id TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (city_id) REFERENCES cities(id),
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Meetup attendees
CREATE TABLE IF NOT EXISTS meetup_attendees (
  id TEXT PRIMARY KEY,
  meetup_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (meetup_id) REFERENCES meetups(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating REAL NOT NULL,
  title TEXT,
  content TEXT,
  pros TEXT, -- JSON array
  cons TEXT, -- JSON array
  visited_at TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (city_id) REFERENCES cities(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  country TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- User check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  checked_in_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- User favorites
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Community posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  city_id TEXT,
  content TEXT NOT NULL,
  images TEXT, -- JSON array
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_nomad_score ON cities(nomad_score DESC);
CREATE INDEX IF NOT EXISTS idx_articles_city_id ON articles(city_id);
CREATE INDEX IF NOT EXISTS idx_reviews_city_id ON reviews(city_id);
CREATE INDEX IF NOT EXISTS idx_meetups_city_id ON meetups(city_id);
CREATE INDEX IF NOT EXISTS idx_meetups_date ON meetups(date);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
