import { useState, useEffect } from 'react'
import { View, Text, Image, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTranslation } from 'react-i18next'
import { cityApi, articleApi, meetupApi } from '../../api'
import type { City, Article, Meetup } from '../../types'
import { Globe, Search, TrendingUp, Star, Calendar, MapPin, BookOpen } from 'lucide-react'
import './index.css'

export function Index() {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingCities, setTrendingCities] = useState<City[]>([])
  const [topRatedCities, setTopRatedCities] = useState<City[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [trending, topRated, latestArticles, upcomingMeetups] = await Promise.all([
        cityApi.getTrending().catch(() => ({ cities: mockTrendingCities })),
        cityApi.getTopRated().catch(() => ({ cities: mockTopRatedCities })),
        articleApi.getLatest(6).catch(() => []),
        meetupApi.getUpcoming(3).catch(() => [])
      ])

      setTrendingCities(trending.cities || mockTrendingCities)
      setTopRatedCities(topRated.cities || mockTopRatedCities)
      setArticles(latestArticles)
      setMeetups(upcomingMeetups)
    } catch (error) {
      console.error('Failed to load data:', error)
      // Use mock data on error
      setTrendingCities(mockTrendingCities)
      setTopRatedCities(mockTopRatedCities)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Taro.navigateTo({
        url: `/pages/cities/index?search=${encodeURIComponent(searchQuery)}`
      })
    }
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  const handleCityClick = (cityId: string) => {
    Taro.navigateTo({
      url: `/pages/city-detail/index?id=${cityId}`
    })
  }

  const handleArticleClick = (articleId: string) => {
    Taro.navigateTo({
      url: `/pages/articles/index?id=${articleId}`
    })
  }

  const handleMeetupClick = (meetupId: string) => {
    Taro.navigateTo({
      url: `/pages/meetups/index?id=${meetupId}`
    })
  }

  const handleViewMore = (section: string) => {
    const routes: Record<string, string> = {
      trending: '/pages/cities/index',
      toprated: '/pages/cities/index',
      articles: '/pages/articles/index',
      meetups: '/pages/meetups/index'
    }
    Taro.navigateTo({
      url: routes[section] || '/pages/cities/index'
    })
  }

  const handleTabClick = (tab: string) => {
    const routes: Record<string, string> = {
      home: '/pages/index/index',
      cities: '/pages/cities/index',
      articles: '/pages/articles/index',
      meetups: '/pages/meetups/index',
      profile: '/pages/profile/index'
    }
    if (routes[tab]) {
      Taro.reLaunch({
        url: routes[tab]
      })
    }
  }

  return (
    <View className="index-page">
      {/* Header */}
      <View className="header">
        <View className="header-content">
          <View className="logo-section">
            <Globe className="logo-icon" />
            <View className="logo-text">
              <Text className="logo-title">DNH001</Text>
              <Text className="logo-subtitle">{i18n.language === 'zh' ? '数字游民之家' : 'Digital Nomad Hub'}</Text>
            </View>
          </View>
          <View className="header-actions">
            <button onClick={toggleLanguage} className="lang-btn">
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View className="hero">
        <View className="hero-content">
          <Text className="hero-title">{t('home.hero.title')}</Text>
          <Text className="hero-subtitle">{t('home.hero.subtitle')}</Text>

          <View className="search-box">
            <Search className="search-icon" size={20} />
            <Input
              className="search-input"
              placeholder={t('home.hero.search')}
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.detail.value)}
              onConfirm={handleSearch}
            />
          </View>
        </View>
      </View>

      <ScrollView scrollY className="main-content">
        {/* Trending Cities */}
        <View className="section">
          <View className="section-header">
            <View className="section-title-group">
              <TrendingUp className="section-icon" />
              <Text className="section-title">{t('home.section.trending')}</Text>
            </View>
            <Text className="section-more" onClick={() => handleViewMore('trending')}>{t('common.viewmore')} →</Text>
          </View>

          <ScrollView scrollX className="city-scroll">
            <View className="city-cards">
              {trendingCities.map((city) => (
                <View key={city.id} className="city-card" onClick={() => handleCityClick(city.id)}>
                  <Image
                    className="city-image"
                    src={city.imageUrl || `https://picsum.photos/seed/${city.id}/300/200`}
                    mode="aspectFill"
                  />
                  <View className="city-overlay">
                    <Text className="city-name">{city.name}</Text>
                    <Text className="city-country">{city.country}</Text>
                    <View className="city-score">
                      <Star className="score-icon" size={12} />
                      <Text className="score-value">{city.nomadScore.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top Rated Cities */}
        <View className="section">
          <View className="section-header">
            <View className="section-title-group">
              <Star className="section-icon" />
              <Text className="section-title">{t('home.section.toprated')}</Text>
            </View>
            <Text className="section-more" onClick={() => handleViewMore('toprated')}>{t('common.viewmore')} →</Text>
          </View>

          <View className="city-list">
            {topRatedCities.map((city, index) => (
              <View key={city.id} className="city-list-item" onClick={() => handleCityClick(city.id)}>
                <Text className="city-rank">#{index + 1}</Text>
                <Image
                  className="city-list-image"
                  src={city.imageUrl || `https://picsum.photos/seed/${city.id}/100/100`}
                  mode="aspectFill"
                />
                <View className="city-list-info">
                  <Text className="city-list-name">{city.name}</Text>
                  <Text className="city-list-country">{city.country}</Text>
                </View>
                <View className="city-list-score">
                  <Star className="score-icon" size={14} />
                  <Text className="score-value">{city.nomadScore.toFixed(1)}</Text>
                </View>
                <Text className="city-list-cost">${city.costIndex}/mo</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Articles */}
        <View className="section">
          <View className="section-header">
            <View className="section-title-group">
              <Globe className="section-icon" />
              <Text className="section-title">{t('home.section.articles')}</Text>
            </View>
            <Text className="section-more" onClick={() => handleViewMore('articles')}>{t('common.viewmore')} →</Text>
          </View>

          <View className="article-list">
            {(articles.length > 0 ? articles : mockArticles).map((article) => (
              <View key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
                <Image
                  className="article-image"
                  src={article.coverImage || `https://picsum.photos/seed/${article.id}/600/400`}
                  mode="aspectFill"
                />
                <View className="article-info">
                  <View className="article-top">
                    <Text className="article-category">{article.category}</Text>
                    <Text className="article-title">{article.title}</Text>
                  </View>
                  <View className="article-meta">
                    {article.cityName && (
                      <View className="meta-item">
                        <MapPin size={28} />
                        <Text>{article.cityName}</Text>
                      </View>
                    )}
                    <Text className="meta-readtime">{article.readTime} min read</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Meetups */}
        <View className="section">
          <View className="section-header">
            <View className="section-title-group">
              <Calendar className="section-icon" />
              <Text className="section-title">{t('home.section.meetups')}</Text>
            </View>
            <Text className="section-more" onClick={() => handleViewMore('meetups')}>{t('common.viewmore')} →</Text>
          </View>

          <View className="meetup-list">
            {(meetups.length > 0 ? meetups : mockMeetups).map((meetup) => (
              <View key={meetup.id} className="meetup-card" onClick={() => handleMeetupClick(meetup.id)}>
                <View className="meetup-date">
                  <Text className="meetup-day">{new Date(meetup.date).getDate()}</Text>
                  <Text className="meetup-month">
                    {new Date(meetup.date).toLocaleString('default', { month: 'short' })}
                  </Text>
                </View>
                <View className="meetup-info">
                  <Text className="meetup-title">{meetup.title}</Text>
                  <View className="meetup-location">
                    <MapPin size={12} />
                    <Text>{meetup.cityName}</Text>
                  </View>
                  <Text className="meetup-attendees">
                    {meetup.currentAttendees}/{meetup.maxAttendees} attending
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="bottom-spacer" />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="tabbar">
        <View className="tabbar-content">
          <View className="tabbar-item active" onClick={() => handleTabClick('home')}>
            <Globe size={28} />
            <Text>{t('nav.home')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('cities')}>
            <MapPin size={28} />
            <Text>{t('nav.cities')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('articles')}>
            <BookOpen size={28} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('meetups')}>
            <Calendar size={28} />
            <Text>{t('nav.meetups')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('profile')}>
            <Star size={28} />
            <Text>{t('nav.profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// Mock Data
const mockTrendingCities: City[] = [
  { id: '1', name: 'Bangkok', slug: 'bangkok', country: 'Thailand', countryCode: 'TH', continent: 'Asia', nomadScore: 4.5, costIndex: 1200, internetSpeed: 50, weather: { temp: 30, humidity: 70, description: 'Hot' }, safety: 3.5, description: '', imageUrl: '', checkins: 12500, reviews: 890, tags: [] },
  { id: '2', name: 'Lisbon', slug: 'lisbon', country: 'Portugal', countryCode: 'PT', continent: 'Europe', nomadScore: 4.6, costIndex: 2000, internetSpeed: 80, weather: { temp: 22, humidity: 50, description: 'Warm' }, safety: 4.5, description: '', imageUrl: '', checkins: 15800, reviews: 1200, tags: [] },
  { id: '3', name: 'Canggu', slug: 'canggu', country: 'Indonesia', countryCode: 'ID', continent: 'Asia', nomadScore: 4.4, costIndex: 1100, internetSpeed: 45, weather: { temp: 28, humidity: 75, description: 'Tropical' }, safety: 4.0, description: '', imageUrl: '', checkins: 9800, reviews: 750, tags: [] },
  { id: '4', name: 'Mexico City', slug: 'mexico-city', country: 'Mexico', countryCode: 'MX', continent: 'North America', nomadScore: 4.2, costIndex: 1500, internetSpeed: 40, weather: { temp: 20, humidity: 45, description: 'Mild' }, safety: 3.0, description: '', imageUrl: '', checkins: 11200, reviews: 920, tags: [] },
  { id: '5', name: 'Da Nang', slug: 'da-nang', country: 'Vietnam', countryCode: 'VN', continent: 'Asia', nomadScore: 4.3, costIndex: 900, internetSpeed: 55, weather: { temp: 28, humidity: 80, description: 'Hot' }, safety: 4.5, description: '', imageUrl: '', checkins: 7500, reviews: 420, tags: [] },
]

const mockTopRatedCities: City[] = [
  { id: '6', name: 'Tokyo', slug: 'tokyo', country: 'Japan', countryCode: 'JP', continent: 'Asia', nomadScore: 4.7, costIndex: 3000, internetSpeed: 150, weather: { temp: 18, humidity: 60, description: 'Mild' }, safety: 5.0, description: '', imageUrl: '', checkins: 18500, reviews: 1500, tags: [] },
  { id: '7', name: 'Berlin', slug: 'berlin', country: 'Germany', countryCode: 'DE', continent: 'Europe', nomadScore: 4.5, costIndex: 2500, internetSpeed: 100, weather: { temp: 12, humidity: 55, description: 'Cool' }, safety: 4.2, description: '', imageUrl: '', checkins: 14200, reviews: 1100, tags: [] },
  { id: '8', name: 'Barcelona', slug: 'barcelona', country: 'Spain', countryCode: 'ES', continent: 'Europe', nomadScore: 4.4, costIndex: 2200, internetSpeed: 90, weather: { temp: 24, humidity: 50, description: 'Warm' }, safety: 3.8, description: '', imageUrl: '', checkins: 13500, reviews: 1050, tags: [] },
  { id: '9', name: 'Chiang Mai', slug: 'chiang-mai', country: 'Thailand', countryCode: 'TH', continent: 'Asia', nomadScore: 4.6, costIndex: 800, internetSpeed: 60, weather: { temp: 30, humidity: 65, description: 'Hot' }, safety: 4.3, description: '', imageUrl: '', checkins: 16800, reviews: 1400, tags: [] },
]

const mockArticles: Article[] = [
  { id: '1', title: 'Complete Guide to Thailand Digital Nomad Visa 2024', slug: 'thailand-visa-guide', summary: 'Everything you need to know about Thailands new LTR visa for remote workers', coverImage: '', category: 'Visa', cityName: 'Thailand', author: { name: 'Sarah', avatar: '' }, publishedAt: '2024-06-15', readTime: 8 },
  { id: '2', title: 'Best Coworking Spaces in Lisbon', slug: 'lisbon-coworking', summary: 'A curated list of the best coworking spaces in Lisbon for digital nomads', coverImage: '', category: 'Work', cityName: 'Lisbon', author: { name: 'Marco', avatar: '' }, publishedAt: '2024-06-10', readTime: 5 },
  { id: '3', title: 'How to Open a Bank Account as a Nomad', slug: 'nomad-bank-account', summary: 'Step-by-step guide to opening bank accounts abroad without residency', coverImage: '', category: 'Finance', author: { name: 'Emma', avatar: '' }, publishedAt: '2024-06-08', readTime: 10 },
]

const mockMeetups: Meetup[] = [
  { id: '1', title: 'Nomad Lunch Bangkok', cityId: '1', cityName: 'Bangkok', location: 'The Hive Thonglor', date: '2026-07-05', time: '12:00', maxAttendees: 20, currentAttendees: 12, organizer: { name: 'John', avatar: '' } },
  { id: '2', title: 'Coworking Session Lisbon', cityId: '2', cityName: 'Lisbon', location: 'Heden Coworking', date: '2026-07-08', time: '10:00', maxAttendees: 30, currentAttendees: 18, organizer: { name: 'Ana', avatar: '' } },
  { id: '3', title: 'Beach Day Canggu', cityId: '3', cityName: 'Canggu', location: 'Finns Beach Club', date: '2026-07-12', time: '14:00', maxAttendees: 50, currentAttendees: 35, organizer: { name: 'Made', avatar: '' } },
]

export default Index
