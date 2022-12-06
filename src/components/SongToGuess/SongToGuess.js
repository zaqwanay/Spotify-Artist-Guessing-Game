import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Shuffler } from "../util.js";

import ArtistInfo from "../ArtistInfo/ArtistInfo.js";
import ReactHowler from "react-howler";
import "./SongToGuess.css";
import { useDispatch, useSelector } from "react-redux";
import { incrementScore, resetScore } from "../scoreReducer.js";
import fetchFromSpotify from "../../services/api.js";
import { decrementLives, resetLives } from "../livesReducer.js";
import { withTheme } from "styled-components";
import { orange } from "@mui/material/colors"

const SongtoGuess = ({
  artistsInfo,
  correctAlbumArt,
  loadTracks,
  storedToken,
  mainArtistId,
  correctArtistName,
  numSongs,
}) => {
  const lives = useSelector((state) => state.reduxLives);
  const [playing, setPlaying] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [previewUrlAmount, setPreviewUrlAmount] = useState("");
  const [state, setState] = useState({
    currentSrcIndex: 0,
    playing: false,
  });
  const [mainArtistAdditionalTracks, setMainArtistAdditionalTracks] = useState([
    "null",
  ]);
  let outOfLives = false;
  const dispatch = useDispatch();

  useEffect(async () => {
    if (correctAnswer === true) {
      await loadTracks(storedToken).catch(() => loadTracks(storedToken));
    }
  }, [correctAnswer]);

  useEffect(() => {
    const getTopSongs = async (storedToken, mainArtistId) => {
      const response = await fetchFromSpotify({
        token: JSON.parse(storedToken)["value"],
        endpoint: `artists/${mainArtistId}/top-tracks?market=US`,
      });

      const additionalTracks = response.tracks
        .filter((x) => x.preview_url)
        .filter((x) => x.artists[0].name === correctArtistName);

      setPreviewUrlAmount(additionalTracks.length);
      setMainArtistAdditionalTracks(
        Shuffler([
          ...additionalTracks.map((x) => ({
            name: x.name,
            artistName: x.artists[0].name,
            previewUrl: x["preview_url"],
            albumArt: x["album"]["images"][1]["url"],
            artistId: x.artists[0].id,
          })),
        ])
      );
    };

    getTopSongs(storedToken, mainArtistId).catch((error) =>
      getTopSongs(storedToken, mainArtistId)
    );

    switch (numSongs) {
      case 3:
        if (previewUrlAmount < 3) {
          loadTracks(storedToken).catch(() => loadTracks(storedToken));
          console.log(`case 3 -----------------***********************
            
            asdf
            asdf
            asdf
            `);
        }
        break;
      case 2:
        if (previewUrlAmount < 2) {
          loadTracks(storedToken).catch(() => loadTracks(storedToken));
          console.log(`case 2 -----------------***********************
            
            asdf
            asdf
            asdf
            `);

          loadTracks(storedToken).catch(() => loadTracks(storedToken));
        }
        break;
      case 1:
        if (previewUrlAmount < 1) {
          loadTracks(storedToken).catch(() => loadTracks(storedToken));
          console.log(`case 1 -----------------***********************
            
            asdf
            asdf
            asdf
            `);

          loadTracks(storedToken).catch(() => loadTracks(storedToken));
        }
        break;
    }
  }, []);

  let sources = ["null"];

  if (mainArtistAdditionalTracks.length > 1) {
    sources = [];
    for (let i = 0; i < numSongs; i++) {
      sources[i] = [mainArtistAdditionalTracks[i]["previewUrl"]];
    }
  }

  const handleSwap = () => {
    if (lives > 0) {
      const nextIndex =
        state.currentSrcIndex < sources.length - 1
          ? state.currentSrcIndex + 1
          : state.currentSrcIndex - state.currentSrcIndex;
      setState({ currentSrcIndex: nextIndex });
    }
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleClose = () => {
    if (lives <= 0) {
      outOfLives = false;
      dispatch(resetScore());
      dispatch(resetLives());
      return <Redirect to="/"></Redirect>;
    }
    setCorrectAnswer(false);
    getTopSongs(storedToken, mainArtistId);
  };

  const handleCorrect = (target) => {
    if (target.path[2]["className"] === "DefaultButton" && lives > 0) {
      target.path[2]["className"] = "RightButton";
      setCorrectAnswer(true);
      dispatch(incrementScore());
    }
  };

  const handleIncorrect = (target) => {
    if (lives <= 0) {
      outOfLives = true;
    } else if (target.path[2]["className"] === "DefaultButton" && lives > 0) {
      target.path[2]["className"] = "WrongButton";
      target.path[2]["disabled"] = true;
      dispatch(decrementLives());
    }
  };

  if (lives <= 0) {
    outOfLives = true;
  }

  const DisplayPlayer = () => {
    return (
      <div className="HowlerButtons">
        <ReactHowler
          playing={playing}
          src={sources[state.currentSrcIndex]}
          format={["mp3"]}
          volume={0.1}
        />
        {numSongs > 1 ? (
          <div className="NextSong">
            <Button className="full" onClick={handleSwap}>
              Listen to a different track!
            </Button>
            <p
              style={{
                fontFamily: "cursive",
                color: "orange",
                borderRadius: "5px",
                padding: "2px",
              }}
            >
              Now playing your selected track {state.currentSrcIndex + 1}
            </p>
            <br />
          </div>
        ) : (
          <div></div>
        )}
        <div className="PlayPause">
          <Button onClick={handlePlay}>Play</Button>
          <Button onClick={handlePause}>Pause</Button>
        </div>
        <div>
        <Typography variant="h4" p>
        {numSongs < 2 ? "Guess the artist!" : "Guess the artist!"}
      </Typography>
        </div>
      </div>
    );
  };

  return (
    <div
      className="AllElements"
      unselectable="on"
    >
      <Typography variant="h5">{"Guesses left: " + lives}</Typography>
     

      {mainArtistAdditionalTracks.length === 0 ? (
        <div>{"Loading..."}</div>
      ) : (
        DisplayPlayer()
      )}
      <div></div>
      <div className="ArtistElements">
        {artistsInfo.map((e, i) => {
          return e.img === correctAlbumArt ? (
            <button
              disabled={false}
              className="DefaultButton"
              key={e.name + i}
              onClick={() => {
                handleCorrect(event);
              }}
            >
              <ArtistInfo name={correctArtistName} img={e.img} />
            </button>
          ) : (
            <button
              className="DefaultButton"
              key={e.name + i}
              onClick={() => {
                handleIncorrect(event);
              }}
            >
              <ArtistInfo name={e.artistName} img={e.img} />
            </button>
          );
        })}
      </div>
      <div>
        {correctAnswer ? (
          <Dialog open={correctAnswer} onClose={handleClose} value={lives}>
            <DialogContent>
              <DialogTitle>{"Correct Answer!"}</DialogTitle>
              <DialogContentText>Good job!</DialogContentText>
            </DialogContent>
            <DialogActions>
              {mainArtistAdditionalTracks.length > 1 ? (
                <Button onClick={handleClose}>Next Song!</Button>
              ) : (
                <div>loading...</div>
              )}

              <Link to="/">
                <Button onClick={handleClose} autoFocus>
                  Back to Home
                </Button>
              </Link>
            </DialogActions>
          </Dialog>
        ) : (
          ""
        )}
      </div>
      <div>
        {outOfLives
          ? (console.log("Out of Guesses"),
            (
              <Dialog open={outOfLives} onClose={handleClose} value={lives}>
                <DialogContent>
                  <DialogTitle>{"Game Over!"}</DialogTitle>
                  <DialogContentText>You are out of guesses!</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Link to="/">
                    <Button onClick={handleClose} autoFocus>
                      Play Again?
                    </Button>
                  </Link>
                </DialogActions>
              </Dialog>
            ))
          : ""}
      </div>
    </div>
  );
};

export default SongtoGuess;
