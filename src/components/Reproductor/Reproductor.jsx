//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import Iframe from "react-iframe";
import { saduwux } from "../SF/Context";

const useStyles = makeStyles(theme => ({
   root: {
      padding: theme.spacing(3, 2)
   },
   toolbar: theme.mixins.toolbar
}));

const Reproductor = props => {
   const classes = useStyles();
   const { state: { playing } } = useContext(saduwux);

   // if (!user.id)
   //    return <Redirect to="/notlogged" />;

   console.log('Rendering');

   if (playing) {
      return (
         <Box width={1} style={{ height: "100vh" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }} >

               <div className={classes.toolbar} />
               <div style={{ flexGrow: "1", overflow: "auto", width: "100%" }}>
                  <Iframe
                     url={`http://localhost:1234/api/files/${playing}/watch?token=${localStorage.getItem('token')?.replace(/[Bb]earer /, '')}`}
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
