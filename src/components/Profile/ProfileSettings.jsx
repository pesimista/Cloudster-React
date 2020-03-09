import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
//import { makeStyles, Typography, Box, Tabs, Tab, Container, TextField, MenuItem, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTab-wrapper': {
			justifyContent: "flex-start",
			flexDirection: "row",
		},
		'& .MuiTextField-root': {
			margin: theme.spacing(0.5),
			width: 350,
		},
		'& .MuiTab-root': {
			borderBottom: `1px solid ${theme.palette.divider}`
		},
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		height: '50%',
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
	},
}));

const questions = [
	{ Id: "1", pregunta: "Cuál es el nombre de tu mejor amigo?" },
	{ Id: "2", pregunta: "Cuál es la ciudad donde naciste?" },
	{ Id: "3", pregunta: "Cómo se llamaba tu primera mascota?" },
	{ Id: "4", pregunta: "Cuál es tu color favorito?" },
	{ Id: "5", pregunta: "Cuál es el segundo nombre de tu madre?" }
];

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

const ProfileSettings = (props) => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const [nombre, updateNombre] = React.useState('');
	const [apellido, updateApellido] = React.useState('');
	const [password0, updatePassword0] = React.useState('');
	const [password, updatePassword] = React.useState('');
	const [password2, updatePassword2] = React.useState('');
	const [pregunta1, updatePregunta1] = React.useState(1);
	const [pregunta2, updatePregunta2] = React.useState(2);
	const [respuesta1, updateRespuesta1] = React.useState('');
	const [respuesta2, updateRespuesta2] = React.useState('');

	const handleUpdateProfile = () => {
		fetch('http://localhost:6969/api/update', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: props.user.id,
				nombre: nombre,
				apellido: apellido
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.response === 'Grant access') {
					localStorage.setItem("user", JSON.stringify(data.user));
					props.history.push('search');
				}
				else {
					alert(data.response);
				}
			})
			.catch(err => console.log("ERROR", err));
	};

	const handleUpdatePassword = () => {
		fetch('http://localhost:6969/api/update', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: props.user.id,
				currentpassword: password0,
				password: password,
				confirmpassword: password2
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.response === 'Grant access') {
					localStorage.setItem("user", JSON.stringify(data.user));
					props.history.push('search');
				}
				else {
					alert(data.response);
				}
			})
			.catch(err => console.log("ERROR", err));
	};
	const handleUpdateQuestions = () => {
		fetch('http://localhost:6969/api/update', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: props.user.id,
				password: password,
				pregunta1: pregunta1,
				pregunta2: pregunta2,
				respuesta1: respuesta1,
				respuesta2: respuesta2,
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.response === 'Grant access') {
					localStorage.setItem("user", JSON.stringify(data.user));
					props.history.push('search');
				}
				else {
					alert(data.response);
				}
			})
			.catch(err => console.log("ERROR", err));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const mapPreguntas = questions.map((P, index) => {
		return <MenuItem key={index} value={P.Id}> {P.pregunta} </MenuItem>
	});

	if (!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />

	return (
		<Box textAlign="center" width={1} display="flex" bgcolor="bg.main" alignItems="center" style={{ height: '100vh' }}>
			<Container maxWidth="md" className={classes.root} >
				<Tabs
					orientation="vertical"
					variant="fullWidth"
					value={value}
					indicatorColor='primary'
					onChange={handleChange}
					aria-label="Vertical tabs example"
					className={classes.tabs}
				>
					<Tab label="Perfil" {...a11yProps(0)} />
					<Tab label="Contraseña" {...a11yProps(1)} />
					<Tab label="Preguntas Secretas" {...a11yProps(2)} />
				</Tabs>
				<Typography>
					<TabPanel value={value} index={0}>
						<div>
							<TextField onChange={(e) => updateNombre(e.target.value)} defaultValue="Diego" id="outlined-basic" label="Nombre" variant="outlined" />
						</div>
						<div>
							<TextField onChange={(e) => updateApellido(e.target.value)} defaultValue="Lopez" id="outlined-basic" label="Apellido" variant="outlined" />
						</div>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							onClick={handleUpdateProfile}
						> Guardar
					</Button>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<TextField onChange={(e) => updatePassword0(e.target.value)} id="outlined-password-input" label="Contraseña actual" variant="outlined" />
						<Box>
							<TextField onChange={(e) => updatePassword(e.target.value)} id="outlined-password-input" label="Nueva contraseña" variant="outlined" />
						</Box>
						<Box>
							<TextField onChange={(e) => updatePassword2(e.target.value)} error={(password2.length > 6) && (password !== password2)} id="outlined-password-input" label="Confirmar nueva contraseña" variant="outlined" />
						</Box>
						<Button
							variant="contained"
							color="primary"
							className={classes.button}
							onClick={handleUpdatePassword}
						> Guardar
					</Button>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Box >
							<Box>
								<TextField
									id="outlined-select-currency"
									select
									label="Primera pregunta"
									value={pregunta1}
									onChange={(e) => { updatePregunta1(e.target.value) }}
									variant="outlined"
								>
									{mapPreguntas}
								</TextField>
								<Box>
									<TextField onChange={(e) => updateRespuesta1(e.target.value)} id="outlined-basic" value={respuesta1} label="Respuesta " variant="outlined" />
								</Box>
							</Box>
							<Box>
								<TextField
									id="outlined-select-currency"
									select
									label="Segunda pregunta"
									value={pregunta2}
									onChange={(e) => { updatePregunta2(e.target.value) }}
									variant="outlined"
								>
									{mapPreguntas}
								</TextField>
								<Box>
									<TextField onChange={(e) => updateRespuesta2(e.target.value)} id="outlined-basic" value={respuesta2} label="Respuesta " variant="outlined" />
								</Box>
							</Box>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={handleUpdateQuestions}
							> Guardar
						</Button>
						</Box>
					</TabPanel>
				</Typography>
			</Container>
		</Box>
	);
}

export default ProfileSettings;