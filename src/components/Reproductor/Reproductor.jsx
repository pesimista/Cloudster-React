//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import Iframe from 'react-iframe';
import { saduwux } from '../SF/Context';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  hiden: {
    display: 'none',
    // position: 'absolute',
    // bottom: '0',
    // left: '51px',
    // minHeight: '40px',
    // height: '40px',
    // maxHeight: '40px',
    // width: 'calc(100% - 51px)'
  },
  toolbar: theme.mixins.toolbar,
}));
const route = window.location.hostname.replace(/(:)\d/g, '');

const Reproductor = () => {
  const classes = useStyles();
  const {
    state: { playing },
  } = useContext(saduwux);
  const location = useLocation();

  const show = location.pathname === '/reproductor';

  if (playing) {
    return (
      <Box width={1} className={`${!show ? classes.hiden : 'min-h100'}`}>
        <div className="flex-column min-h100">
          <div style={{ flexGrow: '1', overflow: 'auto', width: '100%' }}>
            <Iframe
              url={`http://${route}:1234/api/files/${playing}/watch?token=${localStorage
                .getItem('token')
                ?.replace(/[Bb]earer /, '')}`}
              height="100%"
              width="100%"
              allow="fullscreen"
              frameBorder="0"
            />
          </div>
        </div>
      </Box>
    );
  } else {
    return (
      <Box
        textAlign="center"
        bgcolor="bg.main"
        display="flex"
        width={1}
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh' }}
      >
        <Paper className={classes.root}>
          <Typography variant="h5" component="h3">
            Aún no hay nada para visualizar!
          </Typography>
          <Typography component="p">
            Te invitamos a seleccionar un archivo en la sección de búsqueda.
          </Typography>
        </Paper>
      </Box>
    );
  }
};

export default Reproductor;
