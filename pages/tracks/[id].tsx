import { useInput } from "@/hooks/useInput";
import MainLayout from "@/layouts/MainLayout";
import { ITrack, IComment } from "@/types/track";
import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const TrackPage = ({ serverTracks }: { serverTracks: ITrack }) => {
  const [track, setTrack] = useState(serverTracks);
  const router = useRouter();
  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/tracks/comment",
        {
          username: username.value,
          text: text.value,
          trackId: track._id,
        }
      );
      setTrack({ ...track, comments: [...track.comments, response.data] });
    } catch {
      console.log("Ошибка при добавлении комментария");
    }
  };
  const username = useInput("");
  const text = useInput("");
  return (
    <MainLayout>
      <Button
        variant="outlined"
        style={{ fontSize: 32 }}
        onClick={() => router.push("/tracks")}
      >
        К списку
      </Button>
      <Grid container style={{ margin: "10px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={"http://localhost:5000/" + track.picture}
          width={200}
          height={200}
          alt={track.name}
          style={{ borderRadius: 4 }}
        />
        <div style={{ marginLeft: 30 }}>
          <h1>Трек: {track.name}</h1>
          <h1>Исполнитель: {track.artist}</h1>
          <h1>Прослушиваний: {track.listens}</h1>
        </div>
      </Grid>
      <h1>Слова к треку</h1>
      <p>{track.text}</p>
      <h1>Комментарии:</h1>
      <Grid container style={{ margin: "20px 0" }}>
        <TextField {...username} label="Ваше имя" fullWidth />
        <TextField {...text} label="Комментарий" fullWidth multiline rows={4} />
        <Button onClick={addComment}>Отправить</Button>
      </Grid>
      <div>
        {track.comments.map((comment: IComment, index: number) => (
          <div key={index}>
            <div>Автор: {comment.username}</div>
            <div>Комментарий: {comment.text}</div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default TrackPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return { notFound: true };
  }
  const response = await axios.get("http://localhost:5000/tracks/" + params.id);
  return {
    props: {
      serverTracks: response.data,
    },
  };
};
