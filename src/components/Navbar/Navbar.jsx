import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'
import { Link } from 'react-router-dom'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2VmZjM0NTAxZTZlODc3MmU5ZjA3ZjAwZjU4NzE5ZiIsIm5iZiI6MTc3MjQ4NzU2MS41ODUsInN1YiI6IjY5YTYwMzg5NzMxYWIyMjgxYzI4YjM3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtJHgvIy_gA_uwSPoIqWRwi_9JeoMNLqH1KuFOcsRW0'
  }
}

const Navbar = () => {
  const navRef = useRef()
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark')
      } else {
        navRef.current.classList.remove('nav-dark')
      }
    })
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      return
    }
    const timer = setTimeout(() => {
      fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}&page=1`,
        options
      )
        .then(res => res.json())
        .then(data =>
          setSearchResults(data.results ? data.results.slice(0, 8) : [])
        )
        .catch(() => setSearchResults([]))
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearchToggle = () => {
    setShowSearch(prev => !prev)
  }

  return (
    <div ref={navRef} className='navbar'>
      <div className='navbar-left'>
        <img src={logo} alt='' />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>
      <div className='navbar-right'>
        <div className={`navbar-search ${showSearch ? 'active' : ''}`}>
          <img
            src={search_icon}
            alt=''
            className='icons'
            onClick={handleSearchToggle}
          />
          {showSearch && (
            <div className='search-wrapper'>
              <input
                type='text'
                placeholder='Search titles...'
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className='search-dropdown'>
                  {searchResults
                    .filter(item => item.media_type !== 'person')
                    .map(item => (
                      <Link
                        key={item.id}
                        to={`/title/${item.media_type}/${item.id}`}
                        className='search-result-item'
                        onClick={handleSearchToggle}
                      >
                        {item.poster_path || item.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${
                              item.poster_path || item.profile_path
                            }`}
                            alt={item.title || item.name}
                          />
                        ) : (
                          <div className='search-result-no-img' />
                        )}
                        <div className='search-result-info'>
                          <p className='search-result-title'>
                            {item.title || item.name}
                          </p>
                          <span className='search-result-type'>
                            {item.media_type}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <img src={bell_icon} alt='' />
        <div className='navbar-profile'>
          <img src={profile_img} alt='' className='profile' />
          <img src={caret_icon} alt='' />
          <div className='dropdown'>
            <p
              onClick={() => {
                logout()
              }}
            >
              Sign Out of Netflix
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
