//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Iframe from "react-iframe";
import { Redirect } from "react-router-dom";
import { useContext } from "react";
import { saduwux } from "../SF/Context";

const useStyles = makeStyles(theme => ({
   root: {
      padding: theme.spacing(3, 2)
   },
   toolbar: theme.mixins.toolbar
}));

const Reproductor = props => {
   const classes = useStyles();
   const { state: { playing, user } } = useContext(saduwux);

   if (!user.id)
      return <Redirect to="/notlogged" />;

   if (playing) {
      return (
         <Box width={1} style={{ height: "100vh" }}>
            <div className={classes.toolbar} />
            <Iframe
               url={`${window.location.origin}/api/files/${playing}?token=${localStorage.getItem('token')?.replace(/[Bb]earer /, '')}`}
               width="99.8%"
               height="92.9%"
               allow="fullscreen"
            />
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
            style={{ height: "100vh" }}
         >
            <Paper className={classes.root}>
               <Typography variant="h5" component="h3">
                  Aún no hay nada para visualizar!
               </Typography>
               <Typography component="p">
                  Te invitamos a seleccionar un archivo en la sección de
                  búsqueda.
               </Typography>
            </Paper>
         </Box>
      );
   }
};

export default Reproductor;
