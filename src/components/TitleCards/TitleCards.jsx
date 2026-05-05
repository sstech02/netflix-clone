import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2VmZjM0NTAxZTZlODc3MmU5ZjA3ZjAwZjU4NzE5ZiIsIm5iZiI6MTc3MjQ4NzU2MS41ODUsInN1YiI6IjY5YTYwMzg5NzMxYWIyMjgxYzI4YjM3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtJHgvIy_gA_uwSPoIqWRwi_9JeoMNLqH1KuFOcsRW0'
  }
}

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([])
  const cardsRef = useRef()

  const handleWheel = event => {
    event.preventDefault()
    cardsRef.current.scrollLeft += event.deltaY
  }

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : 'now_playing'
      }`,
      options
    )
      .then(response => response.json())
      .then(response => setApiData(response.results || []))
      .catch(err => console.error(err))

    const cardsElement = cardsRef.current
    cardsElement?.addEventListener('wheel', handleWheel)

    return () => {
      cardsElement?.removeEventListener('wheel', handleWheel)
    }
  }, [category])
  return (
    <div className='title-cards'>
      <h2>{title ? title : 'Popular on Netflix'}</h2>
      <div className='card-list' ref={cardsRef}>
        {apiData.map(card => {
          const mediaType = card.media_type || 'movie'
          return (
            <Link
              to={`/title/${mediaType}/${card.id}`}
              className='card'
              key={card.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path}
                alt=''
              />
              <p>{card.original_title || card.title || card.name}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards
