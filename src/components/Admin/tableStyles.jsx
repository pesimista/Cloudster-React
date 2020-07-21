import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TableHead from '@material-ui/core/TableHead';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const useStyles = makeStyles({
  a: { color: '#228dff' },
  p0: { padding: '0px' },
  text: { color: '#fff' },
  elevation0: {
    boxShadow: 'none',
    borderRadius: 0,
    maxHeight: '100%',
    minHeight: '100%',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '& img': {
      width: '50%',
      maxWidth: '35px',
    },
  },
  table: {
    minWidth: 650,
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiTableCell-body ': {
      padding: '8px',
    },
    '& .MuiTableRow-root': {
      '&.disabled': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
      '&.suspended': {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
    },
    '& .MuiButtonBase-root': {
      color: 'rgba(0, 0, 0, 0.9)',
      '&.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  dark: {
    minWidth: 650,
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& .MuiTableBody-root': {
      backgroundColor: '#393d46',
    },
    '& .MuiTableRow-root': {
      '&.disabled': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&.suspended': {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
    },
    '& .MuiTableCell-body ': {
      padding: '8px',
    },
    '& .MuiTableCell-head': {
      borderBottom: '2px solid #7d7d7d',
      backgroundColor: '#424242',
    },
    '& .MuiTableCell-body': {
      borderBottom: '2px solid #7d7d7d',
    },
    '& .MuiSelect-select:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
  },
});

export const SelectCell = ({
  nivel,
  identifier,
  className,
  onChange,
  disabled,
}) => {
  return (
    <FormControl className={className}>
      <InputLabel id={`select-label-${identifier}`}>Nivel</InputLabel>
      <Select
        labelId={`select-label-${identifier}`}
        id={`select-${identifier}`}
        value={nivel}
        name={identifier}
        disabled={disabled}
        onChange={(event) => onChange(event.target)}
      >
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
    </FormControl>
  );
};

export const TableHeader = ({ columns }) => {
  if (!columns) {
    return '';
  }
  const columnsMap = columns.map(({ label, align }, i) => (
    <TableCell align={align} key={'col-' + i}>
      {label}
    </TableCell>
  ));

  return (
    <TableHead>
      <TableRow style={{ zIndex: '20' }}>{columnsMap}</TableRow>
    </TableHead>
  );
};

export const ConfirmDialog = ({
  open,
  text,
  handleClose,
  theme,
  confirmText = 'Si, seguro',
  cancelText = 'Cancelar',
}) => {
  if (!open) {
    return '';
  }

  const classes = makeStyles(() => ({
    dim: {
      '& .MuiDialogTitle-root': {
        backgroundColor: '#4caf50',
        textAlign: 'center',
        color: '#fff',
        padding: '12px 0 8px',
      },
    },
    dark: {
      '& .MuiPaper-root': {
        backgroundColor: '#666',
      },
      '& .MuiDialogTitle-root': {
        backgroundColor: '#424242',
        textAlign: 'center',
        color: '#fff',
        padding: '12px 0 8px',
      },
      '& .MuiButton-containedPrimary': {
        backgroundColor: '#424242',
      },
    },
    dialogContent: {
      margin: 'auto',
      paddingTop: '8px',
      minWidth: '340px',
      '& h2': {
        textAlign: 'center',
        padding: '0.5rem 3rem 1rem',
        fontSize: '1rem',
      },
      '& .MuiButton-root': {
        width: '50%',
        borderRadius: '0',
        fontWeight: '500',
      },
      '& .MuiButton-containedPrimary': {
        fontWeight: '600',
      },
    },
  }))();

  return (
    <Dialog
      open={true}
      className={theme ? classes.dark : classes.dim}
      onClose={() => handleClose()}
    >
      <DialogTitle>Dialogo de confirmación</DialogTitle>
      <Box className={classes.dialogContent}>
        <Typography variant="subtitle2" component="h2">
          {text}
        </Typography>
        <Box>
          <Button
            variant="contained"
            className="cancel"
            disableElevation
            type="submit"
            onClick={() => handleClose(false)}
            size="large"
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            type="submit"
            onClick={() => handleClose(true)}
            size="large"
          >
            {confirmText}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
