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
//import { ArrowBack as ArrowBackIcon, Cached as CachedIcon, Home as HomeIcon, CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CachedIcon from "@material-ui/icons/Cached";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import HomeIcon from "@material-ui/icons/Home";
import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { saduwux } from "../SF/Context";
import MySnackbarContentWrapper from "../SubSnackBar/SubSnackBar";
import Files from "./Files";


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
   }
}));

// const initialState = {
//    open: false,
//    fileField: '',
//    fileFieldText: '',
//    currentFile: 0
// }

// const reducer = (state, action) => {
//    return { ...state, ...action }
// };
/**
 * asd
 * @param {object} params
 * @param {file[]} params.files
 */
const Search = ({ files, ...props }) => {
   const classes = useStyles();
   // const [state, update] = React.useReducer(reducer, initialState);

   const [open, setOpen] = React.useState(false);
   const [fileField, updateFileField] = React.useState("");
   const [fileFieldText, updateFileFieldText] = React.useState("");

   const { state: globalSate, dispatch } = useContext(saduwux);

   React.useEffect(() => {
      props.handleClick(
         files.length !== 0 ? files[0].dependency : 0
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const items = () => {
      return files.reduce((filtered, file, index) => {
         return <Files
            useTheme={props.useTheme}
            serverIp={props.serverIp}
            userId={props.userId}
            changeRep={props.changeRep}
            getIcon={props.getIcon}
            contextMenu={props.contextMenu}
            handleClick={props.handleClick}
            key={index}
            index={index}
            file={file}
         />
      }, []);
   };

   const onChange = e => {
      updateFileField(e.target);
      updateFileFieldText(e.target.value);
   };

   const handleClose = (event, reason) => {
      if (reason === "clickaway") {
         return;
      }
      setOpen(false);
   };

   const uploadFile = () => {
      let formData = new FormData();
      formData.append("file", fileField.files[0]);
      fetch(`/api/file?whereTo=${files[0].dependency}`, {
         method: "POST",
         enctype: "multipart/form-data",
         body: formData
      })
         .then(res => res.json())
         .then(data => {
            props.handleClick(files[0].dependency);
            setOpen(true);
         });
   };

   if (!globalSate.user.id) return <Redirect to='/notlogged' />

   return (
      <React.Fragment>
         <AppBar position="fixed" className={classes.appBar} color="secondary">
            <div className={classes.toolbar} />
            <Toolbar variant="dense" className={classes.toolBar}>
               <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={props.goBack}
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
                  onClick={props.goHome}
                  color="inherit"
                  aria-label="menu"
               >
                  <HomeIcon />
               </IconButton>
               <Typography variant="h6" className={classes.title}>
                  Puedes acceder desde {window.location.origin}
               </Typography>
               <input
                  accept="image/*"
                  className={classes.input}
                  id="text-button-file"
                  type="file"
                  multiple
                  onChange={e => onChange(e)}
               />
               <label htmlFor="text-button-file">
                  <Button
                     color="inherit"
                     startIcon={<CloudUploadIcon />}
                     component="span"
                  >
                     Subir
                  </Button>
               </label>
               <TextField
                  id="filled-basic"
                  size="small"
                  variant="outlined"
                  value={fileFieldText}
                  InputProps={{
                     readOnly: true
                  }}
               />
               <Button color="inherit" onClick={uploadFile}>
                  Aceptar
               </Button>
            </Toolbar>
         </AppBar>
         <Box bgcolor="bg.main" width={1} style={{ height: "100vh" }}>
            <div className={classes.toolbar} />
            <div className={classes.toolbar} />
            <Box className={classes.container}>{items()}</Box>
         </Box>
         <Box>
            <Snackbar
               anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
               }}
               open={open}
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
      </React.Fragment>
   );
};

export default Search;
