import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import GroupedButtonSelector from './GroupedButtonSelector';
import youtubeDl from '../api-consumers/youtube-downloader';
import { CircularProgress } from '@material-ui/core';

//TODO likes dislikes, views on card - maybe disable click style
const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    buttonFooter: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export default function MediaCard({
    title,
    description,
    imageSrc,
    formats,
    youtubeLink,
}) {
    const [formatId, setFormatId] = useState(formats[0].records[0].format_id);
    const [downloading, setDownloading] = useState(false);
    const [badLink, setBadLink] = useState(false);
    const classes = useStyles();
    const onMenuClick = (ev) => {
        setFormatId(ev.target.getAttribute('data-value'));
    };
    const onDownload = async (ev) => {
        setDownloading(true);
        const download = await youtubeDl
            .downloadVideo(youtubeLink, formatId)
            .catch((err) => {
                alert('could not download video =>' + err);

                return false;
            });
        setDownloading(false);
        return download && window.open(download.url);
    };
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={imageSrc}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.buttonFooter}>
                <GroupedButtonSelector
                    groupedOptions={formats}
                    onItemChange={onMenuClick}
                    selectorId={formatId}
                ></GroupedButtonSelector>
                <Button onClick={onDownload} size="large" color="secondary">
                    Download
                </Button>
                {downloading ? (
                    <CircularProgress color="secondary"></CircularProgress>
                ) : null}
            </CardActions>
            {badLink ? <Typography>Make a Selection</Typography> : null}
        </Card>
    );
}
