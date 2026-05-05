import React, { useEffect, useState } from 'react'
import './MovieInfo.css'
import { useNavigate, useParams, Link } from 'react-router-dom'
import back_arrow_icon from '../../assets/back_arrow_icon.png'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmY2VmZjM0NTAxZTZlODc3MmU5ZjA3ZjAwZjU4NzE5ZiIsIm5iZiI6MTc3MjQ4NzU2MS41ODUsInN1YiI6IjY5YTYwMzg5NzMxYWIyMjgxYzI4YjM3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtJHgvIy_gA_uwSPoIqWRwi_9JeoMNLqH1KuFOcsRW0'
  }
}

const MovieInfo = () => {
  const { mediaType, id } = useParams()
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)
  const [cast, setCast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const type = mediaType === 'tv' ? 'tv' : 'movie'
    Promise.all([
      fetch(`https://api.themoviedb.org/3/${type}/${id}`, options).then(r =>
        r.json()
      ),
      fetch(`https://api.themoviedb.org/3/${type}/${id}/credits`, options).then(
        r => r.json()
      )
    ])
      .then(([details, credits]) => {
        setInfo(details)
        setCast(credits.cast ? credits.cast.slice(0, 10) : [])
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id, mediaType])

  if (loading) {
    return (
      <div className='movie-info-loading'>
        <p>Loading...</p>
      </div>
    )
  }

  if (!info) return null

  const title = info.title || info.name
  const releaseDate = (info.release_date || info.first_air_date || '').slice(
    0,
    4
  )
  const rating = info.vote_average ? info.vote_average.toFixed(1) : 'N/A'
  const runtime = info.runtime
    ? `${Math.floor(info.runtime / 60)}h ${info.runtime % 60}m`
    : info.episode_run_time?.[0]
    ? `${info.episode_run_time[0]}m / ep`
    : null

  return (
    <div className='movie-info'>
      {/* Backdrop */}
      {info.backdrop_path && (
        <div
          className='movie-info-backdrop'
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${info.backdrop_path})`
          }}
        />
      )}
      <div className='movie-info-overlay' />

      <button className='movie-info-back' onClick={() => navigate(-1)}>
        <img src={back_arrow_icon} alt='back' />
      </button>

      <div className='movie-info-content'>
        <div className='movie-info-poster-wrap'>
          {info.poster_path ? (
            <img
              className='movie-info-poster'
              src={`https://image.tmdb.org/t/p/w342${info.poster_path}`}
              alt={title}
            />
          ) : (
            <div className='movie-info-poster-placeholder' />
          )}
        </div>

        <div className='movie-info-details'>
          <h1 className='movie-info-title'>{title}</h1>

          <div className='movie-info-meta'>
            {releaseDate && <span>{releaseDate}</span>}
            {runtime && <span>{runtime}</span>}
            <span className='movie-info-rating'>★ {rating}</span>
            {info.genres?.map(g => (
              <span key={g.id} className='movie-info-genre'>
                {g.name}
              </span>
            ))}
          </div>

          {info.tagline && (
            <p className='movie-info-tagline'>"{info.tagline}"</p>
          )}

          <p className='movie-info-overview'>{info.overview}</p>

          <Link className='movie-info-watch-btn' to={`/player/${id}`}>
            ▶ Watch Trailer
          </Link>

          {cast.length > 0 && (
            <div className='movie-info-cast'>
              <h3>Cast</h3>
              <div className='cast-list'>
                {cast.map(member => (
                  <div key={member.id} className='cast-member'>
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                      />
                    ) : (
                      <div className='cast-no-img' />
                    )}
                    <p className='cast-name'>{member.name}</p>
                    <p className='cast-character'>{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieInfo
