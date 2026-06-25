import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter, navigateTo } from '@tarojs/taro'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Globe, MapPin, Clock, Users, Calendar, Star, Heart, BookOpen } from 'lucide-react'
import './index.css'

export function MeetupDetail() {
  const { t } = useTranslation()
  const router = useRouter()
  const [meetup, setMeetup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rsvpStatus, setRsvpStatus] = useState<'not-rsvp' | 'rsvp' | 'full'>('not-rsvp')

  useEffect(() => {
    const meetupId = router.params?.id || '1'
    loadMeetup(meetupId)
  }, [])

  const loadMeetup = async (meetupId: string) => {
    try {
      setLoading(true)
      const foundMeetup = mockMeetups.find(m => m.id === meetupId)
      setMeetup(foundMeetup || mockMeetups[0])
      setRsvpStatus(foundMeetup?.currentAttendees >= foundMeetup?.maxAttendees ? 'full' : 'not-rsvp')
    } catch (error) {
      console.error('Failed to load meetup:', error)
      setMeetup(mockMeetups[0])
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigateTo({ url: '/pages/meetups/index' })
  }

  const handleRSVP = () => {
    if (rsvpStatus === 'full') return
    if (rsvpStatus === 'not-rsvp') {
      setRsvpStatus('rsvp')
      Taro.showToast({ title: t('meetups.rsvpSuccess'), icon: 'success' })
    } else {
      setRsvpStatus('not-rsvp')
      Taro.showToast({ title: t('meetups.cancelRsvp'), icon: 'none' })
    }
  }

  const handleTabClick = (path: string) => {
    navigateTo({ url: path })
  }

  if (loading) {
    return (
      <View className="meetup-detail-page">
        <View className="loading">{t('common.loading')}</View>
      </View>
    )
  }

  return (
    <View className="meetup-detail-page">
      <View className="main-content">
        <View className="header">
          <View className="header-content">
            <View className="back-btn" onClick={handleBack}>
              <ArrowLeft size={40} />
            </View>
            <View className="header-badge">
              <Calendar size={28} />
              <Text>{t('meetups.title')}</Text>
            </View>
          </View>
        </View>

        <ScrollView scrollY className="content-area">
          <View className="hero-section">
            <Image
              className="hero-image"
              src={`https://picsum.photos/seed/${meetup.id}/1200/600`}
              mode="aspectFill"
            />
            <View className="hero-overlay">
              <Text className="meetup-title">{meetup.title}</Text>
            </View>
          </View>

          <View className="info-section">
            <View className="date-card">
              <Text className="date-day">{new Date(meetup.date).getDate()}</Text>
              <Text className="date-month">{new Date(meetup.date).toLocaleString('default', { month: 'short' })}</Text>
            </View>

            <View className="basic-info">
              <View className="info-item">
                <MapPin size={36} />
                <View className="info-content">
                  <Text className="info-label">{t('meetups.location')}</Text>
                  <Text className="info-value">{meetup.cityName}</Text>
                </View>
              </View>

              <View className="info-item">
                <Clock size={36} />
                <View className="info-content">
                  <Text className="info-label">{t('meetups.time')}</Text>
                  <Text className="info-value">{new Date(meetup.date).toLocaleDateString()} at {meetup.time}</Text>
                </View>
              </View>

              <View className="info-item">
                <Users size={36} />
                <View className="info-content">
                  <Text className="info-label">{t('meetups.attendees')}</Text>
                  <Text className="info-value">{meetup.currentAttendees}/{meetup.maxAttendees} attending</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="description-section">
            <Text className="section-title">{t('meetups.about')}</Text>
            <Text className="description-text">
              Join other digital nomads for an amazing experience at {meetup.title}. This event is a great opportunity to network, share experiences, and make new friends.
            </Text>
            <Text className="description-text">
              {meetup.location} is a perfect venue for this gathering, offering a comfortable and inspiring environment for remote workers.
            </Text>
          </View>

          <View className="organizer-section">
            <Text className="section-title">{t('meetups.organizer')}</Text>
            <View className="organizer-card">
              <Image
                className="organizer-avatar"
                src={meetup.organizer.avatar || `https://i.pravatar.cc/150?u=${meetup.organizer.name}`}
                mode="aspectFill"
              />
              <View className="organizer-info">
                <Text className="organizer-name">{meetup.organizer.name}</Text>
                <Text className="organizer-title">Event Organizer</Text>
              </View>
            </View>
          </View>

          <View className="action-section">
            <View
              className={`rsvp-btn ${rsvpStatus === 'full' ? 'full' : ''} ${rsvpStatus === 'rsvp' ? 'rsvped' : ''}`}
              onClick={handleRSVP}
            >
              <Text>
                {rsvpStatus === 'full' ? t('meetups.full') : rsvpStatus === 'rsvp' ? t('meetups.cancel') : t('meetups.rsvp')}
              </Text>
            </View>
          </View>

          <View className="bottom-spacer" />
        </ScrollView>
      </View>

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

const mockMeetups = [
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
  }
]

export default MeetupDetail