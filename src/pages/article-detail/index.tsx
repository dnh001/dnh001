import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter, navigateTo } from '@tarojs/taro'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Globe, MapPin, Clock, Calendar, Star, Heart, BookOpen, Users } from 'lucide-react'
import './index.css'

export function ArticleDetail() {
  const { t } = useTranslation()
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const articleId = router.params?.id || '1'
    loadArticle(articleId)
  }, [])

  const loadArticle = async (articleId: string) => {
    try {
      setLoading(true)
      const foundArticle = mockArticles.find(a => a.id === articleId)
      setArticle(foundArticle || mockArticles[0])
    } catch (error) {
      console.error('Failed to load article:', error)
      setArticle(mockArticles[0])
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigateTo({ url: '/pages/articles/index' })
  }

  const handleTabClick = (path: string) => {
    navigateTo({ url: path })
  }

  if (loading) {
    return (
      <View className="article-detail-page">
        <View className="loading">{t('common.loading')}</View>
      </View>
    )
  }

  return (
    <View className="article-detail-page">
      <View className="main-content">
        <View className="header">
          <View className="header-content">
            <View className="back-btn" onClick={handleBack}>
              <ArrowLeft size={40} />
            </View>
            <Text className="category-tag">{article.category}</Text>
          </View>
        </View>

        <ScrollView scrollY className="content-area">
          <Text className="article-title">{article.title}</Text>

          <View className="article-meta">
            <View className="author-info">
              <Image
                className="author-avatar"
                src={article.author.avatar || `https://i.pravatar.cc/150?u=${article.author.name}`}
                mode="aspectFill"
              />
              <View className="author-details">
                <Text className="author-name">{article.author.name}</Text>
                <Text className="publish-date">
                  <Calendar size={24} />
                  {article.publishedAt}
                </Text>
              </View>
            </View>
            <View className="read-time">
              <Clock size={28} />
              <Text>{article.readTime} min read</Text>
            </View>
          </View>

          {article.coverImage && (
            <Image
              className="article-image"
              src={article.coverImage}
              mode="aspectFill"
            />
          )}

          {article.cityName && (
            <View className="city-badge">
              <MapPin size={28} />
              <Text>{article.cityName}</Text>
            </View>
          )}

          <View className="article-body">
            <Text className="body-text">{article.summary}</Text>
            <Text className="body-text">
              This comprehensive guide covers everything you need to know about living as a digital nomad in this amazing location. From finding the perfect accommodation to understanding local culture, we've got you covered.
            </Text>
            <Text className="body-text">
              Whether you're just starting out or you're a seasoned nomad, these tips will help you make the most of your experience. We'll cover practical advice like visa requirements, cost of living, and internet connectivity.
            </Text>
            <Text className="body-text">
              Join thousands of digital nomads who have made this city their home. With its vibrant community, affordable lifestyle, and endless opportunities, it's easy to see why.
            </Text>
          </View>

          <View className="article-actions">
            <View className="action-btn">
              <Heart size={36} />
              <Text>{t('articles.save')}</Text>
            </View>
            <View className="action-btn">
              <Star size={36} />
              <Text>{t('articles.rate')}</Text>
            </View>
            <View className="action-btn">
              <Users size={36} />
              <Text>{t('articles.share')}</Text>
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
          <View className="tabbar-item active" onClick={() => handleTabClick('/pages/articles/index')}>
            <BookOpen size={40} />
            <Text>{t('nav.articles')}</Text>
          </View>
          <View className="tabbar-item" onClick={() => handleTabClick('/pages/meetups/index')}>
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

const mockArticles = [
  {
    id: '1',
    title: 'Complete Guide to Thailand Digital Nomad Visa 2024',
    slug: 'thailand-visa-guide',
    summary: 'Everything you need to know about Thailand\'s new LTR visa for remote workers, including eligibility, application process, and required documents.',
    coverImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200',
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
    summary: 'A curated list of the best coworking spaces in Lisbon for digital nomads, from budget options to premium workspaces with ocean views.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    category: 'Work',
    cityId: '2',
    cityName: 'Lisbon',
    author: { name: 'Marco Silva', avatar: 'https://i.pravatar.cc/150?u=marco' },
    publishedAt: '2024-06-10',
    readTime: 5
  },
  {
    id: '3',
    title: 'Canggu Living: A Month-by-Month Guide',
    slug: 'canggu-living',
    summary: 'What to expect living in Canggu Bali, from accommodation costs to visa runs and everything in between.',
    coverImage: 'https://images.unsplash.com/photo-1543364264-74733c19f753?w=1200',
    category: 'Housing',
    cityId: '3',
    cityName: 'Canggu',
    author: { name: 'Made Suryani', avatar: 'https://i.pravatar.cc/150?u=made' },
    publishedAt: '2024-06-08',
    readTime: 9
  }
]

export default ArticleDetail