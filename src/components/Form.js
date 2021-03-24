import { useState } from "react";

import youtubeDl from "../api-consumers/youtube-downloader";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(6, 0, 3),
    textAlign: "center",
  },
  form: {
    margin: theme.spacing(2, 0, 3),
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
  buttonConvert: {
    height: theme.spacing(6),
    margin: theme.spacing(0, 1),
  },
  input: {
    height: theme.spacing(6),
    width: theme.spacing(50),
  },
  formats: {
    display: "flex",
    justifyContent: "center",
  },
  buttonDownload: {
    justifySelf: "center",
  },
}));

const Form = ({ onChange, ytlink }) => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [formats, setFormats] = useState([]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const vidFormats = await youtubeDl.getFormats(youtubeLink).catch((err) => {
      console.log("could not fetch formats due to =>", err);
      return [];
    });
    console.log(vidFormats);
    setFormats(vidFormats);
    onChange(vidFormats);
  };

  const handleInput = (ev) => {
    setYoutubeLink(ev.target.value);
  };
  const classes = useStyles();
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        className={classes.input}
        id="outlined-secondary"
        label="Paste Your Link Here"
        variant="outlined"
        color="secondary"
        type="text"
        onChange={handleInput}
      />
      <Button
        variant="contained"
        color="secondary"
        className={classes.buttonConvert}
        type="submit"
      >
        Get Link
      </Button>
    </form>
  );
};

export default Form;
