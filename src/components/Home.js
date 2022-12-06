import React, { useEffect, useState } from "react";
import fetchFromSpotify, { request } from "../services/api";
import { Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch } from "react-redux/es/exports";
import "./Home.css";
import Game from "./Game";
import { resetScore } from "./scoreReducer";
import { useSelector } from "react-redux/es/hooks/useSelector";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [numSongs, setNumSongs] = useState(1);
  const [numArtists, setNumArtists] = useState(2);
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const score = useSelector((state) => state.reduxScore);

  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    setGenres(response.genres);
    setConfigLoading(false);
  };

  const syncSelections = () => {
    if (
      localStorage.getItem("SelectedGenre") &&
      (!selectedGenre ||
        selectedGenre !== localStorage.getItem("SelectedGenre"))
    ) {
      setSelectedGenre(localStorage.getItem("SelectedGenre"));
    }

    if (
      localStorage.getItem("numSongs") &&
      (!numSongs || numSongs !== localStorage.getItem("numSongs"))
    ) {
      setNumSongs(localStorage.getItem("numSongs"));
    }

    if (
      localStorage.getItem("numArtists") &&
      (!numArtists || numArtists !== localStorage.getItem("numArtists"))
    ) {
      setNumArtists(localStorage.getItem("numArtists"));
    }
  };

  useEffect(() => {
    setAuthLoading(true);
    syncSelections();

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);
        return;
      }
    }
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
    });
  }, [score]);

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }

  return (
   
      <div className="AllSite" style={{ backgroundColor: "orange" }}>
        <Route exact path="/">
          <Grid container spacing={2}>
            <Grid xs={7}>
              <Typography variant="h4">Spotify Artist Guessing Game</Typography>
              
            </Grid>
            <Grid xs={3} sx={{ marginTop: 10 }}>
                  <Stack className="mainform">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel>Genre</InputLabel>
                      <Select
                        value={
                          localStorage.getItem("SelectedGenre")
                            ? localStorage.getItem("SelectedGenre")
                            : selectedGenre
                        }
                        label="Genre"
                        onChange={(event) => {
                          setSelectedGenre(event.target.value);
                          localStorage.setItem(
                            "SelectedGenre",
                            event.target.value
                          );
                        }}
                        autoWidth
                      >
                        <MenuItem value="" />
                        {genres.map((genre) => (
                          <MenuItem key={genre} value={genre}>
                            {genre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel>Songs</InputLabel>
                      <Select
                        value={
                          localStorage.getItem("numSongs")
                            ? localStorage.getItem("numSongs")
                            : numSongs
                        }
                        label="Songs"
                        onChange={(event) => {
                          setNumSongs(event.target.value);
                          localStorage.setItem("numSongs", event.target.value);
                        }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel>Artists</InputLabel>
                      <Select
                        value={
                          localStorage.getItem("numArtists")
                            ? localStorage.getItem("numArtists")
                            : numArtists
                        }
                        label="Artists"
                        onChange={(event) => {
                          setNumArtists(event.target.value);
                          localStorage.setItem(
                            "numArtists",
                            event.target.value
                          );
                        }}
                      >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                      </Select>
                    </FormControl>
                    <Link to="/game" onClick={() => dispatch(resetScore)}>
                      <Button variant="contained">Let's Play!</Button>
                    </Link>
                  </Stack>
               
             
            </Grid>
          </Grid>
        </Route>
        <Route path="/game">
          <Game
            storedToken={localStorage.getItem(TOKEN_KEY)}
            selectedGenre={selectedGenre}
            numArtists={numArtists}
            numSongs={numSongs}
          />
        </Route>
      </div>
   
  );
};

export default Home;
