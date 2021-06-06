import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import GroupedButtonSelector from './GroupedButtonSelector';
import youtubeDl from '../api-consumers/youtube-downloader';
import { CircularProgress, Modal } from '@material-ui/core';
import { formattedNum } from '../utils/FormattedNum';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import FileSaver from 'file-saver';

import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DeviceDetector from "device-detector-js";

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
    actionsBar: {
        display: 'flex',
        justifyContent: 'center'

    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

}));

const DialogTitle = (({ children, classes, onClose }) => {
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>

            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>

        </MuiDialogTitle>
    );
});


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
    const [downloadResponse, setDownloadLink] = useState({})
    const classes = useStyles();
    const rootRef = React.useRef(null);
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
        setDownloadLink(download);

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
                    Generate Link
                </Button>
                {downloading ? (
                    <CircularProgress color="secondary"></CircularProgress>
                ) : null}
            </CardActions>


            <Dialog
                open={!!downloadResponse.url}
                onClose={() => setDownloadLink({})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" classes={classes} onClose={() => setDownloadLink({})}>Download Link Generated</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        If you're on iPhone (safari) hold the link and choose the option Download Linked File.
                        <br></br>
                        <br></br>
                        Note this is not a long term link , it will expire in 15 minutes.
          </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.actionsBar}>
                    <a download={downloadResponse.url ? downloadResponse.url.split('?')[0].split('/').pop() : ''} href={downloadResponse.url} onTouchDown={(ev) => {
                        const link = ev.target.parentElement;

                        ev.preventDefault();
                        console.log('calling fileSaver',link.download);
                        FileSaver.saveAs(link.href, link)
                    }} ><Typography>Download</Typography></a>
                </DialogActions>
            </Dialog>




            {badLink ? <Typography>Make a Selection</Typography> : null}
        </Card>
    );
}
