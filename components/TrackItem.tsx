import React from "react";
import { ITrack } from "@/types/track";
import styles from "../styles/TrackItem.module.scss";
import { Card, Grid, IconButton } from "@mui/material";
import { Delete, Pause, PlayArrow } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";

interface TrackItemProps {
  track: ITrack;
  active: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, active = false }) => {
  const { playTrack, setActiveTrack } = useActions();
  const play = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActiveTrack(track);
    playTrack();
  };
  const router = useRouter();
  return (
    <Card
      className={styles.track}
      onClick={() => router.push("/tracks/" + track._id)}
    >
      <IconButton onClick={play}>
        {!active ? <PlayArrow /> : <Pause />}
      </IconButton>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        width={70}
        height={70}
        src={"http://localhost:5000/" + track.picture}
        alt={track.name}
        style={{ borderRadius: 4 }}
      />
      <Grid
        container
        direction={"column"}
        style={{ width: 200, margin: "0 20px" }}
      >
        <div>{track.name}</div>
        <div style={{ fontSize: 12, color: "gray" }}>{track.artist}</div>
      </Grid>
      {active && <div>00:00 / 00:00</div>}
      <IconButton
        onClick={(e) => e.stopPropagation()}
        style={{ marginLeft: "auto" }}
      >
        <Delete />
      </IconButton>
    </Card>
  );
};

export default TrackItem;
