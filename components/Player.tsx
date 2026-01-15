import { IconButton, Grid } from "@mui/material";
import styles from "../styles/Player.module.scss";
import { Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import TrackProgress from "./TrackProgress";
import { useActions } from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelectors";
import { useEffect, useRef, useCallback } from "react";

const Player = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { pause, volume, active, duration, currentTime } = useTypedSelector(
    (state) => state.player
  );
  const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration } =
    useActions();

  const setAudio = useCallback(() => {
    const audio = audioRef.current;
    if (active && audio) {
      audio.src = "http://localhost:5000/" + active.audio;
    }
  }, [active]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setDuration(Math.ceil(audio.duration));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(Math.ceil(audio.currentTime));
    };

    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [setDuration, setCurrentTime]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (pause) {
      playTrack();
      audio.play();
    } else {
      pauseTrack();
      audio.pause();
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    setAudio();
  }, [active, setAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (pause) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [pause]);

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Number(e.target.value) / 100;
    }
    setVolume(Number(e.target.value));
  };

  const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
    }
    setCurrentTime(Number(e.target.value));
  };

  if (!active) {
    return null;
  }

  return (
    <div className={styles.player}>
      <IconButton onClick={play}>
        {pause ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Grid
        container
        direction={"column"}
        style={{ width: 200, margin: "0 20px" }}
      >
        <div>{active?.name}</div>
        <div style={{ fontSize: 12, color: "gray" }}>{active?.artist}</div>
      </Grid>
      <TrackProgress
        left={currentTime}
        right={duration}
        onChange={changeCurrentTime}
      />
      <VolumeUp style={{ marginLeft: "auto" }} />
      <TrackProgress left={volume} right={100} onChange={changeVolume} />
    </div>
  );
};

export default Player;
