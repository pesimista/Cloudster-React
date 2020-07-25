//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import Iframe from 'react-iframe';
import { saduwux } from '../SF/Context';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  hiden: {
    display: 'none',
  },
  toolbar: theme.mixins.toolbar,
}));
const route = window.location.origin;
// const route = window.location.hostname;

const Reproductor = () => {
  const classes = useStyles();
  const {
    state: { playing },
  } = useContext(saduwux);

  if (playing) {
    const token = localStorage.getItem('token') && localStorage.getItem('token').replace(/[Bb]earer /, '');
    return (
      <Box width={1} className='min-h100'>
        <div className="flex-column min-h100">
          <div style={{ flexGrow: '1', overflow: 'auto', width: '100%' }}>
            <Iframe
              url={`${route}/api/watch/${playing}?token=${token}`}
              height="100%"
              width="100%"
              allow="fullscreen"
              frameBorder="0"
            />
          </div>
        </div>
      </Box>
    );
  } 
  return (
    <Box
      textAlign="center"
      bgcolor="bg.main"
      display="flex"
      width={1}
      className='min-h100'
      justifyContent="center"
      alignItems="center"
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
};

export default Reproductor;
