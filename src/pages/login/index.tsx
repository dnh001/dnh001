import { useState } from 'react'
import { View, Text, Input, Button, Image } from '@tarojs/components'
import { useTranslation } from 'react-i18next'
import { useRouter } from '@tarojs/taro'
import { Globe, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import './index.css'

export function Login() {
  const { t } = useTranslation()
  const { navigateTo } = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const API_BASE = process.env.NODE_ENV === 'production'
        ? 'https://api.dnh001.com'
        : 'http://localhost:8787'

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Request failed')
      }

      const data = await res.json()

      // Save token and user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Navigate to profile
      wx?.switchTab?.({ url: '/pages/profile/index' })
      window.location.href = '/pages/profile/index'
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <View className="login-page">
      {/* Header */}
      <View className="login-header">
        <View className="back-btn" onClick={handleBack}>
          <ArrowLeft size={24} />
        </View>
        <View className="logo-section">
          <Globe className="logo-icon" />
          <Text className="logo-text">DNH001</Text>
        </View>
        <View className="header-spacer" />
      </View>

      {/* Form */}
      <View className="login-content">
        <Text className="page-title">
          {mode === 'login' ? 'Welcome Back' : 'Join Our Community'}
        </Text>
        <Text className="page-subtitle">
          {mode === 'login'
            ? 'Sign in to continue your nomad journey'
            : 'Start your digital nomad adventure today'}
        </Text>

        {error && (
          <View className="error-message">
            <Text>{error}</Text>
          </View>
        )}

        {mode === 'register' && (
          <View className="input-group">
            <User className="input-icon" size={20} />
            <Input
              className="input-field"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
            />
          </View>
        )}

        <View className="input-group">
          <Mail className="input-icon" size={20} />
          <Input
            className="input-field"
            type="text"
            placeholder="Email address"
            value={formData.email}
            onInput={(e) => setFormData({ ...formData, email: e.detail.value })}
          />
        </View>

        <View className="input-group">
          <Lock className="input-icon" size={20} />
          <Input
            className="input-field"
            type="password"
            placeholder="Password"
            value={formData.password}
            onInput={(e) => setFormData({ ...formData, password: e.detail.value })}
          />
        </View>

        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
        </Button>

        <View className="divider">
          <View className="divider-line" />
          <Text className="divider-text">or</Text>
          <View className="divider-line" />
        </View>

        <Button
          className="switch-mode-btn"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Button>
      </View>

      {/* Social Login */}
      <View className="social-login">
        <Text className="social-title">Continue with</Text>
        <View className="social-buttons">
          <View className="social-btn">
            <Text>G</Text>
          </View>
          <View className="social-btn">
            <Text>🍎</Text>
          </View>
        </View>
      </View>

      {/* Terms */}
      <Text className="terms-text">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  )
}

export default { Login }
