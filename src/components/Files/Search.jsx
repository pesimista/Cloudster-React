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
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch, postFile } from '../SF/helpers';
import Files from './Files';
import FileInfoModal from './Modals/FileInfoModal';
import UploadFileModal from './Modals/UploadFileModal';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';

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
};

const reducer = (state, action) => {
  if (action.type !== 'shouldUpdate') {
    return { ...state, ...action };
  }
  return {
    ...state,
    shouldUpdate: !state.shouldUpdate,
    uploadModal: false,
    fileModal: '',
    open: action.open,
    message: action.message || '',
    severity: action.severity || '',
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
      update({ type: 'shouldUpdate' });
    }
    fetch(`/api/files/${globalState.folder}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(handleFetch)
      .then((response) => update({ files: sort(response) }))
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
  };

  /**
   * @param {inputFile} fileToPost The data to be posted
   */
  const uploadFile = (fileToPost) => {
    const onSuccess = () =>
      update({
        type: 'shouldUpdate',
        open: true,
        message: 'Archivo subido satisfactoriamente!',
        severity: 'success',
      });

    const onError = (mistake) =>
      update({ open: true, message: mistake.message });

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
                sm={2}
                md={3}
                lg={1}
              >
                <Grid item xs={3} sm={4}>
                  <IconButton
                    edge="start"
                    onClick={goBack}
                    color="inherit"
                    aria-label="menu"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => update({ type: 'shouldUpdate' })}
                  >
                    <CachedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3} sm={4}>
                  <IconButton
                    edge="start"
                    onClick={goHome}
                    color="inherit"
                    aria-label="menu"
                  >
                    <HomeIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3} className={classes.hideOnBig}>
                  <IconButton
                    edge="start"
                    onClick={handleUploadModal}
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
                sm={8}
                md={7}
                lg={10}
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
        />
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

const MovingBar = ({ movingFile: file, className, move, cancel, theme }) => {
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
          onClick={() => cancel()}
          size="large"
          startIcon={<CancelIcon />}
          className={spanClass.button}
        >
          Cancelar
        </Button>
        <Button
          disableElevation
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
