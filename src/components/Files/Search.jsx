/**
 * @typedef {import('../SF/typedefs.jsx').file} file
 * @typedef {import('../SF/typedefs.jsx').searchState} initialState
 * @typedef {import('../SF/typedefs.jsx').inputFile} inputFile
 * * @typedef {import('../SF/typedefs.jsx').context} context
 */
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CachedIcon from "@material-ui/icons/Cached";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import HomeIcon from "@material-ui/icons/Home";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { saduwux } from "../SF/Context";
import { handleFetch, postFile } from "../SF/helpers";
import Files from "./Files";
import FileInfoModal from "./Modals/FileInfoModal";
import UploadFileModal from "./Modals/UploadFileModal";

const useStyles = makeStyles((theme) => ({
   root: { flexGrow: 1 },
   title: { flexGrow: 1, textAlign: "center" },
   input: { display: "none" },
   container: {
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
   },
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   paperMod: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 700,
      textAlign: "center",
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
            margin: 0
         }
      },
   },
   useDark: {
      backgroundColor: '#393d46'
   },
}));

const Alert = (props) => {
   return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/** @type {initialState} */
const initialState = {
   open: false,
   message: '',
   severity: '',
   fileForModal: '',
   uploadModal: false,
   files: null,
   shouldUpdate: false
};

const reducer = (state, action) => {
   if (action.type === "shouldUpdate") {
      return {
         ...state,
         shouldUpdate: !state.shouldUpdate,
         uploadModal: false,
         fileModal: '',
         open: action.open,
         message: action.message ? action.message : '',
         severity: action.severity
      };
   }
   return { ...state, ...action };
};

const Search = () => {
   const classes = useStyles();
   const history = useHistory();
   const [state, update] = React.useReducer(reducer, initialState);
   /**@type {context} */
   const { state: globalState, dispatch } = useContext(saduwux);

   React.useEffect(() => {
      fetch(`/api/files/${globalState.folder}/files`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },
      }).then(
         handleFetch
      ).then((response) => update({ files: sort(response) })
      ).catch((mistake) =>
         console.log(
            `/api/files/${globalState.folder}/files`,
            mistake.message
         )
      );
   }, [globalState.folder, state.shouldUpdate]);

   if (!globalState.logStatus) {
      return <Redirect to="/notlogged" />;
   }

   /**--------------------- Navigators ----------------------*/
   /** Goes one folder up if possible */
   const goBack = () => {
      if (globalState.history.length) dispatch({ type: "moveBack" });
   };
   /** Goes one folder in */
   const updateFolder = (ino) => {
      dispatch({ type: "moveForward", payload: ino });
   };
   /** Redirects to the player */
   const updatePlayer = (ino) => {
      dispatch({ type: "update", payload: { playing: ino } });
      history.push("/reproductor");
   };
   /** Goes to the root directory */
   const goHome = () => {
      dispatch({ type: 'moveHome' });
   }
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

      else if (data)
         uploadFile({ ...data, folder: globalState.folder });

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
      const onSuccess = () => update({
         type: "shouldUpdate", open: true, message: 'Archivo subido satisfactoriamente!', severity: 'success'
      });

      const onError = (mistake) => {
         console.log(`/api/files/${globalState.folder}/files`);
         update({ open: true, message: mistake.message, severity: 'error' });
      }
      postFile(
         fileToPost,
         onSuccess,
         onError
      );
   };

   const items = () => {
      const regex = new RegExp(globalState.search, "gi");
      return state.files.reduce(
         (filtered, file, index) => {
            if (!file.name.match(regex)) {
               return filtered;
            }
            const temp = (
               <Files
                  openModal={handleFileModal}
                  useTheme={globalState.theme}
                  updatePlayer={updatePlayer}
                  updateFolder={updateFolder}
                  key={index}
                  file={file} />
            );
            return [...filtered, temp];
         }, []
      )
   };

   return (
      <main className={`${classes.root} flex-column min-h100`}>
         <Box width={1} className={globalState.theme ? classes.useDark : ''}>
            <AppBar position="static" component="div" color="secondary">
               <Toolbar variant="dense">
                  <Grid container alignItems="center">
                     <Grid className={classes.sectionMobile} container item xs={12} sm={3} md={3} lg={2}>
                        <Grid item xs={3} >
                           <IconButton
                              edge="start"
                              onClick={goBack}
                              color="inherit"
                              aria-label="menu">
                              <ArrowBackIcon />
                           </IconButton>
                        </Grid>
                        <Grid item xs={3}>
                           <IconButton
                              edge="start"
                              color="inherit"
                              aria-label="menu"
                              onClick={() => update({ type: "shouldUpdate" })}
                           >
                              <CachedIcon />
                           </IconButton>
                        </Grid>
                        <Grid item xs={3}>
                           <IconButton
                              edge="start"
                              onClick={goHome}
                              color="inherit"
                              aria-label="menu">
                              <HomeIcon />
                           </IconButton>
                        </Grid>
                        <Grid item xs={3}>
                           <IconButton
                              edge="start"
                              onClick={goHome}
                              color="inherit"
                              aria-label="menu">
                              <CreateNewFolderIcon />
                           </IconButton>
                        </Grid>
                     </Grid>
                     <Grid item className={classes.sectionDesktop} sm={7} md={7} lg={9}>
                        <Box display="flex">
                           <Typography variant="h6" className={classes.title}>
                              Puedes acceder desde {window.location.origin}
                           </Typography>
                        </Box>
                     </Grid>
                     <Grid item className={classes.sectionDesktop} sm={2} md={2} lg={1} style={{ textAlign: 'end' }}>
                        <Button
                           color="inherit"
                           startIcon={<CloudUploadIcon />}
                           component="span"
                           onClick={() => handleUploadModal()}>
                           Subir
                     </Button>
                     </Grid>
                  </Grid>
               </Toolbar>
            </AppBar>
            {!state.files || state.shouldUpdate ? <LinearProgress /> : ""}
            <Grid container>
               {state.files ? items() : ""}
            </Grid>
            <Box display={{ xs: 'flex', sm: 'none' }}>
               <Toolbar variant="dense"/>
            </Box>
         </Box>
         <FileInfoModal open={!!state.fileForModal} file={state.fileForModal} handleClose={handleFileModal} />
         <UploadFileModal open={state.uploadModal} handleClose={handleUploadModal} />
         <Snackbar
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "right"
            }}
            open={state.open}
            onClose={handleClose}
            autoHideDuration={3000}
         >
            <Alert onClose={handleClose} severity={state.severity}>
               {state.message}
            </Alert>
         </Snackbar>
      </main>
   );
};
export default Search;


const sort = (arr) => {
   arr.sort(byName);
   arr.sort(byFileType);
   return arr;
}; //Sort
const byName = (a, b) => {
   const x = a.name.toLowerCase();
   const y = b.name.toLowerCase();
   return compare(x, y);
}; //By name
const byFileType = (a, b) => {
   const x = a.ext.toLowerCase();
   const y = b.ext.toLowerCase();
   return compare(x, y);
}; //ByFileType
const compare = (a, b) => {
   return a < b ? -1 : a > b ? 1 : 0;
}; //Compare
