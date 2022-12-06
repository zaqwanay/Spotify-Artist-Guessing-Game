import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import fetchFromSpotify from '../services/api'
import { Redirect } from 'react-router-dom'
import SongtoGuess from './SongToGuess/SongToGuess'
import _, { map } from 'underscore'

import { useSelector, useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Shuffler } from './util'
import './Game.css'
import { resetScore } from './scoreReducer'
import { resetLives } from './livesReducer'

export const loadArtist = () => {}

const Game = ({ storedToken, selectedGenre, numSongs, numArtists }) => {
  const [trackList, setTrackList] = useState([])
  const score = useSelector(state => state.reduxScore)
  const dispatch = useDispatch()

  if (!selectedGenre) {
    return <Redirect to='/' />
  }

  useEffect(() => {
    loadTracks(storedToken).catch(() => loadTracks(storedToken))
  }, [])

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])
  const alertUser = e => {
    e.preventDefault()
    e.returnValue = ''
  }

  const loadTracks = async storedToken => {
    const response = await fetchFromSpotify({
      token: JSON.parse(storedToken)['value'],
      endpoint: `recommendations?seed_genres=${selectedGenre}&limit=100`
    })

    const additionalTracks = response.tracks
      .filter(x => x.preview_url)
      .map(x => ({
        name: x.name,
        artistName: x.artists[0].name,
        previewUrl: x['preview_url'],
        albumArt: x['album']['images'][1]['url'],
        artistId: x.artists[0].id
      }))
    setTrackList([...additionalTracks])
  }

  function getOtherArtists (songArtistName, songArtistArt, artistName) {
    let returnArray = [{ name: songArtistName, img: songArtistArt }]

    while (numArtists > returnArray.length) {
      let tempTrack = _.uniq(trackList)
      tempTrack = _.sample(tempTrack)
      let shouldAdd = true
      for (let element of returnArray) {
        if (
          element.name === tempTrack.artistName ||
          element.img === tempTrack.albumArt
        ) {
          shouldAdd = false
        }
      }
      if (shouldAdd) {
        returnArray[returnArray.length] = {
          name: tempTrack.artistName,
          img: tempTrack.albumArt,
          artistName: tempTrack.artistName
        }
      }
    }
    return Shuffler(returnArray)
  }

  const Display = () => {
    return (
      <div>
        {trackList.slice(0, 1).map((correctTrack, i) => {
          return (
            <SongtoGuess
              key={i}
              index={i}
              songPath={correctTrack.previewUrl}
              correctArtistName={correctTrack.artistName}
              correctAlbumArt={correctTrack.albumArt}
              artistsInfo={getOtherArtists(
                correctTrack.artistName,
                correctTrack.albumArt
              )}
              loadTracks={loadTracks}
              storedToken={storedToken}
              mainArtistId={correctTrack.artistId}
              numSongs={numSongs}
            />
          )
        })}
      </div>
    )
  }
  return (
    <div className='GameHeader'>
      <Link
        className='BackHome'
        to='/'
        onClick={() => {
          dispatch(resetScore()), dispatch(resetLives())
        }}
      >
        <Button
          variant='contained'
        >
          Start New Game
        </Button>
      </Link>
      <Typography variant='h4'>Your slected genre is {selectedGenre}</Typography>
      <Typography variant='h4' id='title'></Typography>
      

      
      <Typography
        variant='h4'
        id='score'
        style={{
          color: 'white',
          borderRadius: '10px',
          padding: '2px',
          marginBottom: '20px'
        }}
      >
        {score * 100}
      </Typography>
      {trackList.length === 0 ? (
        <>
          <h1 id='searching'></h1>
          <h1 id='wheel'></h1>
        </>
      ) : (
        Display()
      )}
    </div>
  )
}

export default Game
