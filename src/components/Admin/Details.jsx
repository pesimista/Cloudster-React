import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import {
  Label,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import { handleFetch } from '../SF/helpers';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';

const useStyles = makeStyles(() => ({
  main: {
    height: '100%',
    '& .card-box': {
      minWidth: 300,
      maxWidth: 500,
      width: '100%',
      '& .MuiSvgIcon-root': {
        fontSize: 200,
        width: '100%',
      },
      '& .MuiCardHeader-root': {
        textAlign: 'center',
      },
      '& .MuiCard-root': {
        minWidth: 300,
        maxWidth: 500,
        margin: '1rem',
        width: '100%',
        height: 'min-content',
        '& .MuiCardContent-root:last-child': {
          paddingBottom: 16,
        },
      },
      '& .center': {
        display: 'flex',
        justifyContent: 'center',
      },
    },
  },
  list: {
    overflow: 'auto',
    maxHeight: 300,
  },
  dark: {
    backgroundColor: '#393d46',
    color: '#fff',
    '& .files': {
      color: '#4caf50',
    },
    '& .MuiSvgIcon-root': {
      color: '#fff',
    },
  },
  dim: {
    color: 'white',
    '& .files': {
      color: '#4caf50',
    },
    '& .MuiSvgIcon-root': {
      color: '#ffa726',
    },
  },
}));

const initialState = {
  totalSize: 0,
  total: 0,
  chartData: null,
  actions: 0,
  parsedSize: '',
};

const Details = ({ type = 'files', onResponse, loadingComponent, dark }) => {
  const isFile = Boolean(type === 'files');
  const classes = useStyles();

  const [state, setState] = React.useState({ ...initialState });

  React.useEffect(() => {
    setState(initialState);
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };

    setState(initialState);
    fetch(`http://localhost:1234/api/admin/${type}/details`, headers)
      .then(handleFetch)
      .then((data) => {
        setTimeout(() => setState(data), 500);
      })
      .catch((mistake) => {
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: mistake.message,
        });
      });
  }, [type, onResponse]);

  if (!state.chartData) {
    return loadingComponent;
  }
  const noun = isFile ? 'Archivos' : 'Usuarios';

  const parsedSize = !state.parsedSize ? (
    ''
  ) : (
    <Grid xs={6} item>
      <Typography align="center" variant="subtitle1" component="p">
        <strong>{state.parsedSize} </strong>
        Almacenados
      </Typography>
    </Grid>
  );

  return (
    <Grid
      container
      className={`${classes.main} ${dark ? classes.dark : classes.dim}`}
      justify="center"
    >
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
        wrap="nowrap"
        className="card-box"
      >
        <Card raised={false}>
          <CardHeader title={noun} />
          <Divider />
          <CardContent>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid
                xs={12}
                item
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Typography className="files" variant="h2" component="h2">
                  {state.total}
                </Typography>
                <Typography
                  style={{ paddingLeft: 5 }}
                  variant="h6"
                  component="h2"
                >
                  {noun} en el servidor
                </Typography>
              </Grid>
              <Grid xs={6} item>
                <Typography align="center" variant="subtitle1" component="p">
                  <strong>{state.available} </strong>
                  {noun === 'Archivos' ? 'Disponibles' : 'Activos'}
                </Typography>
              </Grid>
              <Grid xs={6} item>
                <Typography align="center" variant="subtitle1" component="p">
                  <strong>{state.disabled} </strong>
                  Suspendidos
                </Typography>
              </Grid>
              <Grid xs={6} item>
                <Typography align="center" variant="subtitle1" component="p">
                  <strong>{state.actions} </strong>
                  {noun === 'Archivos'
                    ? 'Archivos descargados'
                    : 'Acciones de los usuarios'}
                </Typography>
              </Grid>
              {parsedSize}
            </Grid>
          </CardContent>
        </Card>
        <Box style={{ width: '100%' }}>
          <CloudQueueIcon />
        </Box>
      </Grid>
      <Grid
        container
        item
        direction="row"
        justify="center"
        alignItems="center"
        wrap="nowrap"
        className="card-box"
      >
        <Card raised={false}>
          <CardHeader title={'Resumen de ' + noun} />
          <Divider />
          <CardContent className="center">
            <DetailsPieChart data={state.chartData} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const dummy = [
  { name: 'asd', value: 5121 },
  { name: 'fgh', value: 1231 },
  { name: 'jkl', value: 1238 },
];
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF6633',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

const DetailsPieChart = ({ data = dummy }) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const Cells = data.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ));
  return (
    <ResponsiveContainer width="85%" aspect={1}>
      <PieChart width={730} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          fill="#8884d8"
          paddingAngle={2}
          innerRadius="40%"
          legendType="square"
          label
        >
          <Label />
          {Cells}
        </Pie>
        <Legend
          layout={matches ? 'vertical' : 'horizontal'}
          verticalAlign={matches ? 'middle' : 'bottom'}
          align={matches ? 'left' : 'center'}
          iconType="square"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default Details;
