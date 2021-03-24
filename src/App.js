import { useState } from "react";

import youtubeDl from "./api-consumers/youtube-downloader";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Button,
  Radio,
} from "@material-ui/core";
import Form from "./components/Form";

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

const App = () => {
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
        format.acodec !== "none" && !format.format.includes("audio only")
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
  const handleChange = (childState) => {
    setFormats(childState);
    console.log(childState);
    console.log(formats);
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
      <Form onChange={handleChange} />

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
};

export default App;
