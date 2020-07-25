import { Paper, Dialog, DialogTitle, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import BackupIcon from '@material-ui/icons/Backup';
import React from 'react';
import { getIcon } from '../../SF/helpers';
import { useReducer, useContext } from 'react';
import { saduwux } from '../../SF/Context';
import path from 'path';

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  title: { flexGrow: 1, textAlign: 'center' },
  input: { display: 'none' },
  toolbar: { maxHeight: '64px', position: 'static' },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperMod: {
    padding: theme.spacing(2),
    maxWidth: 700,
    textAlign: 'center',
  },
}));

const initialState = {
  fileField: '',
  fileFieldName: '',
  originalName: '',
  ext: '',
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const reg = new RegExp('[!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~]+', 'g');
const pattern = new RegExp('^[\\w\\s\\-]*$', 'i');

const UploadFileModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const [state, update] = useReducer(reducer, initialState);
  const { state: { theme } } = useContext(saduwux);

  React.useEffect(() => {
    update(initialState);
  }, [open])

  const cleanState = () => {
    update({
      fileFieldName: state.originalName,
    });
  }

  const accept = () => {
    if (!state.fileFieldName.length){
      return;
    }
    handleClose(state, true)
  }

  const onChange = (e) => {
    const fileName = e.target.files[0].name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let _ext = path.extname(fileName);
    const nombre = path.basename(fileName, _ext);
    _ext = _ext.substring(1);
    
    update({
      fileField: e.target.files[0],
      ext: _ext,
      fileFieldName: nombre.replace(reg,''),
      originalName: nombre.replace(reg, ''),
    });
  };

  const changeName = (e) => {
    if (e.target.value.match(pattern)) {
      update({ fileFieldName: e.target.value });
    }
  }

  const handleLocalClose = () => {
    update({fileField: null});
    handleClose('', true)
  }

  if (!open) return '';
  else
    return (
      <Dialog
        open={open}
        className={classes.modal}
        onClose={e => {console.log(e); handleLocalClose()}}
      >
        <DialogTitle id="file-dialog-title" className={classes.title}>
          {!state.fileField
            ? 'Selecciona un archivo...'
            : 'Información del archivo'}
        </DialogTitle>
        <Paper className={classes.paperMod}>
          <Grid>
            <ModalContent
              className={classes.input}
              state={state}
              theme={theme}
              changeName={changeName}
              onChange={onChange}
              cleanState={cleanState}
              handleClose={accept}
            />
          </Grid>
        </Paper>
      </Dialog>
    );
};

const ModalContent = (props) => {
  const {
    className: classes,
    state,
    theme,
    changeName,
    onChange,
    cleanState,
    handleClose,
  } = props;

  if (!state.fileField) {
    return (
      <Grid item container xs={12} justify="center">
        <Grid item xs={12}>
          <input
            accept="/*"
            onChange={(e) => onChange(e)}
            className={classes}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color={theme ? '' : 'primary'}
              aria-label="upload picture"
              component="span"
            >
              <BackupIcon style={{ fontSize: 164 }} />
            </IconButton>
          </label>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid item container xs={12} justify="center">
      <Grid item>
        <img
          src={getIcon(true, state.ext)}
          width="164"
          height="164"
          alt="file"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="textSecondary" align="center">
          Nombre:
        </Typography>
        <TextField
          fullWidth
          value={state.fileFieldName}
          error={!state.fileFieldName.length}
          variant="outlined"
          style={{ textAlign: 'center' }}
          onChange={changeName}
        />
      </Grid>
      <Grid item xs={6} style={{ paddingTop: '15px' }}>
        <Button variant="contained" color="secondary" onClick={cleanState}>
          Nombre original
        </Button>
      </Grid>
      <Grid item xs={6} style={{ paddingTop: '15px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          disabled={!state.fileFieldName.length}
        >
          Aceptar
        </Button>
      </Grid>
    </Grid>
  );
};

export default UploadFileModal;
