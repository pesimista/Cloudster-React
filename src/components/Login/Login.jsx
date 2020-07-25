import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import md5 from 'md5';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useReducer } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch, reactLink } from '../SF/helpers';
import backgroundimg1 from '../SF/Media/background_study_by_hibelton_dc28kuo-fullview.jpg';

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

    [theme.breakpoints.down('xs')]: {
      gridColumnStart: '1',
      gridColumnEnd: '2',
      gridRowStart: '1',
      gridRowEnd: '4',
      '& .MuiCard-root': {
        maxWidth: 'calc(100vw - 30px)',
        padding: '1rem'
      }
    },

    '& button': {
      padding: '0.5rem 1rem',
      fontWeight: '600',
      margin: '0.25rem 0px',
      '&.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
    '& .MuiIconButton-root': {
      padding: 0,
    },
    '& .forgot': {
      width: '100%',
      textAlign: 'center',
      color: 'rgba(0,0,0,0.7)',
      marginTop: '0.5rem',
      display: 'inline-block'
    }
  },
  box: {
    padding: '1rem 3rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    maxWidth: '400px',
  },
  form: {
    marginTop: '0.5rem',
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
  },
}));

const pattern = {
  username: new RegExp('^[A-Z0-9]*$', 'i'),
}

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

/**
 * updates the state
 * @param {initialState} value The new value to assign to the state
 */
const initialState = {
  open: false,
  message: '',
  username: '',
  password: '',
  isLoading: false,
  severity: 'success',
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const Login = () => {
  const history = useHistory();
  const classes = useStyles();
  const [state, update] = useReducer(reducer, initialState);
  const { state: global, dispatch } = useContext(saduwux);

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

  if (global.logStatus === 2 && !state.isLoading) {
    return (
      <Redirect to="/busqueda"/>
    );
  }

  const invalid = () => {
    const { username, password } = state;
    return username.length < 3|| password.length < 6;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (invalid()) {
      return;
    }

    const { username, password } = state;
    update({ isLoading: true });
    fetch('/api/users/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: username,
        password: md5(password),
      }),
    })
      .then(handleFetch)
      .then((data) => {
        localStorage.setItem('token', 'bearer ' + data.token);
        dispatch({
          type: 'login',
          payload: {
            user: data.user,
          },
        });
        update({
          open: true,
          message: 'Inicio de sesión exitoso!',
          severity: 'success',
        });
        setTimeout(() => history.push('/busqueda'), 500);
      })
      .catch((error) => {
        update({
          open: true,
          message: error.message,
          isLoading: false,
          severity: 'error',
        });
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    update({ open: false });
  };

  const handleInput = ({ target }) => {
    if(!pattern[target.id] || target.value.trim().match(pattern[target.id])){
      update({ [target.id]: target.value.trim() });
    }
  };

  return (
    <Box component="main" className={classes.main}>
      <Card className={classes.box}>
        <CardContent className="center">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <IconButton>
              <CloudIcon color="primary" style={{ fontSize: '4rem' }} />
            </IconButton>
            <Typography color="secondary" component="h2" variant="h4">
              Cloudster
            </Typography>
            <Typography component="h6" variant="h6">
              Inicia Sesión
            </Typography>
          </Box>
          <Divider />
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleLogin}
          >
            <Box>
              <TextField
                value={state.username}
                onChange={handleInput}
                id="username"
                label="Nombre de usuario"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                autoFocus
                disabled={state.isLoading}
              />
              <TextField
                value={state.password}
                onChange={handleInput}
                id="password"
                label="Contraseña"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="password"
                disabled={state.isLoading}
              />
            </Box>
            <Button
              disabled={state.isLoading || invalid()}
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
            >
              Iniciar Sesión
            </Button>
            <Link to="/register" style={{ width: '100%' }} component={reactLink}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                color="secondary"
                type="button"
              >
                Registrarse
              </Button>
            </Link>
            <Link
              component={reactLink}
              to="/recover"
              className="forgot"
            >
              Olvidé mi contraseña
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
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert onClose={handleClose} severity={state.severity}>
          {state.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
