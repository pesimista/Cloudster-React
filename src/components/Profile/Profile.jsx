import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { green } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
//import { Link, Avatar, makeStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, Divider, Box } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { saduwux } from "../SF/Context";

const useStyles = makeStyles(theme => ({
   card: { minWidth: 275 },
   title: { fontSize: 14 },
   pos: { marginBottom: 12 },
   avatar: { backgroundColor: green[500] },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      padding: theme.spacing(3)
   },
   bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
   }
}));

const reactLink = React.forwardRef((props, ref) => (
   <RouterLink innerRef={ref} {...props} />
));

const Profile = props => {
   const classes = useStyles();

   // const { nombre, nivel, desde, usuario } = props.user;
   const {
      state: { user }
   } = useContext(saduwux);

   if (!user.id)
      return <Redirect to="/notlogged" />;

   return (
      <Box
         display="flex"
         width={1}
         textAlign="center"
         bgcolor="bg.main"
         justifyContent="center"
         alignItems="center"
         style={{ height: "100vh" }}
      >
         <Card className={classes.card}>
            <CardHeader title="Perfil" />
            <Divider />
            <CardContent>
               <Typography variant="h3" className={classes.asd} gutterBottom>
                  {user.usuario}
               </Typography>
               <Box display="flex" justifyContent="center">
                  <Avatar className={classes.avatar}>{user.nivel}</Avatar>
               </Box>
               <Typography className={classes.pos} color="textSecondary">
                  Nivel de jerarquía
               </Typography>
               <Divider />
               <Typography component={"span"}>
                  <Box>{`${user.nombre} ${user.apellido}`}</Box>
                  <Box>Miembro desde: {user.desde}</Box>
               </Typography>
               <Divider />
            </CardContent>
            <CardActions>
               <Box mx="auto">
                  <Link
                     component={reactLink}
                     to="/configuracion"
                     underline="none"
                  >
                     <Button variant="contained" color="primary">
                        Configuración
                     </Button>
                  </Link>
               </Box>
            </CardActions>
         </Card>
      </Box>
   );
};

export default Profile;
