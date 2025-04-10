// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './custom.css'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from './store/index.tsx'
import GlobalAlert from './components/organisms/globalAlert.tsx'
import Popup from '@components/organisms/popup.tsx'
import ImagePreview from '@components/atoms/imagePreview.tsx'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <GlobalAlert />
      <Popup />
      <ImagePreview />
    </PersistGate>
  </Provider>
)
