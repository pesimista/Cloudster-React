import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { handleFetch } from '../../SF/helpers';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import Tooltip from '@material-ui/core/Tooltip';
import ChangePasswordDialog from './ChangePasswordDialog';
import {
  useStyles,
  SelectCell,
  TableHeader,
  ConfirmDialog,
} from '../tableStyles';
import { makeStyles } from '@material-ui/core/styles';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import CloudOffIcon from '@material-ui/icons/CloudOff';

const tableColumns = [
  { key: 'id', label: 'ID', align: 'left' },
  { key: 'usuario', label: 'Usuario', align: 'left' },
  { key: 'nombre', label: 'Nombre', align: 'left' },
  { key: 'nivel', label: 'Nivel', align: 'right' },
  { key: 'desde', label: 'Miembro desde', align: 'right' },
  { key: 'active', label: 'Estado', align: 'right' },
  { key: '', label: '', align: 'right' },
];

const initialState = {
  userList: null,
  changePassword: null,
  userToSuspend: null,
  shouldUpdate: false,
};

/** Reset type */
const reducer = (state, action) => {
  return {
    ...initialState,
    userList: state.userList,
    ...action,
  };
};

const UserTableContainer = ({ useTheme, adminID, onResponse }) => {
  const classes = useStyles();
  const { main } = makeStyles(() => ({
    main: {
      minHeight: '100%',
      minWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& .MuiCircularProgress-colorPrimary': {
        color: useTheme ? '#fff' : '#4caf50',
      },
    },
  }))();

  const [state, setState] = React.useReducer(reducer, {
    ...initialState,
    shouldUpdate: true,
  });
  const { userList, shouldUpdate } = state;

  React.useEffect(() => {
    if (!shouldUpdate) {
      return;
    }
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };

    fetch(`/api/admin/users`, headers)
      .then(handleFetch)
      .then((users) => {
        users = users.map((user) => ({
          ...user,
          short: user.id.slice(-5),
          updating: adminID === user.id,
        }));
        setState({ userList: users });
      })
      .catch((mistake) => alert('salio mal' + mistake.message));
  }, [shouldUpdate, adminID]);

  if (!userList) {
    return (
      <div className={main}>
        <CircularProgress size={100} thickness={5} />
      </div>
    );
  }

  const setUpdate = (index, value = true) => {
    const users = [...userList];
    users[index].updating = value;
    setState({ userList: users });
  };

  const toggleSuspend = (index) => {
    const users = [...userList];
    users[index].active = +!users[index].active;
    users[index].updating = false;
    setState({ userList: users });
  };

  const handleLevelChage = ({ name, value }, index) => {
    setUpdate(index);
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        nivel: value,
      }),
    };

    fetch(`/api/users/${name}`, headers)
      .then(handleFetch)
      .then((res) => {
        setState({ shouldUpdate: true });
        onResponse({
          key: new Date().getTime(),
          type: 'success',
          message: res.response
        });
      })
      .catch((err) => {
        setState({ shouldUpdate: true });
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: err.message
        });
      });
  };

  const handleChangePassword = (data) => {
    if (!data) {
      setState({ changePassword: null });
      return;
    }
    setUpdate(data.index);

    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ password: data.password }),
    };

    fetch(`/api/users/${data.userID}`, headers)
      .then(handleFetch)
      .then((res) => {
        setUpdate(data.index, false);
        onResponse({
          key: new Date().getTime(),
          type: 'success',
          message: res.response
        });
      })
      .catch((err) => {
        setUpdate(data.index, false);
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: err.message
        });
      });
  };

  const setHandlePassword = (user, index) => {
    setState({ ...state, changePassword: { ...user, index } });
  };

  const handleSuspend = (closeEvent) => {
    if (!closeEvent) {
      setState({ userToSuspend: null });
      return;
    }
    const user = { ...state.userToSuspend };
    setUpdate(state.userToSuspend.index);

    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ active: +!user.active }),
    };

    fetch(`/api/users/${user.id}`, headers)
      .then(handleFetch)
      .then((res) => {
        toggleSuspend(user.index);
        onResponse({
          key: new Date().getTime(),
          type: 'success',
          message: res.response
        });
      })
      .catch((err) => {
        setUpdate(state.userToSuspend.index, false);
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: err.message
        });
      });
  };

  const setSuspend = (user, index) => {
    setState({ ...state, userToSuspend: { ...user, index } });
  };

  const confirmText = () => {
    if (!state.userToSuspend) {
      return '';
    }
    if (state.userToSuspend.active) {
      return `¿Seguro deseas suspender a ${state.userToSuspend.usuario}?`;
    }
    return `¿Seguro deseas reactivar la cuenta de ${state.userToSuspend.usuario}?`
  }

  return (
    <React.Fragment>
      <TableContainer
        className={classes.elevation0}
        component={Paper}
        color="primary"
      >
        <Table stickyHeader className={useTheme ? classes.dark : classes.table}>
          <TableHeader columns={tableColumns} />
          <TableContent
            classes={classes}
            data={userList}
            onChangeSelect={handleLevelChage}
            onClickLock={setHandlePassword}
            onClickTrash={setSuspend}
            key="12gey12"
          />
        </Table>
      </TableContainer>
      <ChangePasswordDialog
        user={state.changePassword}
        handleClose={handleChangePassword}
      />
      <ConfirmDialog
        open={state.userToSuspend}
        handleClose={handleSuspend}
        theme={useTheme}
        text={confirmText()}
      />
    </React.Fragment>
  );
};

export default UserTableContainer;

const TableContent = ({
  classes,
  data,
  onChangeSelect,
  onClickLock,
  onClickTrash,
}) => {
  const content = data.map((value, index) => {
    const cells = tableColumns.map((col, i) => {
      let constent = value[col.key];
      switch (col.key) {
        case 'id':
          constent = value.short;
          break;
        case 'nivel':
          constent = (
            <SelectCell
              nivel={value.nivel}
              identifier={value.id}
              disabled={value.updating}
              onChange={(target) => onChangeSelect(target, index)}
            />
          );
          break;
        case 'active':
          constent = value.active ? 'Activo' : 'Suspendido';
          break;
        case 'nombre':
          constent = `${value.nombre} ${value.apellido}`;
          break;
        case '':
          constent = (
            <React.Fragment>
              <Tooltip title="Cambiar contraseña">
                <span>
                  <IconButton
                    disabled={value.updating}
                    aria-label="edit-password"
                    onClick={() => onClickLock(value, index)}
                  >
                    <EnhancedEncryptionIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Suspender usuario">
                <span>
                  <IconButton
                    disabled={value.updating}
                    aria-label="delete"
                    onClick={() => onClickTrash(value, index)}
                  >
                    {value.active ? <CloudQueueIcon /> : <CloudOffIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </React.Fragment>
          );
          break;
        default:
          break;
      }
      const component =
        col.key === 'nombre' || col.key === 'usuario' ? 'th' : 'td';
      return (
        <TableCell
          component={component}
          scope="row"
          className={col.key === 'nivel' ? classes.p0 : ''}
          align={col.align}
          key={`col-${i}-${value.ino}`}
        >
          {constent}
        </TableCell>
      );
    });

    const rowClass = () => {
      switch (true) {
        case value.updating:
          return 'disabled';
        case !value.active:
          return 'suspended';
        default:
          return '';
      }
    };

    return (
      <TableRow className={rowClass()} key={`row-${value.id}`}>
        {cells}
      </TableRow>
    );
  }, []);
  return <TableBody>{content}</TableBody>;
};

// const Alert = (props) => {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// };