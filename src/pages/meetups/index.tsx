import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { navigateTo } from '@tarojs/taro'
import type { Meetup } from '../../types'
import { Calendar, MapPin, Users, Filter, Globe, Star, BookOpen } from 'lucide-react'
import './index.css'

export function Meetups() {
  const { t, i18n } = useTranslation()
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    loadMeetups()
  }, [filter])

  const loadMeetups = async () => {
    try {
      setLoading(true)
      const res = await meetupApi.list({ upcoming: true }).catch(() => ({ meetups: mockMeetups }))
      setMeetups(res.meetups || mockMeetups)
    } catch (error) {
      console.error('Failed to load meetups:', error)
      setMeetups(mockMeetups)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      weekday: date.toLocaleString('default', { weekday: 'short' })
    }
  }

  const handleRSVP = (meetupId: string) => {
    console.log('RSVP for:', meetupId)
  }

  const handleTabClick = (path: string) => {
    navigateTo({ url: path })
  }

  return (
    <View className="meetups-page">
      <View className="main-content">
        {/* Header */}
        <View className="header">
          <Text className="page-title">{t('meetups.title')}</Text>
          <View className="header-subtitle">
            <Calendar size={36} />
            <Text>Find and join meetups around the world</Text>
          </View>
        </View>

        {/* Filters */}
        <View className="filters-section">
          <ScrollView scrollX className="filter-scroll">
            <View className="filter-tags">
              <View
                className={`filter-tag ${filter === '' ? 'active' : ''}`}
                onClick={() => setFilter('')}
              >
                <Filter size={28} />
                <Text>All</Text>
              </View>
              <View
                className={`filter-tag ${filter === 'this-week' ? 'active' : ''}`}
                onClick={() => setFilter('this-week')}
              >
                This Week
              </View>
              <View
                className={`filter-tag ${filter === 'this-month' ? 'active' : ''}`}
                onClick={() => setFilter('this-month')}
              >
                This Month
              </View>
              <View
                className={`filter-tag ${filter === 'popular' ? 'active' : ''}`}
                onClick={() => setFilter('popular')}
              >
                Popular
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Meetup List */}
        <ScrollView scrollY className="meetup-list-section">
          <View className="meetup-list">
            {loading ? (
              <View className="loading">{t('common.loading')}</View>
            ) : meetups.length === 0 ? (
              <View className="empty">
                <Calendar size={64} />
                <Text className="empty-title">No meetups found</Text>
                <Text className="empty-subtitle">Check back soon for upcoming events</Text>
              </View>
            ) : (
              meetups.map((meetup) => {
                const dateInfo = formatDate(meetup.date)
                return (
                  <View key={meetup.id} className="meetup-card">
                    {/* Date Badge */}
                    <View className="date-badge">
                      <Text className="date-day">{dateInfo.day}</Text>
                      <Text className="date-month">{dateInfo.month}</Text>
                    </View>

                    {/* Content */}
                    <View className="meetup-content">
                      <Text className="meetup-title">{meetup.title}</Text>

                      <View className="meetup-meta">
                        <View className="meta-item">
                          <MapPin size={28} />
                          <Text>{meetup.cityName}</Text>
                        </View>
                        <View className="meta-item">
                          <Calendar size={28} />
                          <Text>{dateInfo.weekday} at {meetup.time}</Text>
                        </View>
                      </View>

                      <View className="meetup-location">
                        <Text className="location-text">{meetup.location}</Text>
                      </View>

                      {/* Attendees & RSVP */}
                      <View className="meetup-footer">
                        <View className="attendees">
                          <Users size={32} />
                          <Text className="attendees-count">
                            {meetup.currentAttendees}/{meetup.maxAttendees}
                          </Text>
                          <Text className="attendees-label">attending</Text>
                        </View>
                        <View
                          className={`rsvp-btn ${meetup.currentAttendees >= meetup.maxAttendees ? 'full' : ''}`}
                          onClick={() => handleRSVP(meetup.id)}
                        >
                          <Text>
                            {meetup.currentAttendees >= meetup.maxAttendees ? 'Full' : t('meetups.rsvp')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Tab Bar */}
      <View className="tabbar">
        <View className="tabbar-content">
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/index/index')}>
            <Globe size={40} />
            <Text>{t('nav.home')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/cities/index')}>
            <MapPin size={40} />
            <Text>{t('nav.cities')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/articles/index')}>
            <BookOpen size={40} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item active" onClick={() => handleTabClick('/pages/meetups/index')}>
            <Users size={40} />
            <Text>{t('nav.meetups')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/profile/index')}>
            <Star size={40} />
            <Text>{t('nav.profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// Mock data
const mockMeetups: Meetup[] = [
  {
    id: '1',
    title: 'Nomad Lunch Bangkok',
    cityId: '1',
    cityName: 'Bangkok',
    location: 'The Hive Thonglor, 159 Thonglor 8',
    date: '2026-07-05',
    time: '12:00',
    maxAttendees: 20,
    currentAttendees: 12,
    organizer: { name: 'John Smith', avatar: '' }
  },
  {
    id: '2',
    title: 'Coworking Session Lisbon',
    cityId: '2',
    cityName: 'Lisbon',
    location: 'Heden Coworking, R. do Poco dos Negros 19',
    date: '2026-07-08',
    time: '10:00',
    maxAttendees: 30,
    currentAttendees: 18,
    organizer: { name: 'Ana Costa', avatar: '' }
  },
  {
    id: '3',
    title: 'Beach Day Canggu',
    cityId: '3',
    cityName: 'Canggu',
    location: 'Finns Beach Club, Jl. Pantai Berawa',
    date: '2026-07-12',
    time: '14:00',
    maxAttendees: 50,
    currentAttendees: 35,
    organizer: { name: 'Made Suryani', avatar: '' }
  },
  {
    id: '4',
    title: 'Tech Talk Mexico City',
    cityId: '4',
    cityName: 'Mexico City',
    location: 'WeWork Reforma, Paseo de la Reforma 296',
    date: '2026-07-15',
    time: '18:00',
    maxAttendees: 100,
    currentAttendees: 67,
    organizer: { name: 'Carlos Rodriguez', avatar: '' }
  },
  {
    id: '5',
    title: 'Sunrise Yoga Da Nang',
    cityId: '5',
    cityName: 'Da Nang',
    location: 'My Khe Beach',
    date: '2026-07-20',
    time: '06:00',
    maxAttendees: 25,
    currentAttendees: 15,
    organizer: { name: 'Thu Nguyen', avatar: '' }
  }
]

export default Meetups
