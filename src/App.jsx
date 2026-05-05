import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import MovieInfo from './pages/MovieInfo/MovieInfo'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify'

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        console.log('Logged In')
        if (location.pathname === '/login') {
          navigate('/')
        }
      } else {
        console.log('Logged Out')
        if (location.pathname !== '/login') {
          navigate('/login')
        }
      }
    })

    return () => unsubscribe()
  }, [location.pathname, navigate])

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
        <Route path='/title/:mediaType/:id' element={<MovieInfo />} />
      </Routes>
    </div>
  )
}

export default App
