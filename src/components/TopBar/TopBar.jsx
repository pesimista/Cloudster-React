import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import React, { useContext } from 'react';
import { saduwux } from '../SF/Context';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'static',
    gridColumnStart: 1,
    gridColumnEnd: 3,
    [theme.breakpoints.down('xs')]: {
      gridColumnStart: 1,
      gridColumnEnd: 2,
    },
  },
  menuButton: { marginRight: theme.spacing(2) },
  inputRoot: { color: 'inherit' },
  icon: {
    margin: 0,
    [theme.breakpoints.down('xs')]: { marginRight: theme.spacing(2) },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: { display: 'block' },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: fade(theme.palette.common.white, 0.25) },
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
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: 200 },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: { display: 'flex' },
  },
}));

const routes = [`busqueda`, `lista`];

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

const TopBar = () => {
  const classes = useStyles();
  const location = useLocation();

  const {
    state: {
      search,
      theme,
      user: { usuario },
    },
    dispatch,
  } = useContext(saduwux);

  const handleCheck = (event) =>
    dispatch({
      type: 'update',
      payload: { theme: event.target.checked },
    });

  const searchBar = () => {
    if (!routes.some((route) => location.pathname.includes(route))) {
      return '';
    }
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Buscar..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={(e) =>
            dispatch({ type: 'update', payload: { search: e.target.value } })
          }
        />
      </div>
    );
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <FilterDramaIcon className={classes.icon} />
        <Typography className={classes.title} variant="h5" noWrap>
          Cloudster
        </Typography>
        {searchBar()}
        <div className={classes.grow} />
        <Link
          component={reactLink}
          to="/Perfil"
          color="inherit"
          underline="none"
        >
          <Box display={{ xs: 'none', sm: 'flex' }}>
            <AccountCircle />
            <Typography>{usuario}</Typography>
          </Box>
        </Link>
        <Switch
          checked={theme}
          onChange={handleCheck}
          value="theme"
          color={theme ? '' : 'primary'}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
