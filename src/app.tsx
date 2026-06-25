import { Component } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import './app.css'

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        {this.props.children}
      </I18nextProvider>
    )
  }
}

export default App