import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SettingsIcon from '@material-ui/icons/Settings';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import UploadFileModal from '../Files/Modals/UploadFileModal';
import { saduwux } from '../SF/Context';
import { handleFetch } from '../SF/helpers';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const routes = [`/busqueda`, `/reproductor`, '/', `/perfil`, `/admin/files`];
const routesComponents = [
  <FolderIcon />,
  <PlayCircleFilledIcon />,
  <CloudUploadIcon />,
  <AccountCircleIcon />,
  <SettingsIcon />,
];

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    '& .MuiBottomNavigationAction-root': {
      minWidth: 0,
    },
  },
  useDark: {
    '& .MuiBottomNavigationAction-root.Mui-selected': {
      color: 'white',
    },
  },
}));

const initialState = {
  uploadModal: false,
  fileField: '',
  fileFieldName: '',
  ext: '',
};

const reducer = (state, action) => {
  if (action.type === 'shouldUpdate') {
    return {
      ...state,
      shouldUpdate: !state.shouldUpdate,
      open: false,
      fileField: '',
      ext: '',
      fileFieldName: '',
      uploadModal: false,
      fileModal: '',
    };
  }
  return { ...state, ...action };
};

const Bottombar = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const [state, update] = React.useReducer(reducer, initialState);
  const { state: globalState } = useContext(saduwux);

  React.useEffect(() => {
    let x = routes.indexOf(location.pathname);
    setValue(x);
  }, [location.pathname]);

  /**
   *
   * @param {Object} data la informacion provemiente del dialog
   * @param {string} data.fileField
   * @param {string} data.fileFieldName
   * @param {string} data.originalName
   * @param {string} data.ext
   * @param {boolean} closing si se está cerrando desde el dialog
   */

  const handleUploadModal = (data, closing = false) => {
    if (!data && !closing) update({ uploadModal: true });
    else if (data) uploadFile(data);
    if (closing) update({ uploadModal: false });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    update({ open: false });
  };

  /**
   *
   * @param {Object} data The data to be posted
   * @param {string} data.fileField
   * @param {string} data.fileFieldName
   * @param {string} data.ext
   */

  const uploadFile = (data) => {
    if (!data.fileField) return;

    let formData = new FormData();
    formData.append('file', data.fileField);
    formData.append('name', data.fileFieldName);

    fetch(`/api/files/${globalState.folder}`, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      enctype: 'multipart/form-data',
      body: formData,
    })
      .then(handleFetch)
      .then((res) => {
        update({ type: 'shouldUpdate' });
        update({
          open: true,
          message: 'Archivo subido satisfactoriamente!',
          severity: 'success',
        });
      })
      .catch((mistake) => {
        console.log(`/api/files/${globalState.folder}/files`);
        update({ open: true, message: mistake.message, severity: 'error' });
      });
  };

  return (
    <Box className={classes.root}>
      <BottomNavigation
        value={value}
        className={globalState.theme ? classes.useDark : ''}
      >
        {routes.reduce((prev, route, index) => {
          if (index === 4 && globalState.user.nivel < 5) return prev;
          if (index !== 2) {
            const fragment = (
              <BottomNavigationAction
                key={index}
                className={classes.sectionMobile}
                to={route}
                component={reactLink}
                icon={routesComponents[index]}
              />
            );
            prev.push(fragment);
          } else {
            const fragment = (
              <BottomNavigationAction
                key={index}
                component={Typography}
                className={classes.sectionMobile}
                onClick={() => handleUploadModal()}
                icon={routesComponents[index]}
              />
            );
            prev.push(fragment);
          }
          return prev;
        }, [])}
      </BottomNavigation>
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
    </Box>
  );
};
export default Bottombar;
