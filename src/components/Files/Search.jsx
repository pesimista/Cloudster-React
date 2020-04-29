/**
 * @typedef {import('../SF/typedefs.jsx').file} file
 */
import { LinearProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
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
import Files from "./Files";
import FileInfoModal from "./Modals/FileInfoModal";
import UploadFileModal from "./Modals/UploadFileModal";

const useStyles = makeStyles((theme) => ({
   root: { flexGrow: 1 },
   title: { flexGrow: 1, textAlign: "center" },
   input: { display: "none" },
   toolbar: { maxHeight: "64px", position: "static" },
   container: {
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
   },
   menuButton: {
      marginRight: theme.spacing(2),
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
}));

const initialState = {
   fileForModal: '',
   files: null,
   uploadModal: false,
   shouldUpdate: false,
   currentFile: 0,
};

const reducer = (state, action) => {
   if (action.type === "shouldUpdate") {
      return {
         ...state,
         shouldUpdate: !state.shouldUpdate,
         uploadModal: false,
         fileModal: '',
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
      else if (data)
         uploadFile(data);
      if (closing) update({ uploadModal: false });
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
      formData.append("file", data.fileField);
      formData.append("name", data.fileFieldName);

      fetch(`/api/files/${globalState.folder}`, {
         method: "POST",
         headers: {
            Authorization: localStorage.getItem("token"),
         },
         enctype: "multipart/form-data",
         body: formData,
      }).then(
         handleFetch
      ).then((res) => {
         update({ type: "shouldUpdate" });
         alert(res.message)
      }).catch((mistake) => {
         console.log(
            `/api/files/${globalState.folder}/files`
         );
         alert(mistake.message)
      });
   };

   const items = () => state.files.reduce(
      (filtered, file, index) => {
         const regex = new RegExp(globalState.search, "gi");
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
   );

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
                  <Button
                     color="inherit"
                     startIcon={<CloudUploadIcon />}
                     component="span"
                     onClick={() => handleUploadModal()}>
                     Subir
                  </Button>
               </Toolbar>
            </AppBar>
            {!state.files || state.shouldUpdate ? <LinearProgress /> : ""}
            <Box className={classes.container}>
               {state.files ? items() : ""}
            </Box>
         </Box>
         <FileInfoModal open={!!state.fileForModal} file={state.fileForModal} handleClose={handleFileModal} />
         <UploadFileModal open={state.uploadModal} handleClose={handleUploadModal} />
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
