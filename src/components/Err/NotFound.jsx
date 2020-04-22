import React from 'react';
//import { makeStyles, Box, Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: { padding: theme.spacing(3, 2) },
}));

const NotFound = () => {
	const classes = useStyles();

	return (
		<Box textAlign="center"
			bgcolor="bg.main"
			display="flex"
			width={1}
			justifyContent="center"
			alignItems="center"
			style={{ minHeight: '100vh' }}>
			<Paper className={classes.root}>
				<Typography variant="h5" component="h3">
					Lo sentimos!
				</Typography>
				<Typography component="p">
					La página que estás buscando no existe.
				</Typography>
			</Paper>
		</Box>
	)
}

export default NotFound;