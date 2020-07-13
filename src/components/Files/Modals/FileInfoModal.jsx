import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { getIcon } from '../../SF/helpers';
import { makeStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme) => ({
  image: { width: 164, height: 164 },
  paperMod: {
    padding: theme.spacing(2),
    paddingTop: 0,
    margin: 'auto',
    maxWidth: 700,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const FileInfoModal = ({ file, handleClose, open }) => {
  const classes = useStyles();
  const date = new Date(file.lastModified || file.birthtime).toLocaleString(
    'es-VE'
  );
  if (!file) return '';
  else
    return (
      <Dialog
        open={open}
        className={classes.modal}
        onClose={() => handleClose()}
      >
        <DialogTitle id="file-dialog-title" style={{ textAlign: 'center' }}>
          Información del archivo
        </DialogTitle>
        {/*-------------------------GRID----------------------------*/}
        <Paper className={classes.paperMod}>
          <Grid container spacing={2}>
            <Grid item>
              <div className={classes.image}>
                <img
                  src={getIcon(file.isFile, file.ext)}
                  alt={file.ext}
                  width="164"
                  height="164"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="row" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Nombre:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {file.name}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" color="textSecondary">
                    Subido por:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {file.upBy}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Última modificación:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {date}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Tamaño:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {file.size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nivel
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {file.nivel}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    );
};

export default FileInfoModal;
