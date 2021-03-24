import { getAllQueryParameter } from "../utils/url";
import axios from "axios";

const BASE_URL = "https://api.tubecurl.com/youtube-video/";
//https://api.tubecurl.com/youtube-video/2bWP8H123EA?download=true

const getYoutubeId = (link) => {
  const params = getAllQueryParameter(link);
  const id = params.v;
  console.log(id);
  if (!id) {
    throw new Error("no id in url");
  }
  return id;
};

const grabResourceByUrl = async (restUrlPath) => {
  try {
    let response = await axios.get(restUrlPath);
    const data = response.data;
    return data;
  } catch (err) {
    return err;
  }
};

const youtubeDl = {
  getFormats: async (link) => {
    const id = getYoutubeId(link);
    // const url = `${BASE_URL}${id}`; needs to deploy still
    const url = BASE_URL + id + "/formats";
    return grabResourceByUrl(url);
  },
  downloadVideo: async (link, formatId) => {
    const id = getYoutubeId(link);
    console.log(formatId);
    if (!formatId) {
      throw new Error("Your format id is not provided");
    }
    //needs to deploy still
    const url = `${BASE_URL}${id}?download=true`;
    return grabResourceByUrl(url);
  },
};

export default youtubeDl;
