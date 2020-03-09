import React from 'react';
import { useHistory } from 'react-router-dom';
//import { Grow, Paper, makeStyles, MenuItem, Popper, ClickAwayListener, MenuList } from '@material-ui/core';
import Grow  from '@material-ui/core/Grow';
import Box  from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import Link from '@material-ui/core/Link';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  popper: {
    zIndex: 10000
  },
  paper: {
    margin: theme.spacing(1),
    backgroundColor: 'inherit',
  },
  paperMod: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 700,
  },
  image: {
    width: 164,
    height: 164,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color:'white',
  }
}));

const initialState = {
  open: false,
  openModal: false
}

const reducer = (state, action) => {
   return { ...state, ...action }
};


const Files = (props)  => {
  const classes = useStyles();
  const history = useHistory();

  const { index, handleClick, contextMenu, changeRep } = props;
  const { id, name, ext, isFile, lastModified, size, nivel } = props.file;

  const [state, update] = React.useReducer(reducer, state);

  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const anchorRef = React.useRef(null);
  

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [state.open]);

  const content = (
		<Grow
      key={index}
      in
      style={{ transformOrigin: '0 0 0' }}
      {...(true ? { timeout: (index*100) } : {})}
    >
      <Paper color="primary" elevation={0} className={classes.paper}>
        <React.Fragment>
          <img src={props.getIcon(isFile, ext)} alt={ext}/>
          <Typography variant="body2" className={props.useTheme ? classes.text : ''} style={{overflowWrap: 'break-word'}}>
            { name.length > 30 ? name.substring(0,27) + '...' + ext : name }
          </Typography>
        </React.Fragment>
      </Paper>
    </Grow>
  );

  const handleToggle = () => {
    update({open: !state.open})
    // setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    update({open: false});
    // setOpen(false);
  };
  const handleOpenModal = () => {
    update({
      open: false,
      openModal: true
    });
    // setOpenModal(true);
    // setOpen(false);
  };

  const handleCloseModal = () => {
    update({openModal: false});
    // setOpenModal(false);
  };
  
  
  const modRep = (id) => {
    props.changeRep(id);
    history.push('/reproductor');
  }//changeRep

  const download = ino => {
    fetch(`http://localhost:1234/api/files/${ino}/download`, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token'),
    },
    })
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      update({open: true})
      // setOpen(false);
    }
  }

    if(!isFile){
      return(
        <Box onClick={(e) => handleClick(id)} onContextMenu={(e) => contextMenu(e)} textAlign="center" width={80}
          style={{ margin: '0px 5px 10px', cursor: 'pointer'}}
        >
          {content}
      </Box>
      )
    }else {
      return(
      <Box textAlign="center" width={80} style={{ margin: '0px 5px 10px', cursor: 'pointer'}}>
        <a 
          ref={anchorRef}
          aria-controls={state.open ? 'menu-list-grow' : undefined}
          aria-haspopup="true" 
          onClick={handleToggle} 
          onContextMenu={(e) => contextMenu(e)} 
        >
          {content}
        </a>
        <Popper className={classes.popper} open={state.open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={()=>download(ino)}>
                      Descargar                        
                    </MenuItem>
                    <MenuItem onClick={() => modRep(id)}>Reproducir</MenuItem>
                    <MenuItem onClick={handleOpenModal}>Información</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModal}
        className={classes.modal}
        onClose={handleCloseModal}
      >
        {/*-------------------------GRID----------------------------*/}
        <Paper className={classes.paperMod}>
          <Grid container spacing={2}>
            <Grid item>
              <div className={classes.image}>
                <img src={props.getIcon(isFile, ext)} alt={ext} width="164" height="164" />
              </div>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="row" spacing={2}>
                <Grid item xs='12'>
                  <Typography variant="body2" color="textSecondary">
                    Nombre:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {name}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary">
                    Extensión: 
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {ext}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Última modificación:
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {lastModified}
                  </Typography>
                </Grid>
                <Grid item xs>
                <Typography variant="body2" color="textSecondary">
                    Tamaño:
                  </Typography>
                <Typography gutterBottom variant="subtitle1">
                    {size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nivel
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {nivel}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      </Box>
      )
    }
}

export default Files;