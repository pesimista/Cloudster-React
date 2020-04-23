import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const reactLink = React.forwardRef((props, ref) =>
	<RouterLink innerRef={ref} {...props} />
);
reactLink.displayName = 'reactLink';

const useStyles = makeStyles({
	card: { minWidth: 275 },
	title: { fontSize: 14 },
	pos: { marginBottom: 12 },
	grow: { flexGrow: 1 },
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
});

const RequireLogin = () => {
	const classes = useStyles();
	return (
		<Box
			textAlign="center"
			bgcolor="bg.main"
			display="flex"
			width={1}
			justifyContent="center"
			alignItems="center"
			style={{ minHeight: '100vh' }}>
			<Card className={classes.card}>
				<CardContent>
					<Typography variant="h5" component="h2">
						Lo sentimos!
					</Typography>
					<Typography variant="body2" component="p">
						Debes iniciar sesión para visitar esta página.
					</Typography>
				</CardContent>
				<CardActions>
					<Link component={reactLink} to='/login' underline='none'>
						<Box fontWeight="fontWeightBold">Inicia Sesión</Box>
					</Link>
					<div className={classes.grow} />
					<Link component={reactLink} to='/register' underline='none'>
						<Box fontWeight="fontWeightBold">Registrarte</Box>
					</Link>
				</CardActions>
			</Card>
		</Box>
	)
}

export default RequireLogin;