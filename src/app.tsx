import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from '@tarojs/components'
import './app.css'
import './i18n'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const lang = navigator.language.toLowerCase()
    if (lang.startsWith('zh')) {
      i18n.changeLanguage('zh')
    } else {
      i18n.changeLanguage('en')
    }
  }, [i18n])

  return (
    <View className="min-h-screen bg-slate-50">
    </View>
  )
}

export default App
