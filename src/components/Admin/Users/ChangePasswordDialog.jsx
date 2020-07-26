import React from 'react';
import { useReducer, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { saduwux } from '../../SF/Context';
import md5 from 'md5';

const useStyles = makeStyles((theme) => ({
  paperMod: {
    padding: '0px 1.5rem 1rem',
    margin: 'auto',
    minWidth: '340px',
    [theme.breakpoints.down('xs')]: {
      minWidth: '100%'
    },
    '& p': {
      color: 'red',
      '&:empty': {
        height: '16px',
      },
    },
    '& .MuiFormControl-root': {
      height: '80px',
    },
  },
  darkFocused: {
    '& .Mui-focused':{
      color: 'rgb(255, 255, 255)'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

const initialState = {
  touched: false,
  touched2: false,
  password: '',
  password2: '',
  error: '',
  error2: '',
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const ChangePasswordDialog = ({ user, handleClose }) => {
  const classes = useStyles();
  const [state, update] = useReducer(reducer, initialState);
  const { state: { theme } } = useContext(saduwux);

  if (!user) {
    return '';
  }

  const handleChangeTrim = (e, number = '') => {
    const error = invalidText(number, e.target.value.trim());
    const valueToUpdate = {
      [e.target.name]: e.target.value.trim(),
      [`touched${number}`]: true,
      [`error${number}`]: error,
    };
    if (!number) {
      valueToUpdate.error2 = invalidText(
        '2',
        state.password2,
        e.target.value.trim()
      );
    }
    update(valueToUpdate);
  };

  const invalid = () => {
    const { password, password2, error, error2 } = state;
    return Boolean(error || error2) || !password.length || !password2.length;
  };

  const invalidText = (number, text, password1 = state.password) => {
    const touched = state[`touched${number}`];
    const password = text;
    if (!touched) {
      return '';
    }

    switch (true) {
      case password.length < 6:
        return 'La contraseña debe de al menos 6 caracteres';
      case number && password1 !== password:
        return 'La contraseñas deben coincidir';
      default:
        return '';
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    handleClose({
      index: user.index,
      password: md5(state.password),
      userID: user.id,
    });
  };

  return (
    <Dialog open={true} onClose={() => handleClose()}>
      <DialogTitle id="file-dialog-title" style={{ textAlign: 'center' }}>
        Cambiar contraseña a {user.usuario}
      </DialogTitle>
      <Box className={classes.paperMod}>
        <form
          autoComplete="off"
          className={classes.form}
          onSubmit={handleSubmit}
        >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={theme ? classes.darkFocused : ''}
          >
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
              error={!!state.error}
              helperText={state.error}
            />
            <TextField
              name="password2"
              value={state.password2}
              onChange={(e) => handleChangeTrim(e, '2')}
              id="password-confirm-input"
              label="Confirmar contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              error={!!state.error2}
              helperText={state.error2}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={invalid()}
              type="submit"
            >
              Cambiar contraseña
            </Button>
          </Grid>
        </form>
      </Box>
    </Dialog>
  );
};

export default ChangePasswordDialog;
