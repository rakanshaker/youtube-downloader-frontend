import { useState } from 'react';

import youtubeDl from './api-consumers/youtube-downloader';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import {
    Typography,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
} from '@material-ui/core';
import MediaCard from './components/Card';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(6, 3, 3),
        textAlign: 'center',
    },
    form: {
        margin: theme.spacing(2, 0, 3),
        display: 'flex',
        justifyContent: 'center',
        paddingRight: '0px',
    },
    buttonConvert: {
        height: 56,
    },
    input: {
        height: theme.spacing(6),
        width: theme.spacing(50),
        paddingRight: '0px',
        justifySelf: 'center',
        border: '1px',
    },
    thumbnail: {
        height: '400px',
    },
    formats: {
        display: 'flex',
        justifyContent: 'center',
    },
    buttonDownload: {
        justifySelf: 'center',
    },
    gridContainer: {
        textAlign: 'center',
        justifyContent: 'space-around',
    },
    endAdornment: {
        paddingRight: 1,
    },
    spinner: {
        margin: '10px',
    },
}));

function App() {
    const [youtubeLink, setYoutubeLink] = useState('');
    const [formats, setFormats] = useState([]);
    const [videoProfile, setVideoProfile] = useState({});
    const [toggleMenu, setToggleMenu] = useState(false);
    const [thumbnail, setThumbnail] = useState('');
    const [badLink, setBadLink] = useState(false);
    const [loading, setLoading] = useState(false);

    const organizeFormats = (formats = []) => {
        let video = formats.filter(
            (val) => val.vcodec && val.vcodec != 'none' && val.asr
        );
        let audio = formats.filter(
            (val) => !(val.vcodec && val.vcodec != 'none')
        );
        let videoOnly = formats.filter(
            (val) => val.vcodec && val.vcodec != 'none' && !val.asr
        );
        return [
            {
                groupName: 'video',
                records: video,
            },
            {
                groupName: 'audio',
                records: audio,
            },
            {
                groupName: 'video only',
                records: videoOnly,
            },
        ];
    };

    const handleSubmit = async (ev) => {
        setToggleMenu(false);
        setLoading(true);
        ev.preventDefault();

        let [vidFormats, profile] = await Promise.all([
            youtubeDl.getFormats(youtubeLink),
            youtubeDl.getProfiles(youtubeLink),
        ]).catch((err) => {
            console.log('could not fetch formats due to =>', err);
            return [];
        });
        setLoading(false);
        if (profile) {
            vidFormats = organizeFormats(vidFormats);
            setFormats(vidFormats);
            setVideoProfile(profile);
            setToggleMenu(true);
            setThumbnail(profile.thumnail_url);
        } else {
            setBadLink(!badLink);
            setTimeout(() => {
                setBadLink((badLink) => !badLink);
            }, 2000);
        }
    };

    const handleInput = (ev) => {
        setYoutubeLink(ev.target.value);
    };

    const classes = useStyles();
    const endAdornment = {
        endAdornment: (
            <InputAdornment className={classes.adornment} position="end">
                <Button
                    color="secondary"
                    className={classes.buttonConvert}
                    type="submit"
                >
                    Get Link
                </Button>
            </InputAdornment>
        ),
        classes: {
            adornedEnd: classes.endAdornment,
        },
    };
    return (
        <div className={classes.root}>
            <Typography variant="h4">Youtube Downloader</Typography>
            <Typography variant="body1">
                Download Youtube Videos for Free
            </Typography>

            <form className={classes.form} onSubmit={handleSubmit} id="form">
                {/* <Grid container className={classes.gridContainer}>
                    <Grid item xs={12} sm={9}> */}
                <TextField
                    className={classes.input}
                    id="outlined-secondary"
                    label="Paste Your Link Here"
                    variant="outlined"
                    color="secondary"
                    type="text"
                    onChange={handleInput}
                    InputProps={endAdornment}
                />
                {/* </Grid>
                    <Grid item xs={12} sm={3}> */}

                {/* </Grid>
                </Grid> */}
            </form>
            {loading ? (
                <div className={classes.spinner}>
                    <CircularProgress color="secondary"></CircularProgress>
                </div>
            ) : null}
            {badLink ? <Typography>not a valid link</Typography> : null}
            <div className={classes.formats}>
                {toggleMenu ? (
                    <MediaCard
                        title={videoProfile.title}
                        description={videoProfile.description}
                        imageSrc={videoProfile.thumnail_url}
                        formats={formats}
                        youtubeLink={youtubeLink}
                    ></MediaCard>
                ) : null}
            </div>
        </div>
    );
}

export default App;
