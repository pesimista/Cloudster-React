import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Iframe from 'react-iframe'
//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth="64"
const useStyles = makeStyles(theme => ({
	root: {
	  padding: theme.spacing(3, 2),
	},
	toolbar: theme.mixins.toolbar,
  }));

const Reproductor = (props) => {
	const classes = useStyles();

	if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />

	if(props.idReproductor){
		return(
			<Box width={1} style={{ height: '100vh' }}>
			<div className={classes.toolbar} />
			<Iframe 
				url={`http://${props.serverIp}:6969/api/files/${props.idReproductor}`}
				width="99.8%"
				height="92.9%"
				allow="fullscreen"
				/>
			</Box>
		);
	} 
	else {
		return(
			<Box textAlign="center" bgcolor="bg.main" display="flex" width={1} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
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
}

export default Reproductor;