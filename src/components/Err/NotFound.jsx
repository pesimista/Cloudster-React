import React from 'react';
//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import backgroundimg1 from '../SF/Media/background_study_by_hibelton_dc28kuo-fullview.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    gridColumnStart: '1',
    gridColumnEnd: '3',
    gridRowStart: '1',
    gridRowEnd: '3',
    backgroundImage: `url(${backgroundimg1})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [theme.breakpoints.down('xs')]: {
      gridColumnStart: '1',
      gridColumnEnd: '2',
      gridRowStart: '1',
      gridRowEnd: '4',
      
    },
    '& .MuiPaper-root': {
      padding: theme.spacing(3, 2)
    }
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Box
      textAlign="center"
      display="flex"
      width={1}
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      <Paper>
        <Typography variant="h5" component="h3">
          Lo sentimos!
        </Typography>
        <Typography component="p">
          La página que estás buscando no existe.
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotFound;
