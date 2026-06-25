import { useState, useEffect } from 'react'
import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useRouter, navigateTo } from '@tarojs/taro'
import { cityApi } from '../../api'
import type { City } from '../../types'
import { Search, Star, MapPin, Filter, Globe, Users, BookOpen, Award } from 'lucide-react'
import './index.css'

const mockCities: City[] = [
  { id: '1', name: 'Bangkok', slug: 'bangkok', country: 'Thailand', countryCode: 'TH', continent: 'Asia', nomadScore: 4.5, costIndex: 1200, internetSpeed: 50, weather: { temp: 30, humidity: 70, description: 'Hot' }, safety: 3.5, description: 'The capital city of Thailand, known for its vibrant street life and cultural landmarks.', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400', checkins: 12500, reviews: 890, tags: ['affordable', 'food'] },
  { id: '2', name: 'Lisbon', slug: 'lisbon', country: 'Portugal', countryCode: 'PT', continent: 'Europe', nomadScore: 4.6, costIndex: 2000, internetSpeed: 80, weather: { temp: 22, humidity: 50, description: 'Warm' }, safety: 4.5, description: 'Charming European capital with great weather and affordable living.', imageUrl: 'https://images.unsplash.com/photo-1526948531372-7713f70403e2?w=400', checkins: 15800, reviews: 1200, tags: ['safe', 'europe'] },
  { id: '3', name: 'Canggu', slug: 'canggu', country: 'Indonesia', countryCode: 'ID', continent: 'Asia', nomadScore: 4.4, costIndex: 1100, internetSpeed: 45, weather: { temp: 28, humidity: 75, description: 'Tropical' }, safety: 4.0, description: 'Surfing paradise and digital nomad hub in Bali.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', checkins: 9800, reviews: 750, tags: ['beach', 'affordable'] },
  { id: '4', name: 'Mexico City', slug: 'mexico-city', country: 'Mexico', countryCode: 'MX', continent: 'North America', nomadScore: 4.2, costIndex: 1500, internetSpeed: 60, weather: { temp: 18, humidity: 60, description: 'Mild' }, safety: 3.0, description: 'Cultural capital of Mexico with great food and art.', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', checkins: 8200, reviews: 650, tags: ['food', 'culture'] },
  { id: '5', name: 'Da Nang', slug: 'da-nang', country: 'Vietnam', countryCode: 'VN', continent: 'Asia', nomadScore: 4.3, costIndex: 800, internetSpeed: 55, weather: { temp: 28, humidity: 70, description: 'Tropical' }, safety: 4.2, description: 'Rising digital nomad destination with beautiful beaches.', imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400', checkins: 6500, reviews: 480, tags: ['beach', 'affordable'] },
  { id: '6', name: 'Tokyo', slug: 'tokyo', country: 'Japan', countryCode: 'JP', continent: 'Asia', nomadScore: 4.7, costIndex: 3000, internetSpeed: 100, weather: { temp: 15, humidity: 65, description: 'Cool' }, safety: 4.9, description: 'Ultra-modern city with incredible technology and culture.', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400', checkins: 20000, reviews: 1500, tags: ['safe', 'tech'] },
  { id: '7', name: 'Berlin', slug: 'berlin', country: 'Germany', countryCode: 'DE', continent: 'Europe', nomadScore: 4.5, costIndex: 2500, internetSpeed: 90, weather: { temp: 10, humidity: 70, description: 'Cool' }, safety: 4.5, description: 'Creative capital of Europe with vibrant nightlife.', imageUrl: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400', checkins: 18000, reviews: 1100, tags: ['culture', 'europe'] },
  { id: '8', name: 'Barcelona', slug: 'barcelona', country: 'Spain', countryCode: 'ES', continent: 'Europe', nomadScore: 4.4, costIndex: 2200, internetSpeed: 75, weather: { temp: 25, humidity: 60, description: 'Sunny' }, safety: 4.3, description: 'Beautiful city with amazing architecture and beaches.', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400', checkins: 22000, reviews: 1300, tags: ['beach', 'europe'] },
  { id: '9', name: 'Chiang Mai', slug: 'chiang-mai', country: 'Thailand', countryCode: 'TH', continent: 'Asia', nomadScore: 4.6, costIndex: 800, internetSpeed: 50, weather: { temp: 28, humidity: 65, description: 'Warm' }, safety: 4.0, description: 'Northern Thailand cultural hub, very affordable.', imageUrl: 'https://images.unsplash.com/photo-1563492065599-3526370a7548?w=400', checkins: 14000, reviews: 980, tags: ['affordable', 'culture'] },
  { id: '10', name: 'Medellin', slug: 'medellin', country: 'Colombia', countryCode: 'CO', continent: 'South America', nomadScore: 4.3, costIndex: 900, internetSpeed: 60, weather: { temp: 22, humidity: 70, description: 'Spring' }, safety: 3.5, description: 'City of eternal spring with friendly locals.', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', checkins: 7500, reviews: 520, tags: ['affordable', 'beach'] },
]

export function Cities() {
  const { t, i18n } = useTranslation()
  const { params } = useRouter()
  const [searchQuery, setSearchQuery] = useState(params?.search || '')
  const [sortBy, setSortBy] = useState<'score' | 'cost' | 'wifi' | 'checkins'>('score')
  const [filterTag, setFilterTag] = useState<string>('')
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCities()
  }, [sortBy, filterTag, searchQuery])

  const loadCities = async () => {
    try {
      setLoading(true)
      const params: any = { sort: sortBy }
      if (filterTag) params.filter = filterTag
      if (searchQuery) params.search = searchQuery

      let filteredMock = [...mockCities]
      if (searchQuery) {
        filteredMock = filteredMock.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.country.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (filterTag) {
        filteredMock = filteredMock.filter(c => c.tags.includes(filterTag))
      }
      if (sortBy === 'cost') {
        filteredMock.sort((a, b) => a.costIndex - b.costIndex)
      } else if (sortBy === 'wifi') {
        filteredMock.sort((a, b) => b.internetSpeed - a.internetSpeed)
      } else if (sortBy === 'checkins') {
        filteredMock.sort((a, b) => b.checkins - a.checkins)
      } else {
        filteredMock.sort((a, b) => b.nomadScore - a.nomadScore)
      }

      const res = await cityApi.list(params).catch(() => ({ cities: filteredMock }))
      setCities(res.cities || filteredMock)
    } catch (error) {
      console.error('Failed to load cities:', error)
      setCities(mockCities)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadCities()
  }

  const handleTabClick = (path: string) => {
    navigateTo({ url: path })
  }

  const filters = [
    { key: '', label: t('cities.filter.all') },
    { key: 'affordable', label: t('cities.filter.affordable') },
    { key: 'safe', label: t('cities.filter.safe') },
    { key: 'beach', label: t('cities.filter.warm') },
  ]

  const sortOptions = [
    { key: 'score', label: t('cities.sort.score') },
    { key: 'cost', label: t('cities.sort.cost') },
    { key: 'wifi', label: t('cities.sort.wifi') },
    { key: 'checkins', label: 'Popularity' },
  ]

  return (
    <View className="cities-page">
      <View className="main-content">
        {/* Header */}
        <View className="header">
          <Text className="page-title">{t('cities.title')}</Text>
        </View>

        {/* Search */}
        <View className="search-section">
          <View className="search-box">
            <Search className="search-icon" size={36} />
            <Input
              className="search-input"
              placeholder={t('cities.search')}
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.detail.value)}
              onConfirm={handleSearch}
            />
          </View>
        </View>

        {/* Filters */}
        <View className="filters-section">
          <ScrollView scrollX className="filter-scroll">
            <View className="filter-tags">
              {filters.map((filter) => (
                <View
                  key={filter.key}
                  className={`filter-tag ${filterTag === filter.key ? 'active' : ''}`}
                  onClick={() => setFilterTag(filter.key)}
                >
                  <Filter size={28} />
                  <Text>{filter.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View className="sort-section">
          <ScrollView scrollX className="sort-scroll">
            <View className="sort-options">
              {sortOptions.map((option) => (
                <View
                  key={option.key}
                  className={`sort-option ${sortBy === option.key ? 'active' : ''}`}
                  onClick={() => setSortBy(option.key as any)}
                >
                  <Text>{option.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* City List */}
        <ScrollView scrollY className="city-list-section">
          <View className="city-list">
            {loading ? (
              <View className="loading">{t('common.loading')}</View>
            ) : cities.length === 0 ? (
              <View className="empty">No cities found</View>
            ) : (
              cities.map((city, index) => (
                <View key={city.id} className="city-item" onClick={() => navigateTo({ url: `/pages/city-detail/index?id=${city.id}` })}>
                  <Text className="city-rank">#{index + 1}</Text>
                  <Image
                    className="city-image"
                    src={city.imageUrl || `https://picsum.photos/seed/${city.id}/200/200`}
                    mode="aspectFill"
                  />
                  <View className="city-info">
                    <Text className="city-name">{city.name}</Text>
                    <View className="city-location">
                      <MapPin size={28} />
                      <Text className="city-country">{city.country}</Text>
                    </View>
                    <View className="city-tags">
                      {city.tags.slice(0, 2).map((tag) => (
                        <Text key={tag} className="city-tag">{tag}</Text>
                      ))}
                    </View>
                  </View>
                  <View className="city-stats">
                    <View className="stat-item">
                      <Star className="stat-icon" size={36} />
                      <Text className="stat-value">{city.nomadScore.toFixed(1)}</Text>
                    </View>
                    <Text className="stat-label">{t('cities.nomadscore')}</Text>
                    <Text className="city-cost">${city.costIndex}<Text className="cost-unit">/mo</Text></Text>
                  </View>
                </View>
              ))
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
          <View className="tabbar-item active" onClick={() => handleTabClick('/pages/cities/index')}>
            <MapPin size={40} />
            <Text>{t('nav.cities')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/articles/index')}>
            <BookOpen size={40} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/meetups/index')}>
            <Users size={40} />
            <Text>{t('nav.meetups')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/profile/index')}>
            <Award size={40} />
            <Text>{t('nav.profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Cities
