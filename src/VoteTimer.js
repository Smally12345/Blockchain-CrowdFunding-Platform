import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CountDownCircle from "./CountDownCircle";

const normalise = value => (value - 0) * 100 / (300 - 0);
function CircularProgressWithLabel(props) {
  

  return (
    <Box position="relative" display="inline-flex">
        <CountDownCircle value = {normalise(props.value)}  />
        <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
        <Typography variant="caption" component="div" color="textSecondary">{props.value}s</Typography>
      </Box>
    </Box>
  );
}
export default CircularProgressWithLabel;