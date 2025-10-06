// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'

console.log('main.jsx is loading...')

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  console.log('ReactDOM.createRoot successful')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  console.log('App rendered successfully')
  
} catch (error) {
  console.error('CRITICAL ERROR in main.jsx:', error)
  // Show error on screen
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red;">
      <h2>Application Error</h2>
      <p><strong>${error.name}:</strong> ${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `
}