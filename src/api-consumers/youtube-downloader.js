import { getAllQueryParameter, getLastParam } from '../utils/url';
import axios from 'axios';

const BASE_URL = 'https://api.tubecurl.com/youtube-video/';

const getYoutubeId = (link) => {
    if (link.indexOf('youtu.be')>=0){
        let id = getLastParam(link)
        console.log(id);
        if (!id) {
            throw new Error('no id in url');
        }
        console.log(id);
        return getLastParam(link);
    }
    const params = getAllQueryParameter(link);
    const id = params.v;
    if (!id) {
        throw new Error('no id in url');
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
        const url = BASE_URL + id + '/formats';
        return grabResourceByUrl(url);
    },
    getProfiles: async (link) => {
        const id = getYoutubeId(link);
        const url = BASE_URL + id + '/details';
        return grabResourceByUrl(url);
    },
    downloadVideo: async (link, formatId) => {
        const id = getYoutubeId(link);
        console.log(formatId);
        if (!formatId) {
            throw new Error('Your format id is not provided');
        }
        const url = `${BASE_URL}${id}?format_id=${formatId}`;
        return grabResourceByUrl(url);
    },
};

export default youtubeDl;
