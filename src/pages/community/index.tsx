import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { Users, Heart, MessageCircle, Share2, MapPin, Send } from 'lucide-react'
import './index.css'

interface Post {
  id: string
  author: {
    name: string
    avatar: string
  }
  cityName?: string
  content: string
  images?: string[]
  likes: number
  comments: number
  createdAt: string
  liked?: boolean
}

export function Community() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    setLoading(false)
    setPosts(mockPosts)
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const handleShare = (postId: string) => {
    console.log('Share:', postId)
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <View className="community-page">
      {/* Header */}
      <View className="header">
        <Text className="page-title">{t('nav.community')}</Text>
        <View className="header-subtitle">
          <Users size={16} />
          <Text>Connect with nomads worldwide</Text>
        </View>
      </View>

      {/* Create Post */}
      <View className="create-post">
        <View className="user-avatar-small">
          <Image
            src="https://i.pravatar.cc/150?u=current"
            mode="aspectFill"
          />
        </View>
        <Input
          className="post-input"
          type="text"
          placeholder="Share your nomad experience..."
          value={newPost}
          onInput={(e) => setNewPost(e.detail.value)}
        />
        <View className="post-actions">
          <Send size={20} className={newPost.trim() ? 'active' : ''} />
        </View>
      </View>

      {/* Post Feed */}
      <ScrollView scrollY className="post-feed">
        <View className="post-list">
          {posts.map((post) => (
            <View key={post.id} className="post-card">
              {/* Post Header */}
              <View className="post-header">
                <Image
                  className="post-avatar"
                  src={post.author.avatar}
                  mode="aspectFill"
                />
                <View className="post-author-info">
                  <Text className="post-author-name">{post.author.name}</Text>
                  <View className="post-meta">
                    {post.cityName && (
                      <>
                        <MapPin size={12} />
                        <Text className="post-city">{post.cityName}</Text>
                      </>
                    )}
                    <Text className="post-time">{formatTime(post.createdAt)}</Text>
                  </View>
                </View>
              </View>

              {/* Post Content */}
              <Text className="post-content">{post.content}</Text>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <View className={`post-images ${post.images.length === 1 ? 'single' : ''}`}>
                  {post.images.slice(0, 4).map((img, idx) => (
                    <Image
                      key={idx}
                      className="post-image"
                      src={img}
                      mode="aspectFill"
                    />
                  ))}
                </View>
              )}

              {/* Post Actions */}
              <View className="post-footer">
                <View
                  className={`action-btn ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={18} fill={post.liked ? '#ec4899' : 'none'} />
                  <Text>{post.likes}</Text>
                </View>
                <View className="action-btn">
                  <MessageCircle size={18} />
                  <Text>{post.comments}</Text>
                </View>
                <View className="action-btn" onClick={() => handleShare(post.id)}>
                  <Share2 size={18} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="tabbar">
        <View className="tabbar-item">
          <MapPin size={24} />
          <Text>{t('nav.cities')}</Text>
        </View>
        <View className="tabbar-item">
          <Users size={24} />
          <Text>{t('nav.meetups')}</Text>
        </View>
        <View className="tabbar-item active">
          <Users size={24} />
          <Text>{t('nav.community')}</Text>
        </View>
        <View className="tabbar-item">
          <Users size={24} />
          <Text>{t('nav.profile')}</Text>
        </View>
      </View>
    </View>
  )
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    cityName: 'Bangkok',
    content: 'Just arrived in Bangkok! The street food here is absolutely incredible. Already found my favorite Pad Thai spot near Thonglor 🇨🇷🇹🇭',
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400'
    ],
    likes: 42,
    comments: 8,
    createdAt: '2026-06-25T08:30:00'
  },
  {
    id: '2',
    author: {
      name: 'Marco Silva',
      avatar: 'https://i.pravatar.cc/150?u=marco'
    },
    cityName: 'Lisbon',
    content: 'Pro tip for Lisbon nomads: The best coworking deals are at Heden. €15/day gets you a standing desk, unlimited coffee, and fast WiFi. Much better than the touristy spots!',
    likes: 89,
    comments: 23,
    createdAt: '2026-06-24T15:20:00'
  },
  {
    id: '3',
    author: {
      name: 'Emma Watson',
      avatar: 'https://i.pravatar.cc/150?u=emma'
    },
    cityName: 'Canggu',
    content: 'Sunrise surf session followed by a smoothie bowl at Seed. This is the nomad life 💛',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'
    ],
    likes: 156,
    comments: 34,
    createdAt: '2026-06-24T10:45:00'
  },
  {
    id: '4',
    author: {
      name: 'Minh Tran',
      avatar: 'https://i.pravatar.cc/150?u=minh'
    },
    cityName: 'Da Nang',
    content: 'Da Nang is seriously underrated! Just moved here and the cost of living is amazing. My ocean view apartment is only $400/month including utilities. Fast WiFi everywhere too!',
    likes: 67,
    comments: 15,
    createdAt: '2026-06-23T18:00:00'
  }
]

export default { Community }
