/**
 * @typedef {import('../SF/typedefs.jsx').file} file
 */
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CachedIcon from "@material-ui/icons/Cached";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import HomeIcon from "@material-ui/icons/Home";
import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { saduwux } from "../SF/Context";
import { handleFetch } from "../SF/helpers";
import MySnackbarContentWrapper from "../SubSnackBar/SubSnackBar";
import Files from "./Files";
import path from "path"
import { LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   root: { flexGrow: 1 },
   title: { flexGrow: 1, textAlign: "center" },
   input: { display: "none" },
   toolbar: { maxHeight: "64px", position: "static" },
   container: {
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1
   }, menuButton: {
      marginRight: theme.spacing(2),
   },
}));

const initialState = {
   open: false,
   fileField: "",
   fileFieldText: "",
   currentFile: 0,
   files: null,
   shouldUpdate: false,
};

const reducer = (state, action) => {
   if (action.type === "shouldUpdate") {
      return {
         ...state,
         shouldUpdate: !state.shouldUpdate,
         open: true,
         fileField: "",
         fileFieldText: "",
      };
   }
   return { ...state, ...action };
};

/**
 * asd
 * @param {object} params
 * @param {file[]} params.files
 */
const Search = () => {
   const classes = useStyles();
   const history = useHistory();
   const [state, update] = React.useReducer(reducer, initialState);
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
      ).then(
         (response) => update({ files: sort(response) })
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
      dispatch({ type: "moveHome" });
   };
   /**--------------------- Navigators ----------------------*/

   const onChange = (e) => {
      const name = path.basename(e.target.value);

      update({
         fileField: e.target,
         fileFieldText: name,
      });
   };

   const handleClose = (event, reason) => {
      if (reason !== "clickaway") update({ open: false });
   };

   const uploadFile = () => {
      if (!state.fileField.files[0]) {
         console.log("Something is missing");
         return;
      }
      console.log("Uploading file");
      let formData = new FormData();
      formData.append("file", state.fileField.files[0]);
      fetch(`/api/files/${globalState.folder}`, {
         method: "POST",
         headers: {
            Authorization: localStorage.getItem("token"),
         },
         enctype: "multipart/form-data",
         body: formData,
      }).then(
         handleFetch
      ).then(() => {
         update({ type: "shouldUpdate" });
      }).catch((mistake) =>
         console.log(
            `/api/files/${globalState.folder}/files`,
            mistake.message
         )
      );
   };

   const items = () => state.files.reduce((filtered, file, index) => {
      const regex = new RegExp(globalState.search, "gi");
      if (!file.name.match(regex)) {
         return filtered;
      }
      const temp = (
         <Files
            useTheme={globalState.theme}
            updatePlayer={updatePlayer}
            updateFolder={updateFolder}
            key={index}
            file={file}
         />
      );
      return [...filtered, temp];
   }, []);

   // const container = () => 

   return (
      <main className={`${classes.root} flex-column min-h100`}>
         <Box bgcolor="bg.main" className="min-h100" width={1}>
            <AppBar position="static" component="div" color="secondary">
               <Toolbar variant="dense" className={classes.toolBar}>
                  <IconButton
                     edge="start"
                     className={classes.menuButton}
                     onClick={goBack}
                     color="inherit"
                     aria-label="menu">
                     <ArrowBackIcon />
                  </IconButton>
                  <IconButton
                     edge="start"
                     className={classes.menuButton}
                     color="inherit"
                     aria-label="menu">
                     <CachedIcon />
                  </IconButton>
                  <IconButton
                     edge="start"
                     className={classes.menuButton}
                     onClick={goHome}
                     color="inherit"
                     aria-label="menu">
                     <HomeIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                     Puedes acceder desde {window.location.origin}
                  </Typography>
                  <div style={{ paddingTop: '5px', paddingBottom: '5px', maxHeight: '48px' }}>
                     <input
                        accept="*"
                        className={classes.input}
                        id="text-button-file"
                        type="file"
                        onChange={(e) => onChange(e)} />
                     <label htmlFor="text-button-file">
                        <Button
                           style={{ height: '38px' }}
                           color="inherit"
                           startIcon={<CloudUploadIcon />}
                           component="span">
                           Subir
                        </Button>
                     </label>
                     <TextField
                        id="filled-basic"
                        size="small"
                        variant="outlined"
                        value={state.fileFieldText}
                     />
                     <Button color="inherit" onClick={uploadFile}>
                        Aceptar
                     </Button>
                  </div>
               </Toolbar>
            </AppBar>
            {!state.files ? <LinearProgress /> : ''}
            <Box className={classes.container}>
               {state.files ? items() : ''}
            </Box>
         </Box>
         <Box>
            <Snackbar
               anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
               }}
               open={state.open}
               autoHideDuration={6000}
               onClose={handleClose}>
               <MySnackbarContentWrapper
                  onClose={handleClose}
                  variant="success"
                  message="Recibido!"
               />
            </Snackbar>
         </Box>
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
