import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { navigateTo } from '@tarojs/taro'
import { MapPin, Star, Heart, Settings, LogOut, Calendar, Award, Globe, ChevronRight, User, BookOpen, Users } from 'lucide-react'
import './index.css'

interface User {
  id: string
  name: string
  avatar: string
  bio: string
  country: string
  checkins: Array<{ cityId: string; cityName: string; date: string }>
  reviews: number
  reviewList: Array<{ cityId: string; cityName: string; rating: number; comment: string; date: string }>
  favorites: string[]
  joinedAt: string
}

export function Profile() {
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'checkins' | 'reviews' | 'favorites'>('checkins')

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        // Mock user for demo
        setUser({
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
          reviewList: [
            { cityId: '1', cityName: 'Bangkok', rating: 5, comment: 'Amazing city for digital nomads!', date: '2024-06-20' },
            { cityId: '3', cityName: 'Canggu', rating: 4, comment: 'Great surf and coworking spaces.', date: '2024-05-25' },
            { cityId: '2', cityName: 'Lisbon', rating: 5, comment: 'Love the food and culture.', date: '2024-04-15' },
            { cityId: '4', cityName: 'Mexico City', rating: 4, comment: 'Vibrant city with great food scene.', date: '2024-03-10' },
            { cityId: '5', cityName: 'Da Nang', rating: 5, comment: 'Beautiful beaches and affordable living.', date: '2024-02-05' },
          ],
          favorites: ['1', '2', '3', '9'],
          joinedAt: '2023-01-15'
        })
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    navigateTo({ url: '/pages/login/index' })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  if (loading) {
    return (
      <View className="profile-page">
        <View className="loading">{t('common.loading')}</View>
      </View>
    )
  }

  if (!user) {
    return (
      <View className="profile-page">
        <View className="main-content">
          <View className="not-logged-in">
            <User className="avatar-placeholder" size={80} />
            <Text className="welcome-text">Welcome to DNH001</Text>
            <Text className="welcome-subtext">Join our global community of digital nomads</Text>
            <View className="login-btn" onClick={handleLogin}>
              <Text>Sign In / Register</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="profile-page">
      <View className="main-content">
        {/* Header */}
        <View className="profile-header">
          <View className="header-top">
            <Text className="page-title">{t('profile.title')}</Text>
            <View className="header-actions">
              <View className="action-btn" onClick={handleLanguageToggle}>
                <Globe size={32} />
              </View>
              <View className="action-btn" onClick={handleLogout}>
                <LogOut size={32} />
              </View>
            </View>
          </View>

          {/* User Info */}
          <View className="user-info">
            <Image
              className="user-avatar"
              src={user.avatar}
              mode="aspectFill"
            />
            <View className="user-details">
              <Text className="user-name">{user.name}</Text>
              {user.country && (
                <View className="user-location">
                  <MapPin size={28} />
                  <Text>{user.country}</Text>
                </View>
              )}
              {user.bio && (
                <Text className="user-bio">{user.bio}</Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View className="stats-row">
            <View className="stat-item" onClick={() => setActiveTab('checkins')}>
              <Text className="stat-value">{user.checkins.length}</Text>
              <Text className="stat-label">Check-ins</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item" onClick={() => setActiveTab('reviews')}>
              <Text className="stat-value">{user.reviews}</Text>
              <Text className="stat-label">Reviews</Text>
            </View>
            <View className="stat-divider" />
            <View className="stat-item" onClick={() => setActiveTab('favorites')}>
              <Text className="stat-value">{user.favorites.length}</Text>
              <Text className="stat-label">Favorites</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView scrollY className="profile-content">
          {/* Tabs */}
          <View className="content-tabs">
            <View
              className={`content-tab ${activeTab === 'checkins' ? 'active' : ''}`}
              onClick={() => setActiveTab('checkins')}
            >
              <MapPin size={32} />
              <Text>Check-ins</Text>
            </View>
            <View
              className={`content-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <Star size={32} />
              <Text>Reviews</Text>
            </View>
            <View
              className={`content-tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <Heart size={32} />
              <Text>Favorites</Text>
            </View>
          </View>

          {/* Check-ins List */}
          {activeTab === 'checkins' && (
            <View className="checkins-list">
              {user.checkins.length === 0 ? (
                <View className="empty-state">
                  <MapPin size={64} />
                  <Text className="empty-title">No check-ins yet</Text>
                  <Text className="empty-subtitle">Start exploring cities and check in to track your journey</Text>
                </View>
              ) : (
                user.checkins.map((checkin, index) => (
                  <View key={index} className="checkin-item">
                    <View className="checkin-icon">
                      <MapPin size={36} />
                    </View>
                    <View className="checkin-info">
                      <Text className="checkin-city">{checkin.cityName}</Text>
                      <Text className="checkin-date">
                        <Calendar size={28} />
                        {checkin.date}
                      </Text>
                    </View>
                    <ChevronRight size={32} className="checkin-arrow" />
                  </View>
                ))
              )}
            </View>
          )}

          {/* Reviews List */}
          {activeTab === 'reviews' && (
            <View className="reviews-list">
              {user.reviewList.length === 0 ? (
                <View className="empty-state">
                  <Star size={64} />
                  <Text className="empty-title">No reviews yet</Text>
                  <Text className="empty-subtitle">Share your experiences by reviewing cities you've visited</Text>
                </View>
              ) : (
                user.reviewList.map((review, index) => (
                  <View key={index} className="review-item">
                    <View className="review-header">
                      <View className="review-city">
                        <MapPin size={32} />
                        <Text className="review-city-name">{review.cityName}</Text>
                      </View>
                      <View className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            fill={star <= review.rating ? '#fbbf24' : 'none'}
                            color={star <= review.rating ? '#fbbf24' : '#cbd5e1'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="review-comment">{review.comment}</Text>
                    <Text className="review-date">
                      <Calendar size={24} />
                      {review.date}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Favorites List */}
          {activeTab === 'favorites' && (
            <View className="favorites-list">
              {user.favorites.length === 0 ? (
                <View className="empty-state">
                  <Heart size={64} />
                  <Text className="empty-title">No favorites yet</Text>
                  <Text className="empty-subtitle">Save your favorite cities to visit later</Text>
                </View>
              ) : (
                <View className="favorites-grid">
                  {user.favorites.map((cityId) => (
                    <View key={cityId} className="favorite-card">
                      <Image
                        className="favorite-image"
                        src={`https://picsum.photos/seed/${cityId}/200/150`}
                        mode="aspectFill"
                      />
                      <View className="favorite-overlay">
                        <Text className="favorite-city">City #{cityId}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View className="bottom-spacer" />
        </ScrollView>
      </View>

      {/* Bottom Tab Bar */}
      <View className="tabbar">
        <View className="tabbar-content">
          <View className="tabbar-item" onClick={() => navigateTo({ url: '/pages/index/index' })}>
            <Globe size={40} />
            <Text>{t('nav.home')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => navigateTo({ url: '/pages/cities/index' })}>
            <MapPin size={40} />
            <Text>{t('nav.cities')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => navigateTo({ url: '/pages/articles/index' })}>
            <BookOpen size={40} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => navigateTo({ url: '/pages/meetups/index' })}>
            <Users size={40} />
            <Text>{t('nav.meetups')}</Text>
          </View>
          <View className="tabbar-item active" onClick={() => navigateTo({ url: '/pages/profile/index' })}>
            <Award size={40} />
            <Text>{t('nav.profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Profile
