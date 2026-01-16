import FileUpload from "@/components/FileUpload";
import StepWrapper from "@/components/StepWrapper";
import { useInput } from "@/hooks/useInput";
import MainLayout from "@/layouts/MainLayout";
import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const Create = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const router = useRouter();

  const name = useInput("");
  const artist = useInput("");
  const text = useInput("");

  const next = () => {
    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    } else {
      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("artist", artist.value);
      formData.append("text", text.value);
      if (picture) {
        formData.append("picture", picture);
      }
      if (audio) {
        formData.append("audio", audio);
      }
      axios
        .post("http://localhost:5000/tracks", formData)
        .then(() => router.push("/tracks"))
        .catch((e) => console.log(e));
    }
  };
  const back = () => {
    setActiveStep((prev) => prev - 1);
  };
  return (
    <MainLayout>
      <StepWrapper activeStep={activeStep}>
        {activeStep === 0 && (
          <Grid container direction={"column"} style={{ padding: 20 }}>
            <TextField
              {...name}
              style={{ marginTop: 10 }}
              label="Название трека"
            />
            <TextField
              {...artist}
              style={{ marginTop: 10 }}
              label="Имя исполнителя"
            />
            <TextField
              {...text}
              style={{ marginTop: 10 }}
              label="Слова к треку"
              multiline
              rows={3}
            />
          </Grid>
        )}
        {activeStep === 1 && (
          <FileUpload setFile={setPicture} accept="image/*">
            <Button>Загрузить обложку</Button>
          </FileUpload>
        )}
        {activeStep === 2 && (
          <FileUpload setFile={setAudio} accept="audio/*">
            <Button>Загрузить трек</Button>
          </FileUpload>
        )}
      </StepWrapper>
      <Grid container justifyContent={"space-between"}>
        <Button disabled={activeStep < 1} onClick={back}>
          Назад
        </Button>
        <Button disabled={activeStep > 2} onClick={next}>
          Далее
        </Button>
      </Grid>
    </MainLayout>
  );
};

export default Create;
