import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 400 : 700],
  },
  top: {
    color: theme.palette.warning.dark,
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function FacebookCircularProgress(props) {
  const classes = useStylesFacebook();
  console.log(props)
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        thickness={4}
        size={60}
        value={100}
      />
      <CircularProgress
        variant="static"
        className={classes.top}
        size={60}
        value={props.value}
        thickness={4}
      />
    </div>
  );
}



export default function CustomizedProgressBars(props) {

  return (
      <FacebookCircularProgress value = {props.value}/>
  );
}
