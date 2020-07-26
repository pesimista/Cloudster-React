import { Snackbar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import md5 from 'md5';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Step from '@material-ui/core/Step';
import Divider from '@material-ui/core/Divider';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloudIcon from '@material-ui/icons/Cloud';
import React, { useReducer } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { handleFetch, structuteChecker, reactLink } from '../SF/helpers';
import MuiAlert from '@material-ui/lab/Alert';
import backgroundimg1 from '../SF/Media/background_study_by_hibelton_dc28kuo-fullview.jpg';
import { saduwux } from '../SF/Context';

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

    '& .MuiIconButton-root': {
      padding: 0,
    },
    '& .MuiFormControl-root':{
      margin: '0.5rem',
    },
    '& .MuiGrid-container': {
      width: '550px',
    },
    '& .MuiGrid-item': {
      padding: '0.5rem',
    },
    '& .MuiFormHelperText-root': {
      margin: '0',
    },
    '& .forgot': {
      width: '100%',
      textAlign: 'center',
      color: 'rgba(0,0,0,0.7)',
      marginTop: '0.5rem',
      display: 'inline-block'
    },
    [theme.breakpoints.down('xs')]: {
      gridColumnStart: '1',
      gridColumnEnd: '2',
      gridRowStart: '1',
      gridRowEnd: '4',
      '& .MuiCard-root': {
        maxWidth: 'calc(100vw - 10px)',
        padding: '1rem'
      },
      '& .MuiGrid-container': {
        width: '275px',
      },
      '& .MuiFormControl-root':{
        margin: '0.5rem 0px',
      },
      '& .MuiCardContent-root': {
        padding: 0
      }
    },
  },
  instructions: {
    width: '275px'
  },
  form: {
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  box: {
    padding: '1rem 3rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    maxWidth: '100%',
  },
  bottonContainer: {
    marginTop: '1rem',
    display: 'flex',
    placeContent: 'space-between',

    '& button': {
      padding: '0.5rem 1rem',
      fontWeight: '600',

      '&.MuiButton-containedPrimary': {
        color: '#fff',
      },
      '&.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },
}));

const pattern = {
  user: new RegExp('^[A-Z0-9]*$', 'i'),
  nombre: new RegExp(`^[A-Z'\\s]*$`, 'i'),
  apellido: new RegExp(`^[A-Z'\\s]*$`, 'i'),
  respuesta1: new RegExp(`^[A-Z'0-9\\s]*$`, 'i'),
  respuesta2: new RegExp(`^[A-Z'0-9\\s]*$`, 'i')
}

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
  touched: false,
  isLoading: false,
  severity: 'success'
};

const reducer = (state, action) => {
  if (action) {
    return { ...state, ...action };
  }

  switch (state.activeStep) {
    case 3: {
      return {
        ...state,
        user: '',
        userExist: false,
        touched: true,
        activeStep: 2,
      };
    }
    case 2: {
      return {
        ...state,
        pregunta1: 1,
        pregunta2: 2,
        respuesta1: '',
        respuesta2: '',
        touched: true,
        activeStep: 1,
      };
    }
    case 1: {
      return {
        ...state,
        touched: true,
        nombre: '',
        apellido: '',
        password: '',
        password2: '',
        activeStep: 0,
      };
    }
    default:
      return initialState;
  }
};
const Register = () => {
  let history = useHistory();
  const classes = useStyles();

  const [state, update] = useReducer(reducer, initialState);
  const { state: global, dispatch } = React.useContext(saduwux);

  React.useEffect(() => {
    if(global.logStatus !== 2){
      localStorage.clear();
      dispatch({
        type: 'update',
        payload: {
          logStatus: 0,
          theme: false
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (global.logStatus === 2) {
    return (
      <Redirect to="/busqueda"/>
    );
  }

  const invalid = () => {
    if (!state.touched || state.isLoading) {
      return true;
    }
    switch (state.activeStep) {
      case 0: {
        const { nombre, apellido, password, password2 } = state;
        return nombre.trim().length < 2
          || apellido.trim().length < 2
          || password.length < 6
          || password !== password2;
      }
      case 1: {
        const { pregunta1, pregunta2, respuesta1, respuesta2 } = state;
        return respuesta1.trim().length < 3
          || respuesta2.trim().length < 3
          || pregunta1 === pregunta2;
      }
      case 2: {
        const { user } = state;
        return (user.length < 6);
      }
      default:
        break;
    }
  };

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

    if (!structuteChecker(state, keys)) {
      return;
    }

    update({ isLoading: true });

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: state.nombre.trim(),
        apellido: state.apellido.trim(),
        password: md5(state.password.replace(/\s+/g, '')),
        usuario: state.user.replace(/\s+/g, ''),
        pregunta1: state.pregunta1,
        pregunta2: state.pregunta2,
        respuesta1: state.respuesta1.trim(),
        respuesta2: state.respuesta2.trim(),
      }),
    })
      .then(handleFetch)
      .then((data) => {
        update({
          open: true,
          message: data.message,
          severity: 'success'
        });
        setTimeout(() => {
          history.push('/login');
        }, 1500);
      })
      .catch((err) => {
        update({
          activeStep: 2,
          open: true,
          userExist: err.code === 6,
          severity: 'error',
          message: err.message,
          isLoading: false,
          touched: false
        });
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
  const handleNext = (e) => {
    e.preventDefault();
    if (invalid()) {
      return;
    }
    if (state.activeStep === 2) {
      handleRegister()
      return;
    }
    update({
      activeStep: state.activeStep + 1
    });
  }
  const handleBack = () => update();

  const handleChange = (event) => {
    const { target } = event; 
    if(!pattern[target.name] || target.value.trim().match(pattern[target.name])) {
      update({
        [target.name]: target.value,
        touched: true
      });
    }
  };
  const handleChangeTrim = ({ target }) => {
    if(!pattern[target.name] || target.value.trim().match(pattern[target.name])) {
      update({
        [target.name]: target.value.replace(/\s+/g, ''),
        userExist: target.name === 'user' ? false : state.userExist,
        touched: true
      });
    }

  }
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
      case 0: {
        return (
          <Grid container >
            <Grid item xs={12} sm={6}>
              <TextField
                required
                onChange={handleChange}
                name="nombre"
                value={state.nombre}
                id="nombre"
                label="Nombre"
                variant="outlined"
                helperText="El nombre debe contener al menos 2 catacteres"
                fullWidth
                inputProps={{
                  maxLength: 32
                }}
              />
              <TextField
                required
                onChange={handleChange}
                name="apellido"
                value={state.apellido}
                id="apellido"
                label="Apellido"
                variant="outlined"
                helperText="El apellido debe contener al menos 2 catacteres"
                fullWidth
                inputProps={{
                  maxLength: 32
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                onChange={handleChangeTrim}
                name="password"
                value={state.password}
                type="password"
                id="password"
                label="Contraseña"
                variant="outlined"
                helperText="La contraseña debe contener al menos 6 catacteres"
                fullWidth
                inputProps={{
                  maxLength: 16
                }}
              />
              <TextField
                required
                onChange={handleChangeTrim}
                name="password2"
                value={state.password2}
                type="password"
                id="password2"
                label="Confirmar contraseña"
                variant="outlined"
                fullWidth
                inputProps={{
                  maxLength: 16
                }}
                error={
                  state.password2.length > 2 &&
                  state.password !== state.password2}
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
      }
      case 1:
        return (
          <Grid container>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
              <TextField
                required
                onChange={handleChange}
                name="respuesta1"
                value={state.respuesta1}
                id="outlined-basic"
                label="Respuesta"
                variant="outlined"
                fullWidth
                inputProps={{
                  maxLength: 32
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
              <TextField
                required
                onChange={handleChange}
                name="respuesta2"
                value={state.respuesta2}
                id="outlined-basic"
                label="Respuesta"
                variant="outlined"
                fullWidth
                inputProps={{
                  maxLength: 32
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box className={classes.instructions}>
            <TextField
              onChange={handleChangeTrim}
              name="user"
              disabled={state.isLoading}
              value={state.user}
              helperText={
                state.userExist ? 
                'El nombre de usuario ya existe' :
                'Tu usuario debe contener al menos 6 catacteres'
              }
              error={state.userExist}
              id="outlined-basic"
              label="Nombre de usuario"
              variant="outlined"
              fullWidth
              inputProps={{
                maxLength: 16
              }}
            />
          </Box>
        );
      default:
        return 'Paso no existente';
    }
  };
  return (
    <Box className={classes.main} component="main">
      <Card className={classes.box}>
      <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Link to="/" component={reactLink}>
              <IconButton>
                <CloudIcon color="primary" style={{ fontSize: '4rem' }} />
              </IconButton>
            </Link>
            <Typography color="secondary" component="h2" variant="h4">
              Cloudster
            </Typography>
            <Typography component="h6" variant="h6">
              Registrar nuevo usuario
            </Typography>
          </Box>
          <Stepper
            activeStep={state.activeStep}
            style={{ padding: '0px 0px 24px' }}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider/>
          <form
            autoComplete="off"
            className={classes.form}
            onSubmit={handleNext}
          >

            <Box>
              {getStepContent(state.activeStep)}
            </Box>

            <Box width={1} className={classes.bottonContainer}>
              <Button
                disabled={!state.activeStep || state.isLoading}
                onClick={handleBack}
                className={classes.button}
                type="button"
                variant="outlined"
              >
                Volver
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={invalid()}
                type="submit"
              >
                {state.activeStep === steps.length - 1
                  ? 'Aceptar'
                  : 'Siguiente'}
              </Button>
            </Box>
            <Link
              component={reactLink}
              to="/login"
              className="forgot"
            >
              ¿Ya tienes cuenta? ¡Inicia Sesión!
            </Link>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={state.severity}>
          {state.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
