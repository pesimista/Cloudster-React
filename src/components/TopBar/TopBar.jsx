import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Switch from '@material-ui/core/Switch';
import { withStyles, makeStyles, fade } from '@material-ui/core/styles';
/*import { AppBar, Toolbar, Typography, InputBase, fade, makeStyles } from '@material-ui/core'*/

/*import { Wifi as WifiIcon, Search as SearchIcon, AccountCircle} from '@material-ui/icons';*/
import WifiIcon from '@material-ui/icons/Wifi';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

const useStyles = makeStyles(theme => ({
	grow: {
	  flexGrow: 1,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	menuButton: {
	  marginRight: theme.spacing(2),
	},
	title: {
	  display: 'none',
	  [theme.breakpoints.up('sm')]: {
		display: 'block',
	  },
	},
	search: {
	  position: 'relative',
	  borderRadius: theme.shape.borderRadius,
	  backgroundColor: fade(theme.palette.common.white, 0.15),
	  '&:hover': {
		backgroundColor: fade(theme.palette.common.white, 0.25),
	  },
	  marginRight: theme.spacing(2),
	  marginLeft: 0,
	  width: '100%',
	  [theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	  },
	},
	searchIcon: {
	  width: theme.spacing(7),
	  height: '100%',
	  position: 'absolute',
	  pointerEvents: 'none',
	  display: 'flex',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	inputRoot: {
	  color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
		  width: 200,
		},
	},
	sectionDesktop: {
	  display: 'none',
	  [theme.breakpoints.up('md')]: {
		display: 'flex',
	  },
	},
  }));

  const PurpleSwitch = withStyles({
	switchBase: {
	  color: green[300],
	  '&$checked': {
		color: orange[500],
	  },
	  '&$checked + $track': {
		backgroundColor: orange[500],
	  },
	},
	checked: {},
	track: {},
  })(Switch);

const TopBar = (props)  => {
	const classes = useStyles();

	const search = (showBar, showSearch) => {
		if((showBar===4)||(showBar===1))
		return(
			<div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={!showSearch ? "Buscar archivos..." : "Buscar usuario..."}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
			  inputProps={{ 'aria-label': 'search' }}
			  onChange={(e) => {!showSearch ? props.onSearchFileChange(e) : props.onSearchUserChange(e) }}
            />
          </div>
		)
		else 
		return;
	}

	return (
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
		<WifiIcon />
          <Typography className={classes.title} variant="h5" noWrap>
            Cloudster
          </Typography>
			{search(props.showBar, props.showSearch)}
          <div className={classes.grow} />
		<AccountCircle />
		<Typography>
			{props.name}
		</Typography>
		<Switch
        checked={props.useTheme}
        onChange={(e) => props.updateSwitch(e)}
        value="theme"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
        </Toolbar>
      </AppBar>
	);
}

export default TopBar;