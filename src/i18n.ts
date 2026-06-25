import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      home: {
        hero: {
          title: 'Discover Your Next Nomad Destination',
          subtitle: 'Find the best cities for digital nomads worldwide',
          search: 'Search cities...'
        },
        section: {
          trending: 'Trending Cities',
          toprated: 'Top Rated',
          articles: 'Latest Articles',
          meetups: 'Upcoming Meetups'
        }
      },
      nav: {
        home: 'Home',
        cities: 'Cities',
        articles: 'Articles',
        meetups: 'Meetups',
        profile: 'Profile'
      },
      common: {
        viewmore: 'View More'
      }
    }
  },
  zh: {
    translation: {
      home: {
        hero: {
          title: '发现你的下一个游民目的地',
          subtitle: '寻找全球最适合数字游民的城市',
          search: '搜索城市...'
        },
        section: {
          trending: '热门城市',
          toprated: '最高评分',
          articles: '最新文章',
          meetups: '即将举行的聚会'
        }
      },
      nav: {
        home: '首页',
        cities: '城市',
        articles: '文章',
        meetups: '聚会',
        profile: '个人中心'
      },
      common: {
        viewmore: '查看更多'
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n