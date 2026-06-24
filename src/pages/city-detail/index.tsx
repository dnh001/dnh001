import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useRouter } from '@tarojs/taro'
import { cityApi, reviewApi } from '../../api'
import type { City, Review } from '../../types'
import { Star, MapPin, Wifi, DollarSign, Thermometer, Shield, Users, ThumbsUp, ArrowLeft } from 'lucide-react'
import './index.css'

export function CityDetail() {
  const { t } = useTranslation()
  const { params } = useRouter()
  const [city, setCity] = useState<City | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'photos'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadCity(params.id)
    }
  }, [params.id])

  const loadCity = async (id: string) => {
    try {
      setLoading(true)
      const [cityData, reviewsData] = await Promise.all([
        cityApi.getById(id).catch(() => null),
        reviewApi.list(id, { limit: 5 }).catch(() => ({ reviews: [] }))
      ])

      if (cityData) {
        setCity(cityData)
      } else {
        // Use mock data for demo
        setCity({
          id,
          name: 'Bangkok',
          slug: 'bangkok',
          country: 'Thailand',
          countryCode: 'TH',
          continent: 'Asia',
          nomadScore: 4.5,
          costIndex: 1200,
          internetSpeed: 50,
          weather: { temp: 30, humidity: 70, description: 'Hot' },
          safety: 3.5,
          description: 'Bangkok is a vibrant metropolis known for its affordable cost of living, excellent food, and thriving digital nomad community.',
          imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
          checkins: 12500,
          reviews: 890,
          tags: ['food', 'nightlife', 'affordable', 'community']
        })
      }

      setReviews(reviewsData.reviews || [])
    } catch (error) {
      console.error('Failed to load city:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  if (loading || !city) {
    return (
      <View className="city-detail-page">
        <View className="loading">{t('common.loading')}</View>
      </View>
    )
  }

  return (
    <View className="city-detail-page">
      {/* Hero Image */}
      <View className="hero-section">
        <Image
          className="hero-image"
          src={city.imageUrl || `https://picsum.photos/seed/${city.id}/800/400`}
          mode="aspectFill"
        />
        <View className="hero-overlay">
          <View className="back-btn" onClick={handleBack}>
            <ArrowLeft size={24} />
          </View>
          <View className="hero-content">
            <Text className="city-name">{city.name}</Text>
            <View className="city-location">
              <MapPin size={16} />
              <Text>{city.country}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Score Badge */}
      <View className="score-badge">
        <View className="score-main">
          <Star className="score-star" size={24} />
          <Text className="score-value">{city.nomadScore.toFixed(1)}</Text>
          <Text className="score-max">/5</Text>
        </View>
        <Text className="score-label">{t('city.score')}</Text>
      </View>

      {/* Stats Grid */}
      <View className="stats-grid">
        <View className="stat-card">
          <DollarSign className="stat-icon cost" size={20} />
          <Text className="stat-value">${city.costIndex}</Text>
          <Text className="stat-label">{t('city.cost')}</Text>
          <Text className="stat-unit">{t('city.permonth')}</Text>
        </View>
        <View className="stat-card">
          <Wifi className="stat-icon wifi" size={20} />
          <Text className="stat-value">{city.internetSpeed}</Text>
          <Text className="stat-label">{t('city.wifi')}</Text>
          <Text className="stat-unit">Mbps</Text>
        </View>
        <View className="stat-card">
          <Thermometer className="stat-icon weather" size={20} />
          <Text className="stat-value">{city.weather.temp}°C</Text>
          <Text className="stat-label">{t('city.weather')}</Text>
          <Text className="stat-unit">{city.weather.description}</Text>
        </View>
        <View className="stat-card">
          <Shield className="stat-icon safety" size={20} />
          <Text className="stat-value">{city.safety.toFixed(1)}</Text>
          <Text className="stat-label">{t('city.safety')}</Text>
          <Text className="stat-unit">/5</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="tabs-section">
        <View className="tabs">
          <View
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Text>{t('city.overview')}</Text>
          </View>
          <View
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Text>{t('city.reviews')}</Text>
            <Text className="tab-count">{city.reviews}</Text>
          </View>
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView scrollY className="tab-content">
        {activeTab === 'overview' && (
          <View className="overview-section">
            <Text className="section-title">About {city.name}</Text>
            <Text className="city-description">{city.description}</Text>

            <Text className="section-title" style={{ marginTop: 20 }}>Why Nomads Love It</Text>
            <View className="tags-list">
              {city.tags.map((tag) => (
                <Text key={tag} className="tag-item">{tag}</Text>
              ))}
            </View>

            <View className="stats-row">
              <View className="stat-inline">
                <Users size={18} />
                <Text className="stat-inline-value">{city.checkins.toLocaleString()}</Text>
                <Text className="stat-inline-label">check-ins</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View className="reviews-section">
            {reviews.length === 0 ? (
              <View className="empty-reviews">
                <Text>No reviews yet. Be the first to review!</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <View key={review.id} className="review-card">
                  <View className="review-header">
                    <Image
                      className="review-avatar"
                      src={review.author.avatar}
                      mode="aspectFill"
                    />
                    <View className="review-author">
                      <Text className="author-name">{review.author.name}</Text>
                      <Text className="review-date">{review.visitedAt}</Text>
                    </View>
                    <View className="review-rating">
                      <Star className="star-icon" size={14} />
                      <Text>{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text className="review-title">{review.title}</Text>
                  <Text className="review-content">{review.content}</Text>
                  <View className="review-footer">
                    <View className="review-likes">
                      <ThumbsUp size={14} />
                      <Text>{review.likes}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="tabbar">
        <View className="tabbar-item">
          <MapPin size={24} />
          <Text>{t('nav.cities')}</Text>
        </View>
        <View className="tabbar-item">
          <Star size={24} />
          <Text>{t('nav.articles')}</Text>
        </View>
        <View className="tabbar-item">
          <MapPin size={24} />
          <Text>{t('nav.meetups')}</Text>
        </View>
        <View className="tabbar-item">
          <Star size={24} />
          <Text>{t('nav.profile')}</Text>
        </View>
      </View>
    </View>
  )
}

export default { CityDetail }
