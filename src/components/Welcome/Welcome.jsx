import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useReducer } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { handleFetch, reactLink } from '../SF/helpers';
import { saduwux } from '../SF/Context';

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  root: {
    gridColumnStart: '1',
    gridColumnEnd: '3',

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
  form: { marginTop: theme.spacing(8) },
  appBar: {
    position: 'static',
    gridColumnStart: 1,
    gridColumnEnd: 3,
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)', //'url(' + View + ')',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? '#cecece' : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const initialState = {
  open: false,
  message: '',
  logedIn: false,
  signInUser: '',
  signInPassword: '',
  wrong: '',
  block: false,
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const Welcome = () => {
  const history = useHistory();
  const classes = useStyles();
  const {
    state: { logStatus },
  } = useContext(saduwux);

  const [state, update] = useReducer(reducer, initialState);
  const { dispatch } = useContext(saduwux);

  const invalid = () => {
    const { signInUser, signInPassword } = state;
    return !signInUser.length || signInPassword.length < 6;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (invalid()) {
      return;
    }

    const { signInUser, signInPassword } = state;
    update({ block: true });
    fetch('/api/users/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: signInUser,
        password: signInPassword,
      }),
    })
      .then(handleFetch)
      .then((data) => {
        localStorage.setItem('token', 'bearer ' + data.token);
        dispatch({ type: 'login', payload: { user: data.user } });
        update({ open: true, message: 'Inicio de sesión exitoso!' });
        setTimeout(() => history.push('/busqueda'), 500);
      })
      .catch((error) => {
        update({ open: true, message: error.message, block: false });
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    update({ open: false });
  };

  const handleChangeTrim = (e) =>
    update({ [e.target.name]: e.target.value.trim() });

  if (logStatus === 2) {
    return <Redirect to="/busqueda" />;
  } else {
    return (
      <React.Fragment>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Container maxWidth="lg" className={classes.sectionDesktop}>
              <Link component={reactLink} to="/login" underline="none">
                <Button size="large">
                  <Typography fontWeight="fontWeightBold">
                    Iniciar Sesión
                  </Typography>
                </Button>
              </Link>
              <Link component={reactLink} to="/register" underline="none">
                <Button size="large">
                  <Typography fontWeight="fontWeightBold">
                    Registrarse
                  </Typography>
                </Button>
              </Link>
            </Container>
            <div className={classes.grow} />
            <Link
              className={classes.sectionMobile}
              component={reactLink}
              to="/register"
              underline="none"
            >
              <Button size="large">
                <Typography fontWeight="fontWeightBold">Registrarse</Typography>
              </Button>
            </Link>
          </Toolbar>
        </AppBar>

        <Grid container component="main" className={classes.root}>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div>
              <Box color="secondary.main" className={classes.form}>
                <CloudIcon color="primary" fontSize="inherit" />
                Cloudster
              </Box>
              <Typography variant="h4">
                Una forma sencilla de compartir tus archivos sin limites de
                plataforma.
              </Typography>
              <Box display={{ xs: 'block', sm: 'none' }}>
                <Link component={reactLink} to="/login" underline="none">
                  <Button size="large" color="primary" variant="contained">
                    Iniciar Sesión
                  </Button>
                </Link>
              </Box>
            </div>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <form onSubmit={handleLogin}>
                <Container maxWidth={'xs'}>
                  <TextField
                    name="signInUser"
                    value={state.signInUser}
                    onChange={handleChangeTrim}
                    id="username"
                    label="Nombre de usuario"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    disabled={state.block}
                  />
                  <TextField
                    name="signInPassword"
                    value={state.signInPassword}
                    onChange={handleChangeTrim}
                    id="password"
                    label="Contraseña"
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="password"
                    disabled={state.block}
                  />
                  <Button
                    disabled={state.block || invalid()}
                    className={classes.submit}
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                  >
                    Iniciar Sesión
                  </Button>
                  <Link component={reactLink} to="/recover" color="secondary">
                    Olvidé mi contraseña
                  </Link>
                </Container>
              </form>
            </Box>
          </Grid>
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={state.open}
          onClose={handleClose}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            {state.message}
          </Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
};
export default Welcome;
