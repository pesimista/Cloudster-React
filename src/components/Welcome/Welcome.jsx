import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from "@material-ui/core/Link";
//import { Link, AppBar, Toolbar, Typography, Button, Container, Box, makeStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import WifiIcon from '@material-ui/icons/Wifi';
import Image from 'material-ui-image';
import React, { useContext } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import View from "../SF/Media/intropag.png";

const useStyles = makeStyles(() => ({
   appBar: { top: 'auto' }
}));

const reactLink = React.forwardRef(
   (props, ref) => <RouterLink innerRef={ref} {...props} />
);
reactLink.displayName = 'reactLink';

const Welcome = () => {
   const classes = useStyles();
   const { state: { logStatus } } = useContext(saduwux);
   
   if (logStatus === 2) {
      return <Redirect to='/busqueda' />
   } else return (
      <Box bgcolor="bg.main" width={1}>
         <AppBar position="static">
            <Toolbar>
               <Container maxWidth='lg'>
                  <Link component={reactLink} to='/login' underline='none'>
                     <Button
                        size="large">
                        <Box color="white.main" fontWeight="fontWeightBold">Iniciar Sesión</Box>
                     </Button>
                  </Link>
                  <Link component={reactLink} to='/register' underline='none'>
                     <Button
                        size="large">
                        <Box color="white.main" fontWeight="fontWeightBold">Registrarse</Box>
                     </Button>
                  </Link>
               </Container>
            </Toolbar>
         </AppBar>
         <Box color="white.main" component="span" m={1}>
            <Typography component={'span'} align="center">
               <Box
                  color="secondary.main"
                  fontSize="h2.fontSize"
                  fontWeight="fontWeightBold"
                  lineHeight={2}>
                  <WifiIcon
                     color='primary'
                     fontSize="inherit"
                  />
              Cloudster
            </Box>
               <Box fontSize="h4.fontSize">Una forma sencilla de compartir tus archivos sin limites de plataforma.</Box>
            </Typography>
         </Box>
         <Container>
            <Image
               src={View}
               aspectRatio={(17 / 9)}
               disableSpinner
            />
         </Container>
         <AppBar color="primary" className={classes.appBar}>
            <Toolbar>
            </Toolbar>
         </AppBar>
      </Box>
   )
}
export default Welcome;
