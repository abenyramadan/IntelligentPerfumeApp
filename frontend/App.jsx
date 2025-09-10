import { useState, useEffect } from 'react'
import Layout from './Layout'
import HomePage from './HomePage'
import ProfilePage from './ProfilePage'
import RecommendationsPage from './RecommendationsPage'
import HistoryPage from './HistoryPage'
import QuestionnairePage from './QuestionnairePage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import { Toaster } from 'sonner'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    setCurrentPage('home')
  }

  const renderPage = () => {
    // Show auth pages if not authenticated
    if (!isAuthenticated) {
      switch (currentPage) {
        case 'login':
          return <LoginPage onPageChange={setCurrentPage} onLogin={handleLogin} />
        case 'register':
          return <RegisterPage onPageChange={setCurrentPage} onRegister={handleRegister} />
        default:
          return <HomePage onPageChange={setCurrentPage} />
      }
    }

    // Show main app pages if authenticated
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} user={user} />
      case 'profile':
        return <ProfilePage user={user} />
      case 'recommendations':
        return <RecommendationsPage user={user} />
      case 'history':
        return <HistoryPage user={user} onPageChange={setCurrentPage} />
      case 'questionnaire':
        return <QuestionnairePage user={user} />
      default:
        return <HomePage onPageChange={setCurrentPage} user={user} />
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <Layout currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} user={user}>
          {renderPage()}
        </Layout>
      ) : (
        renderPage()
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default App

