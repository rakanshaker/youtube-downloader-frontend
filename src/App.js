import { useState } from "react";
import youtubeDl from "./api-consumers/youtube-downloader";
import "./App.css";

function App() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [formats, setFormats] = useState([]);
  const [selectedFormatId, setSelectedFormatId] = useState("");

  const handleSelect = (ev) => {
    const formatId = ev.target.id;

    setSelectedFormatId(formatId);
  };

  const renderFormats = formats.map((item, index) => {
    return (
      <div key={index}>
        <input
          type="radio"
          name="format"
          onClick={handleSelect}
          id={item.format_id}
        />
        <label>{`${item.ext} at resolution ${item.format_note}`}</label>
      </div>
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
  return (
    <div className="App">
      <h2>Youtube Downloader</h2>
      <p>Download Youtube Videos for Free</p>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleInput} />
        <input type="submit" />
      </form>

      <div className="formats">{renderFormats}</div>
      <button onClick={handleDownloadClick}>Download</button>
    </div>
  );
}

export default App;
