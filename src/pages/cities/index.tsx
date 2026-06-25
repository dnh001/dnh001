import { useState, useEffect } from 'react'
import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useRouter } from '@tarojs/taro'
import { cityApi } from '../../api'
import type { City } from '../../types'
import { Search, Star, MapPin, Filter } from 'lucide-react'
import './index.css'

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

      const res = await cityApi.list(params)
      setCities(res.cities || [])
    } catch (error) {
      console.error('Failed to load cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadCities()
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
      {/* Header */}
      <View className="header">
        <Text className="page-title">{t('cities.title')}</Text>
      </View>

      {/* Search */}
      <View className="search-section">
        <View className="search-box">
          <Search className="search-icon" size={18} />
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
                <Filter size={14} />
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
              <View key={city.id} className="city-item">
                <Text className="city-rank">#{index + 1}</Text>
                <Image
                  className="city-image"
                  src={city.imageUrl || `https://picsum.photos/seed/${city.id}/200/200`}
                  mode="aspectFill"
                />
                <View className="city-info">
                  <Text className="city-name">{city.name}</Text>
                  <View className="city-location">
                    <MapPin size={12} />
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
                    <Star className="stat-icon" size={16} />
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

export default Cities
