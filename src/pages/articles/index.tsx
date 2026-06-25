import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { articleApi } from '../../api'
import type { Article } from '../../types'
import { BookOpen, MapPin, Clock, Filter } from 'lucide-react'
import './index.css'

export function Articles() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    loadArticles()
  }, [activeCategory])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const res = await articleApi.getLatest(20).catch(() => mockArticles)
      setArticles(Array.isArray(res) ? res : mockArticles)
    } catch (error) {
      console.error('Failed to load articles:', error)
      setArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Visa', label: t('articles.categories.visa') },
    { key: 'Housing', label: t('articles.categories.housing') },
    { key: 'Work', label: t('articles.categories.work') },
    { key: 'Finance', label: 'Finance' },
    { key: 'Lifestyle', label: t('articles.categories.lifestyle') },
  ]

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  return (
    <View className="articles-page">
      <View className="main-content">
        {/* Header */}
        <View className="header">
          <Text className="page-title">{t('articles.title')}</Text>
          <View className="header-subtitle">
            <BookOpen size={36} />
            <Text>Guides and tips for digital nomads</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="categories-section">
          <ScrollView scrollX className="category-scroll">
            <View className="category-tags">
              {categories.map((cat) => (
                <View
                  key={cat.key}
                  className={`category-tag ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <Text>{cat.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Article List */}
        <ScrollView scrollY className="article-list-section">
          <View className="article-list">
            {loading ? (
              <View className="loading">{t('common.loading')}</View>
            ) : filteredArticles.length === 0 ? (
              <View className="empty">
                <BookOpen size={64} />
                <Text className="empty-title">No articles found</Text>
                <Text className="empty-subtitle">Check back soon for new content</Text>
              </View>
            ) : (
              filteredArticles.map((article) => (
                <View key={article.id} className="article-card">
                  <Image
                    className="article-image"
                    src={article.coverImage || `https://picsum.photos/seed/${article.id}/300/200`}
                    mode="aspectFill"
                  />
                  <View className="article-content">
                    <View className="article-meta-top">
                      <Text className="article-category">{article.category}</Text>
                      <View className="meta-item">
                        <Clock size={28} />
                        <Text>{article.readTime} min</Text>
                      </View>
                    </View>
                    <Text className="article-title">{article.title}</Text>
                    <Text className="article-summary">{article.summary}</Text>
                    <View className="article-meta-bottom">
                      {article.cityName && (
                        <View className="meta-item">
                          <MapPin size={28} />
                          <Text>{article.cityName}</Text>
                        </View>
                      )}
                      <View className="author">
                        <Image
                          className="author-avatar"
                          src={article.author.avatar}
                          mode="aspectFill"
                        />
                        <Text className="author-name">{article.author.name}</Text>
                      </View>
                    </View>
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
          <View className="tabbar-item">
            <MapPin size={40} />
            <Text>{t('nav.cities')}</Text>
          </View>
          <View className="tabbar-item">
            <BookOpen size={40} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item">
            <BookOpen size={40} />
            <Text>{t('nav.meetups')}</Text>
          </View>
          <View className="tabbar-item">
            <BookOpen size={40} />
            <Text>{t('nav.profile')}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Complete Guide to Thailand Digital Nomad Visa 2024',
    slug: 'thailand-visa-guide',
    summary: 'Everything you need to know about Thailand\'s new LTR visa for remote workers, including eligibility, application process, and required documents.',
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    category: 'Visa',
    cityId: '1',
    cityName: 'Thailand',
    author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    publishedAt: '2024-06-15',
    readTime: 8
  },
  {
    id: '2',
    title: 'Best Coworking Spaces in Lisbon',
    slug: 'lisbon-coworking',
    summary: 'A curated list of the best coworking spaces in Lisbon for digital nomads, from budget options to premium workspaces.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    category: 'Work',
    cityId: '2',
    cityName: 'Lisbon',
    author: { name: 'Marco Silva', avatar: 'https://i.pravatar.cc/150?u=marco' },
    publishedAt: '2024-06-10',
    readTime: 5
  },
  {
    id: '3',
    title: 'How to Open a Bank Account as a Nomad',
    slug: 'nomad-bank-account',
    summary: 'Step-by-step guide to opening bank accounts abroad without residency, covering Wise, Revolut, and local bank options.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    category: 'Finance',
    author: { name: 'Emma Watson', avatar: 'https://i.pravatar.cc/150?u=emma' },
    publishedAt: '2024-06-08',
    readTime: 10
  },
  {
    id: '4',
    title: 'Da Nang: The Rising Star of Southeast Asia',
    slug: 'da-nang-guide',
    summary: 'Why Da Nang should be your next destination. From beaches to mountains, here\'s everything you need to know.',
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    category: 'Lifestyle',
    cityId: '5',
    cityName: 'Da Nang',
    author: { name: 'Minh Tran', avatar: 'https://i.pravatar.cc/150?u=minh' },
    publishedAt: '2024-06-05',
    readTime: 7
  },
  {
    id: '5',
    title: 'Taxes for Digital Nomads: A Complete Guide',
    slug: 'nomad-taxes',
    summary: 'Understanding tax obligations as a digital nomad. Learn about tax residence, double taxation treaties, and popular tax-friendly countries.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    category: 'Finance',
    author: { name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?u=alex' },
    publishedAt: '2024-06-01',
    readTime: 12
  },
  {
    id: '6',
    title: 'Canggu Living: A Month-by-Month Guide',
    slug: 'canggu-living',
    summary: 'What to expect living in Canggu Bali, from accommodation costs to visa runs and everything in between.',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    category: 'Housing',
    cityId: '3',
    cityName: 'Canggu',
    author: { name: 'Made Suryani', avatar: 'https://i.pravatar.cc/150?u=made' },
    publishedAt: '2024-05-28',
    readTime: 9
  }
]

export default Articles
