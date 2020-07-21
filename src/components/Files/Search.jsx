/**
 * @typedef {import('../SF/typedefs.jsx').file} file
 * @typedef {import('../SF/typedefs.jsx').searchState} initialState
 * @typedef {import('../SF/typedefs.jsx').inputFile} inputFile
 * @typedef {import('../SF/typedefs.jsx').context} context
 */
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CachedIcon from '@material-ui/icons/Cached';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HomeIcon from '@material-ui/icons/Home';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch, postFile, newFolder } from '../SF/helpers';
import Files from './Files';
import FileInfoModal from './Modals/FileInfoModal';
import UploadFileModal from './Modals/UploadFileModal';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { getIcon } from '../SF/helpers';

const useStyles = makeStyles((theme) => ({
  main: {
    overflow: 'auto',
    display: 'grid',
    gridTemplateRows: '48px 1fr',
    width: '100%',
  },
  anotherRow: {
    gridTemplateRows: '48px 1fr 48px',
  },
  peachColor: { backgroundColor: '#fff9c4' },
  bar: {
    position: 'sticky',
  },
  title: { flexGrow: 1, textAlign: 'center' },
  input: { display: 'none' },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperMod: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 700,
    textAlign: 'center',
  },
  sectionDesktop: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  sectionMobile: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      '& .MuiIconButton-edgeStart': {
        margin: 0,
      },
    },
  },
  movingBar: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '0.25rem 1rem',
    borderTop: '1px solid grey',
  },
  inline: { display: 'inline' },
  hideOnBig: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
    },
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

/** @type {initialState} */
const initialState = {
  open: false,
  message: '',
  severity: '',
  fileForModal: '',
  uploadModal: false,
  files: null,
  shouldUpdate: false,
  movingFile: '',
  isMoving: false,
  folderModal: false,
  folderName: 'Nueva Carpeta',
};

const reducer = (state, action) => {
  return {
    ...state,
    ...action,
  };
};

const Search = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, update] = React.useReducer(reducer, initialState);
  /**@type {context} */
  const { state: globalState, dispatch } = useContext(saduwux);

  React.useEffect(() => {
    if (state.shouldUpdate) {
      update({ shouldUpdate: false });
    }
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };

    fetch(`/api/files/${globalState.folder}/files`, headers)
      .then(handleFetch)
      .then((response) => {
        console.log(response);
        update({ files: sort(response) });
      })
      .catch((mistake) =>
        console.log(`/api/files/${globalState.folder}/files`, mistake.message)
      );
  }, [globalState.folder, state.shouldUpdate]);

  /**--------------------- Navigators ----------------------*/
  /** Goes one folder up if possible */
  const goBack = () =>
    globalState.history.length && dispatch({ type: 'moveBack' });
  /** Goes one folder in */
  const updateFolder = (ino) => dispatch({ type: 'moveForward', payload: ino });
  /** Redirects to the player */
  const updatePlayer = (ino) => {
    dispatch({ type: 'update', payload: { playing: ino } });
    history.push('/reproductor');
  };
  /** Goes to the root directory */
  const goHome = () => dispatch({ type: 'moveHome' });

  /**--------------------- Navigators ----------------------*/

  const handleFileModal = (file = '') => {
    update({ fileForModal: file });
  };

  /**
   * Toggle the upload modal,
   * if closing and data was retrieved it's sent to the server
   * @param {inputFile} data la informacion provemiente del dialog
   * @param {boolean} closing si se está cerrando desde el dialog
   */
  const handleUploadModal = (data, closing = false) => {
    if (!data && !closing) update({ uploadModal: true });
    else if (data) uploadFile({ ...data, folder: globalState.folder });

    if (closing) update({ uploadModal: false });
  };

  /** Closes the snackbar
   * @param {object} event
   * @param {string} reason
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    update({ open: false });
    update({ folderModal: false });
  };

  /**
   * @param {inputFile} fileToPost The data to be posted
   */
  const onSuccess = (mensaje) => {
    update({
      shouldUpdate: true,
      open: true,
      message: mensaje,
      severity: 'success',
    });
  };

  const onError = (mistake) => update({ open: true, message: mistake.message });

  const uploadFile = (fileToPost) => {
    postFile(fileToPost, onSuccess, onError);
  };

  /** Mover archivos */
  const setMovingFile = (ino) => {
    update({ movingFile: ino });
  };
  const cancelMoving = () => {
    update({ movingFile: null });
  };
  const moveFile = () => {
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    update({ isMoving: true });
    fetch(`/api/files/${globalState.folder}/${state.movingFile.ino}`, headers)
      .then(handleFetch)
      .then((res) => {
        update({
          shouldUpdate: true,
          movingFile: '',
          open: true,
          message: res.message,
          severity: 'success',
          isMoving: false,
        });
      })
      .catch((error) => {
        update({
          open: true,
          movingFile: '',
          message: error.message,
          severity: 'error',
          isMoving: false,
        });
      });
    // fetch state.moving file => globalState.folder
  };
  /** */

  const items = () => {
    const regex = new RegExp(globalState.search, 'gi');
    return state.files.reduce((filtered, file, index) => {
      if (!file.name.match(regex)) {
        return filtered;
      }
      const temp = (
        <Files
          openModal={handleFileModal}
          useTheme={globalState.theme}
          updatePlayer={updatePlayer}
          updateFolder={updateFolder}
          move={{ setMovingFile, movingFile: state.movingFile }}
          key={index}
          file={file}
        />
      );
      return [...filtered, temp];
    }, []);
  };

  const mainClass = () => {
    let className = classes.main;
    if (state.movingFile) className += ` ${classes.anotherRow}`;
    if (!globalState.theme) className += ` ${classes.peachColor}`;
    return className;
  };

  return (
    <React.Fragment>
      <Box className={mainClass()} component="main">
        <AppBar component="div" color="secondary" className={classes.bar}>
          <Toolbar variant="dense">
            <Grid container alignItems="center">
              <Grid
                className={classes.sectionMobile}
                container
                item
                xs={12}
                sm={3}
                md={2}
                lg={2}
              >
                <Grid item xs sm={3}>
                  <IconButton
                    edge="start"
                    onClick={goBack}
                    color="inherit"
                    aria-label="menu"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs sm={3}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => update({ shouldUpdate: true })}
                  >
                    <CachedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs sm={3}>
                  <IconButton
                    edge="start"
                    onClick={goHome}
                    color="inherit"
                    aria-label="menu"
                  >
                    <HomeIcon />
                  </IconButton>
                </Grid>
                <Grid item xs sm={3}>
                  <IconButton
                    edge="start"
                    onClick={() => update({ folderModal: true })}
                    color="inherit"
                    aria-label="menu"
                  >
                    <CreateNewFolderIcon />
                  </IconButton>
                </Grid>
                <Grid item xs className={classes.hideOnBig}>
                  <IconButton
                    edge="start"
                    onClick={() => handleUploadModal()}
                    color="inherit"
                    aria-label="upload"
                  >
                    <CloudUploadIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                className={classes.sectionDesktop}
                sm={7}
                md={7}
                lg={9}
              >
                <Box display="flex">
                  <Typography variant="h6" className={classes.title}>
                    Puedes acceder desde {window.location.origin}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                className={classes.sectionDesktop}
                sm={2}
                md={2}
                lg={1}
                style={{ textAlign: 'end' }}
              >
                <Button
                  color="inherit"
                  startIcon={<CloudUploadIcon />}
                  component="span"
                  onClick={() => handleUploadModal()}
                >
                  Subir
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid container className={classes.inline}>
          {!state.files || state.shouldUpdate ? <LinearProgress /> : ''}
          <div className={classes.container}>{state.files ? items() : ''}</div>
        </Grid>
        <MovingBar
          movingFile={state.movingFile}
          className={classes.movingBar}
          move={moveFile}
          cancel={cancelMoving}
          theme={globalState.theme}
          isMoving={state.isMoving}
        />
        <Dialog
          open={state.folderModal}
          className={classes.modal}
          onClose={() => handleClose(state, true)}
        >
          <Paper className={classes.paperMod}>
            <Grid item container xs={12} justify="center">
              <Grid item>
                <img src={getIcon(false)} width="164" height="164" alt="file" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  defaultValue={state.folderName}
                  variant="outlined"
                  style={{ textAlign: 'center' }}
                  onChange={(e) => update({ folderName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingTop: '15px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    newFolder(
                      state.folderName,
                      globalState.folder,
                      onSuccess,
                      onError
                    )
                  }
                >
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Dialog>
      </Box>
      <FileInfoModal
        open={!!state.fileForModal}
        file={state.fileForModal}
        handleClose={handleFileModal}
      />
      <UploadFileModal
        open={state.uploadModal}
        handleClose={handleUploadModal}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={state.open}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert onClose={handleClose} severity={state.severity}>
          {state.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

const MovingBar = ({
  movingFile: file,
  className,
  move,
  cancel,
  theme,
  isMoving,
}) => {
  if (!file) {
    return '';
  }
  const spanClass = makeStyles(() => ({
    button: {
      '& .MuiButton-endIcon, & .MuiButton-startIcon': {
        marginTop: '-5px',
      },
    },
    typo: {
      color: theme ? '#fff' : 'rgba(0, 0, 0, 0.87)',
    },
  }))();

  const { name, ext } = file;
  const nameToShow =
    name.length > 30 ? name.substring(0, 27).trim() + '...' + ext : name;

  return (
    <div className={className}>
      <Typography variant="h6" className={spanClass.typo}>
        Moviendo: {nameToShow}
      </Typography>
      <div>
        <Button
          disableElevation
          disabled={isMoving}
          onClick={() => cancel()}
          size="large"
          startIcon={<CancelIcon />}
          className={spanClass.button}
        >
          Cancelar
        </Button>
        <Button
          disableElevation
          disabled={isMoving}
          onClick={() => move()}
          size="large"
          endIcon={<SendIcon />}
          className={spanClass.button}
        >
          Mover aquí
        </Button>
      </div>
    </div>
  );
};

export default Search;

/**
 * @param {file[]} arr
 */
const sort = (arr) => {
  arr.sort(byName);
  arr.sort(byFileType);
  return arr;
}; //Sort
/**
 * Sort by name
 * @param {file} a
 * @param {file} b
 */
const byName = (a, b) => a.name.localeCompare(b.name); //By name
/**
 * Sort by extension
 * @param {file} a
 * @param {file} b
 */
const byFileType = (a, b) => a.ext.localeCompare(b.ext);
