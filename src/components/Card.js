import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import GroupedButtonSelector from './GroupedButtonSelector';
import youtubeDl from '../api-consumers/youtube-downloader';
import { CircularProgress } from '@material-ui/core';
import { formattedNum } from '../utils/FormattedNum';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

const useStyles = makeStyles((theme) => ({
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
    overflow: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    likesContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: theme.spacing(1, 1, 1, 1),
    },
    icon: {
        margin: theme.spacing(-0.9, 1),
        alignItems: 'center',
    },
}));

export default function MediaCard({
    title,
    description,
    imageSrc,
    formats,
    youtubeLink,
    likes,
    views,
    dislikes,
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
            <CardMedia
                className={classes.media}
                image={imageSrc}
                title={title}
            />
            <div className={classes.likesContainer}>
                <Typography justifyContent="flex-start">
                    {`${formattedNum(views)} views`}
                </Typography>
                <Typography justifyContent="flex-end" alignItems="center">
                    <ThumbUpIcon color="secondary" className={classes.icon} />
                    {formattedNum(likes)}
                    <ThumbDownIcon color="secondary" className={classes.icon} />
                    {formattedNum(dislikes)}
                </Typography>
            </div>

            <CardContent>
                <Typography gutterBottom variant="h4" component="h2">
                    {title}
                </Typography>

                <Typography
                    noWrap
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={classes.overflow}
                >
                    {description}
                </Typography>
            </CardContent>
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
