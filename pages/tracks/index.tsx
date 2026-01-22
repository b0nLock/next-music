import TrackList from "@/components/TrackList";
import { useTypedSelector } from "@/hooks/useTypedSelectors";
import MainLayout from "@/layouts/MainLayout";
import { NextThunkDispatch, wrapper } from "@/store";
import { fetchTracks } from "@/store/actions-creators/track";
import { Box, Button, Card, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const Index = () => {
  const router = useRouter();
  const { tracks, error } = useTypedSelector((state) => state.track);

  if (error) {
    return <MainLayout>{error}</MainLayout>;
  }

  return (
    <MainLayout>
      <Grid container justifyContent={"center"}>
        <Card style={{ width: "900px" }}>
          <Box p={3}>
            <Grid container justifyContent={"space-between"}>
              <h1>Список треков</h1>
              <Button onClick={() => router.push("tracks/create")}>
                Загрузить
              </Button>
            </Grid>
          </Box>
          <TrackList tracks={tracks} />
        </Card>
      </Grid>
    </MainLayout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async () => {
    const dispatch = store.dispatch as NextThunkDispatch;
    await dispatch(fetchTracks());
    return { props: {} };
  });
