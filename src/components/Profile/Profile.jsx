import React from 'react';
import { Redirect } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
//import { Link, Avatar, makeStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, Divider, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme=> ({
	card: {
	  minWidth: 275,
	},
	bullet: {
	  display: 'inline-block',
	  margin: '0 2px',
	  transform: 'scale(0.8)',
	},
	title: {
	  fontSize: 14,
	},
	pos: {
	  marginBottom: 12,
  },
  avatar: {
    backgroundColor: green[500],
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  }));

const Link1 = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const Profile = (props) => {
  const { nombre, nivel, desde, usuario } = props.user;
	const classes = useStyles();

  if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />

	return(
      <Box display="flex" width={1} textAlign="center" bgcolor="bg.main" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Card className={classes.card}>
          <CardHeader
            title="Perfil"
          />
          <Divider />
          <CardContent>
            <Typography variant="h3" className={classes.asd} gutterBottom>
              {usuario}
            </Typography>
            <Box display='flex' justifyContent='center'>
            <Avatar className={classes.avatar}>{nivel}</Avatar>
            </Box>
            <Typography className={classes.pos} color="textSecondary">
              Nivel de jerarquía
            </Typography>
            <Divider/>
            <Typography component={'span'} >
              <Box>
                {nombre}
              </Box>
              <Box>
                Miembro desde: {desde}
              </Box>
            </Typography>
            <Divider/>
          </CardContent>
          <CardActions>
            <Box mx="auto">
              <Link component={Link1} to='/Configuracion' underline='none'>
              <Button variant="contained" color="primary">Configuración</Button>
              </Link>
            </Box>
          </CardActions>
        </Card>
    </Box>
	);
}

export default Profile;