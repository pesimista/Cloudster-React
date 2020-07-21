import { Snackbar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloudIcon from '@material-ui/icons/Cloud';
import React, { useContext, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch, structuteChecker, reactLink } from '../SF/helpers';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import backgroundimg1 from '../SF/Media/background_study_by_hibelton_dc28kuo-fullview.jpg'
import backgroundimg2 from '../SF/Media/late_in_the_afternoon_by_itsendy_ddy13pr-fullview.jpg'
import backgroundimg3 from '../SF/Media/meteors_by_itsendy_ddxgt2k-fullview.jpg'
import backgroundimg4 from '../SF/Media/dawn_by_itsendy_ddwkses-fullview.jpg'

const useStyles = makeStyles((theme) => ({
  main: {
    gridColumnStart: '1',
    gridColumnEnd: '3',
    gridRowStart: '1',
    gridRowEnd: '3',
    display: 'flex',
    placeContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${backgroundimg1})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? '#cecece' : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  pdd: {
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const initialState = {
  open: false,
  message: '',
  activeStep: 0,
  nombre: '',
  apellido: '',
  user: '',
  userExist: false,
  password: '',
  password2: '',
  pregunta1: 1,
  pregunta2: 2,
  respuesta1: '',
  respuesta2: '',
  questions: [],
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const Register = () => {
  let history = useHistory();
  const classes = useStyles();

  const [state, update] = useReducer(reducer, initialState);
  const { dispatch } = useContext(saduwux);

  const questions = [
    { id: '1', pregunta: 'Cuál es el nombre de tu mejor amigo?' },
    { id: '2', pregunta: 'Cuál es la ciudad donde naciste?' },
    { id: '3', pregunta: 'Cómo se llamaba tu primera mascota?' },
    { id: '4', pregunta: 'Cuál es tu color favorito?' },
    { id: '5', pregunta: 'Cuál es el segundo nombre de tu madre?' },
  ];

  const handleRegister = () => {
    const keys = [
      { name: 'nombre', required: true, type: 'string', length: 2 },
      { name: 'apellido', required: true, type: 'string', length: 2 },
      { name: 'password', required: true, type: 'string', length: 6 },
      { name: 'user', required: true, type: 'string', length: 6 },
      { name: 'pregunta1', required: true, type: 'number' },
      { name: 'pregunta2', required: true, type: 'number' },
      { name: 'respuesta1', required: true, type: 'string', length: 3 },
      { name: 'respuesta2', required: true, type: 'string', length: 3 },
    ];

    if (!structuteChecker(state, keys)) return;

    fetch('http://localhost:1234/api/users', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: state.nombre.trim(),
        apellido: state.apellido.trim(),
        password: state.password,
        usuario: state.user.trim(),
        pregunta1: state.pregunta1,
        pregunta2: state.pregunta2,
        respuesta1: state.respuesta1.trim(),
        respuesta2: state.respuesta2.trim(),
      }),
    })
      .then(handleFetch)
      .then((data) => {
        dispatch({ type: 'login', payload: { user: data.user } });
        localStorage.setItem('token', 'bearer ' + data.token);
        update({
          userExist: false,
        });

        setTimeout(() => {
          history.push('/busqueda');
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        update({ activeStep: 2, open: true, message: err.message });
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    update({ open: false });
  };

  const steps = [
    'Nombres y Contraseña',
    'Preguntas Secretas',
    'Nombre de usuario',
  ];
  const handleNext = () => update({ activeStep: state.activeStep + 1 });
  const handleBack = () => update({ activeStep: state.activeStep - 1 });
  const handleClick = () =>
    state.activeStep < 2 ? handleNext() : handleRegister();

  const handleChange = (e) => {
    if (state.userExist && e.target.name === 'user') {
      update({ userExist: false, user: e.target.value });
    } else update({ [e.target.name]: e.target.value });
  };

  const mapPreguntas = questions.map((item) => {
    return (
      <MenuItem key={item.id} value={item.id}>
        {' '}
        {item.pregunta}{' '}
      </MenuItem>
    );
  });

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="nombre"
                value={state.nombre}
                id="nombre"
                label="Nombre"
                variant="outlined"
                helperText="El nombre debe contener al menos 2 catacteres"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="apellido"
                value={state.apellido}
                id="apellido"
                label="Apellido"
                variant="outlined"
                helperText="El apellido debe contener al menos 2 catacteres"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="password"
                value={state.password}
                type="password"
                id="password"
                label="Contraseña"
                variant="outlined"
                helperText="La contraseña debe contener al menos 6 catacteres"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="password2"
                value={state.password2}
                type="password"
                id="password2"
                label="Confirmar contraseña"
                variant="outlined"
                fullWidth
                error={
                  state.password2.length > 2 &&
                  state.password !== state.password2
                }
                helperText={
                  state.password2.length > 2 &&
                  state.password !== state.password2
                    ? 'Las contraseñas no coinciden'
                    : ' '
                }
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-select-currency"
                select
                onChange={handleChange}
                name="pregunta1"
                helperText={
                  state.pregunta1 === state.pregunta2
                    ? 'Las preguntas no pueden ser iguales'
                    : ''
                }
                error={state.pregunta1 === state.pregunta2}
                value={state.pregunta1}
                label="Primera pregunta"
                variant="outlined"
                fullWidth
              >
                {mapPreguntas}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="respuesta1"
                value={state.respuesta1}
                id="outlined-basic"
                label="Respuesta"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-select-currency"
                select
                label="Segunda pregunta"
                onChange={handleChange}
                name="pregunta2"
                helperText={
                  state.pregunta1 === state.pregunta2
                    ? 'Las preguntas no pueden ser iguales'
                    : ''
                }
                error={state.pregunta1 === state.pregunta2}
                value={state.pregunta2}
                variant="outlined"
                fullWidth
              >
                {mapPreguntas}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                name="respuesta2"
                value={state.respuesta2}
                id="outlined-basic"
                label="Respuesta"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid item xs={12} md={6}>
            <TextField
              onChange={handleChange}
              name="user"
              value={state.user}
              helperText={
                state.userExist ? 'El nombre de usuario ya existe' : ' '
              }
              error={state.userExist}
              id="outlined-basic"
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
            />
          </Grid>
        );
      default:
        return 'Paso no existente';
    }
  };
  return (
    <Box className={classes.main} component="main" >
      <Container maxWidth="lg">
      <Paper square elevation={0} className={classes.pdd}>
        <Box textAlign="center">
          <Link component={reactLink} to="/">
            <IconButton>
              <CloudIcon color="primary" style={{ fontSize: '4rem' }} />
            </IconButton>
          </Link>
          <Typography component="h1" variant="h5">
            Registrarse
          </Typography>
        </Box>
        </Paper>
        <Stepper activeStep={state.activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography component={'span'}>
                  {getStepContent(index)}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    disabled={state.activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Volver
                  </Button>
                  <Button
                    disabled={
                      (index === 0 &&
                        (state.nombre.length < 2 ||
                          state.apellido.length < 2 ||
                          state.password.length < 6 ||
                          state.password !== state.password2)) ||
                      (index === 1 &&
                        (state.respuesta1.length < 3 ||
                          state.respuesta2.length < 3)) ||
                      (index === 2 && state.user.length < 3)
                    }
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    className={classes.button}
                  >
                    {state.activeStep === steps.length - 1
                      ? 'Registrarse'
                      : 'Siguiente'}
                  </Button>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <Box>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={state.open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              {state.message}
            </Alert>
          </Snackbar>
        </Box>
        <Paper square elevation={0} className={classes.pdd}>
          <Typography>Ya tienes cuenta?</Typography>
          <Link component={reactLink} to="/login">
            <Button className={classes.button}>Inicia Sesión!</Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
