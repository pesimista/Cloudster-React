/**
 * @typedef {import('../SF/typedefs.jsx').file} file
 */
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CachedIcon from "@material-ui/icons/Cached";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import HomeIcon from "@material-ui/icons/Home";
import BackupIcon from '@material-ui/icons/Backup';
import React, { useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { saduwux } from "../SF/Context";
import { handleFetch } from "../SF/helpers";
import MySnackbarContentWrapper from "../SubSnackBar/SubSnackBar";
import Files from "./Files";
import { getIcon } from "../SF/helpers";
import path from 'path';

const drawerWidth = 51;
const useStyles = makeStyles(theme => ({
   root: { flexGrow: 1 },
   title: { flexGrow: 1 },
   input: { display: "none" },
   toolbar: theme.mixins.toolbar,
   appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
   },
   container: {
      display: "flex",
      flexWrap: "wrap"
   },
   menuButton: {
      marginRight: theme.spacing(2)
   },
   modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
   },
   paperMod: {
		padding: theme.spacing(2),
      margin: "auto", maxWidth: 700,
      textAlign: "center"
	},
}));

const initialState = {
   open: false,
   openModal: false,
   fileField: '',
   fileFieldName: '',
   ext: '',
   currentFile: 0,
   files: [],
   shouldUpdate: false,
}

const reducer = (state, action) => {
   if (action.type === 'shouldUpdate') {
      return {
         ...state
         , shouldUpdate: !state.shouldUpdate
         , open: true
         , fileField: ''
         , ext: ''
         , fileFieldName: ''
      };
   }
   return { ...state, ...action }
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
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
         }
      })
         .then(handleFetch)
         .then(
            response => update({ files: sort(response) })
         ).catch(mistake => console.log(`/api/files/${globalState.folder}/files`, mistake.message));
   }, [globalState.folder, state.shouldUpdate]);


   if (!globalState.logStatus) {
      return <Redirect to='/notlogged' />
   }

   /**--------------------- Navigators ----------------------*/
   const goBack = () => {
      if (globalState.history.length)
         dispatch({ type: 'moveBack' });
   }
   const updateFolder = (ino) => {
      dispatch({ type: 'moveForward', payload: ino });
   }
   const updatePlayer = (ino) => {
      dispatch({ type: 'update', payload: { playing: ino } });
      history.push('/reproductor')
   }
   const goHome = () => {
      dispatch({ type: 'moveHome' });
   }
   const cleanState = () => {
      dispatch({ type: 'clean' });
      console.log(state);
   }
   /**--------------------- Navigators ----------------------*/

   const handleOpenModal = () => {
      update({ openModal: true });
   };

   const onChange = e => {
      let _ext = path.extname(e.target.files[0].name);
      const nombre = path.basename(e.target.files[0].name, _ext);
      _ext = _ext.slice(1);
      update({
         fileField: e.target.files[0],
         ext: _ext,
         fileFieldName: nombre
      });
   };

   const handleClose = (event, reason) => {
      if (reason !== "clickaway")
         update({ open: false });
   };

   const handleCloseModal = () => {
		update({ openModal: false });
	};

   const uploadFile = () => {
      if (!state.fileField) { console.log('Something is missing'); return; }
      console.log('Uploading file');
      let formData = new FormData();
      formData.append("file", state.fileField);
      fetch(`/api/files/${globalState.folder}`, {
         method: "POST",
         headers: {
            'Authorization': localStorage.getItem('token')
         },
         enctype: "multipart/form-data",
         body: formData
      })
         .then(res => res.json())
         .then(() => {
            update({ type: 'shouldUpdate' });
            update({ openModal: false });
         });
   };

   const items = () => state.files.reduce((filtered, file, index) => {
      const regex = new RegExp(globalState.search, 'gi');
      if (!file.name.match(regex)) {
         return filtered;
      }
      const temp = <Files
         useTheme={globalState.theme}
         updatePlayer={updatePlayer}
         updateFolder={updateFolder}
         key={index}
         index={index}
         file={file}
      />;
      return [...filtered, temp]
   }, []);

   return (
      <React.Fragment>
         <AppBar position="fixed" className={classes.appBar} color="secondary">
            <div className={classes.toolbar} />
            <Toolbar variant="dense" className={classes.toolBar}>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={goBack}
                  color="inherit"
                  aria-label="menu"
               >
                  <ArrowBackIcon />
               </IconButton>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
               >
                  <CachedIcon />
               </IconButton>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={goHome}
                  color="inherit"
                  aria-label="menu"
               >
                  <HomeIcon />
               </IconButton>
               <Typography variant="h6" className={classes.title}>
                  Puedes acceder desde {window.location.origin}
               </Typography>
               <Button
                  color="inherit"
                  startIcon={<CloudUploadIcon />}
                  component="span"
                  onClick={handleOpenModal}
               >
                  Subir
               </Button>
            </Toolbar>
         </AppBar>
         <Box bgcolor="bg.main" width={1} style={{ height: "100vh" }}>
            <div className={classes.toolbar} />
            <div className={classes.toolbar} />
            <Box className={classes.container}>
               {items()}
            </Box>
         </Box>
         <Box>
            <Snackbar
               anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
               }}
               open={state.open}
               autoHideDuration={6000}
               onClose={handleClose}
            >
               <MySnackbarContentWrapper
                  onClose={handleClose}
                  variant="success"
                  message="Recibido!"
               />
            </Snackbar>
         </Box>
         <Modal
               aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
					open={state.openModal}
					className={classes.modal}
               onClose={handleCloseModal}
         >
            <Paper className={classes.paperMod}>
               <Grid>
                  {state.fileField ? 
                  <Grid item container xs={12} justify="center">
                     <Grid item>
                     <img src={getIcon(true, state.ext)} width="164" height="164" />
                     </Grid>
                     <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary" align="center">
                           Nombre: 
                        </Typography>
                        <TextField 
                           id="outlined-basic" 
                           fullWidth 
                           defaultValue={state.fileFieldName} 
                           variant="outlined" 
                           onChange={e=> update({fileFieldName: e.target.value})}
                        />
                     </Grid>
                     <Grid item xs={6} style={{paddingTop:"15px"}}>
                        <Button variant="contained" color="secondary" onClick={cleanState}>
                           Limpiar
                        </Button>
                     </Grid>
                     <Grid item xs={6} style={{paddingTop:"15px"}}>
                        <Button variant="contained" color="primary" onClick={uploadFile}>
                           Aceptar
                        </Button>
                     </Grid>
                  </Grid>
                  :
                  <Grid item container xs={12} justify="center">
                     <Grid item>
                        <input accept="/*" onChange={e => onChange(e)} className={classes.input} id="icon-button-file" type="file" />
                         <label htmlFor="icon-button-file">
                           <IconButton color="primary" aria-label="upload picture" component="span">
                           <BackupIcon style={{ fontSize: 164 }}/>
                           </IconButton>
                         </label>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography>
                           Seleccionar un archivo...
                        </Typography>
                     </Grid>
                  </Grid>
                  }
               </Grid>
            </Paper>
         </Modal>
      </React.Fragment>
   );
};
export default Search;

const sort = (arr) => {
   arr.sort(byName);
   arr.sort(byFileType);
   return arr;
};//Sort
const byName = (a, b) => {
   const x = a.name.toLowerCase();
   const y = b.name.toLowerCase();
   return compare(x, y);
};//By name
const byFileType = (a, b) => {
   const x = a.ext.toLowerCase();
   const y = b.ext.toLowerCase();
   return compare(x, y);
};//ByFileType
const compare = (a, b) => {
   return (a < b ? -1 :
      a > b ? 1 : 0);
};//Compare
