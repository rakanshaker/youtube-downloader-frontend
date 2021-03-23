import { useState } from "react";

import youtubeDl from "./api-consumers/youtube-downloader";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TextField,
  Button,
  Radio,
} from "@material-ui/core";

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

function App() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [selectedFormatId, setSelectedFormatId] = useState("");

  const handleSelect = (ev) => {
    const formatId = ev.target.id;

    setSelectedFormatId(formatId);
  };

  const renderFormats = formats
    .filter(
      (format) =>
        format.acodec != "none" && !format.format.includes("audio only")
    )
    .map((item, index) => {
      return (
        <TableRow key={index}>
          <TableCell>
            <Radio
              onClick={handleSelect}
              size="small"
              id={item.format_id}
              checked={selectedFormatId === item.format_id}
            />
          </TableCell>
          <TableCell id="extension"> {item.ext} </TableCell>
          <TableCell id="size"> {`${item.filesize} MB`} </TableCell>
          <TableCell id="resolution"> {item.format_note} </TableCell>
        </TableRow>

        /* // <div key={index}>
      //   <input
      //     type="radio"
      //     name="format"
      //     onClick={handleSelect}
      //     id={item.format_id}
      //   />
      //   <label>{`${item.ext} at resolution ${item.format_note}`}</label>
      // </div> */
      );
    });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const vidFormats = await youtubeDl.getFormats(youtubeLink).catch((err) => {
      console.log("could not fetch formats due to =>", err);
      return [];
    });
    console.log(vidFormats);
    setFormats(vidFormats);
  };

  const handleInput = (ev) => {
    setYoutubeLink(ev.target.value);
  };

  const handleDownloadClick = async () => {
    try {
      const download = await youtubeDl.downloadVideo(
        youtubeLink,
        selectedFormatId
      );
      window.open(download.url);
    } catch (err) {
      console.log("could not download =>", err);
    }
  };
  const classes = useStyles();
  return (
    <div className="App">
      <Typography variant="h4" className={classes.root}>
        Youtube Downloader
      </Typography>
      <Typography variant="body1">Download Youtube Videos for Free</Typography>
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

      <div className={classes.formats}>
        <TableBody>{renderFormats}</TableBody>
      </div>
      <Button
        variant="contained"
        color="secondary"
        className={classes.buttonDownload}
        onClick={handleDownloadClick}
      >
        Download
      </Button>
    </div>
  );
}

export default App;
