import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import React, { useContext, useReducer } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch, reactLink } from '../SF/helpers';
import backgroundimg1 from '../SF/Media/background_study_by_hibelton_dc28kuo-fullview.jpg'

const useStyles = makeStyles((theme) => ({
  main: {
    gridColumnStart: '1',
    gridColumnEnd: '3',
    gridRowStart: '1',
    gridRowEnd: '3',
    backgroundColor: 'cyan',
    display: 'flex',
    placeContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: 'auto',
    backgroundImage: `url(${backgroundimg1})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? '#cecece' : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  box: {
    padding: '1rem 3rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    maxWidth: '100%',
  },
  form: {
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginRight: theme.spacing(1),
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
  instructions: {
    maxWidth: '75%',
  },
  mRight: {
    flexGrow: 1,
  },
}));

const initialState = {
  activeStep: 0,
  touched: false,
  isLoading: false,
  user: '',
  id: '',
  pregunta1: '',
  pregunta2: '',
  respuesta1: '',
  respuesta2: '',
  password: '',
  password2: '',
};
const reducer = (state, action) => {
  if (action) {
    return { ...state, ...action };
  }

  switch (state.activeStep) {
    case 2: {
      return {
        ...state,
        password: '',
        password2: '',
        touched: true,
        activeStep: 1,
      };
    }
    case 1: {
      return {
        ...state,
        pregunta1: '',
        pregunta2: '',
        respuesta1: '',
        respuesta2: '',
        touched: true,
        activeStep: 0,
      };
    }
    default:
      return initialState;
  }
};

const Recover = () => {
  const classes = useStyles();
  const steps = ['Usuario', 'Preguntas', 'Contraseña'];
  const history = useHistory();

  const [state, update] = useReducer(reducer, initialState);
  const { dispatch } = useContext(saduwux);

  const invalid = () => {
    if (!state.touched || state.isLoading) {
      return true;
    }
    switch (state.activeStep) {
      case 0: {
        const { user } = state;
        return !user.length;
      }
      case 1: {
        const { respuesta1, respuesta2 } = state;
        return !respuesta1.trim().length || !respuesta2.trim().length;
      }
      case 2: {
        const { password, password2 } = state;
        return (
          password.length < 6 || password2.length < 6 || password !== password2
        );
      }
      default:
        break;
    }
  };

  const handleUsername = () => {
    update({ isLoading: true });
    fetch(`/api/users/${state.user}/questions`)
      .then(handleFetch)
      .then(({ usuario, id_usuario, pregunta1, pregunta2 }) => {
        update({
          user: usuario.trim(),
          id_usuario: id_usuario.trim(),
          pregunta1: pregunta1,
          pregunta2: pregunta2,
          activeStep: 1,
          touched: false,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
        update({
          touched: false,
          isLoading: false,
        });
      });
  };

  const handleQuestions = () => {
    update({ isLoading: true });
    const headers = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        respuesta1: state.respuesta1,
        respuesta2: state.respuesta2,
      }),
    };

    fetch(`/api/users/${state.id_usuario}/questions`, headers)
      .then(handleFetch)
      .then((data) => {
        localStorage.setItem('token', 'bearer ' + data.token);
        update({
          activeStep: 2,
          touched: false,
          isLoading: false,
        });
      })
      .catch((e) => {
        alert(e);
        update({
          touched: false,
          isLoading: false,
        });
      });
  };

  const changePassword = () => {
    update({ isLoading: true });
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ password: state.password }),
    };

    fetch(`/api/users/${state.id_usuario}`, headers)
      .then(handleFetch)
      .then((data) => {
        dispatch({
          type: 'login',
          payload: { user: data.user },
        });
        localStorage.setItem('token', 'bearer ' + data.token);
        history.push('/busqueda');
      })
      .catch((err) => {
        console.log('ERROR', err);
        update({ touched: false, isLoading: false });
      });
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (invalid()) {
      return;
    }
    switch (state.activeStep) {
      case 2: {
        changePassword();
        break;
      }
      case 1: {
        handleQuestions();
        break;
      }
      default: {
        handleUsername();
        break;
      }
    }
  };

  const handleBack = () => update();

  const handleChange = (e) =>
    update({ [e.target.name]: e.target.value, touched: true });
  const handleChangeTrim = (e) =>
    update({ [e.target.name]: e.target.value.trim(), touched: true });

  /** @param {number} step */
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            name="user"
            value={state.user}
            onChange={handleChangeTrim}
            id="standard-name"
            label="Nombre de usuario"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
          />
        );
      case 1:
        return (
          <Box>
            <TextField
              name="respuesta1"
              value={state.respuesta1}
              onChange={handleChange}
              id="respuesta1"
              label="Respuesta #1"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              helperText={state.pregunta1}
            />
            <TextField
              name="respuesta2"
              value={state.respuesta2}
              onChange={handleChange}
              id="respuesta2"
              label="Respuesta #2"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              helperText={state.pregunta2}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              name="password"
              value={state.password}
              onChange={handleChangeTrim}
              id="password-input"
              label="Nueva contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
            />
            <TextField
              name="password2"
              value={state.password2}
              onChange={handleChangeTrim}
              id="password-confirm-input"
              label="Confirmar contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
          </Box>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <Box className={classes.main}>
      <Container component="main" maxWidth="sm">
        <Box
          className={classes.box}
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Link to="/" component={reactLink}>
            <IconButton>
              <CloudIcon color="primary" style={{ fontSize: '4rem' }} />
            </IconButton>
          </Link>
          <Typography component="h1" variant="h5">
            Recuperar Contraseña
          </Typography>
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
          <Divider />
          <form autoComplete="off" className={classes.form} onSubmit={handleNext}>
            <div className={classes.instructions}>
              {getStepContent(state.activeStep)}
            </div>

            <Box width={1} className={classes.bottonContainer}>
              <Button
                disabled={!state.activeStep || state.isLoading}
                onClick={handleBack}
                className={classes.backButton}
                type="button"
              >
                &lt; Volver
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={invalid()}
                type="submit"
              >
                {state.activeStep === steps.length - 1 ? 'Aceptar' : 'Siguiente'}
              </Button>
            </Box>
          </form>
          <Divider style={{margin: '10px'}} />
          <Grid container justify="space-between">
            <Grid item >
              <Link component={reactLink} to="/login" color="secondary">
                Volver a inicio de sesión
              </Link>
            </Grid>
            <Grid item>
              <Link component={reactLink} to="/register">
                Registrarse
              </Link>
            </Grid>
          </Grid>
        </Box>
        
      </Container>
    </Box>
  );
};

export default withRouter(Recover);
