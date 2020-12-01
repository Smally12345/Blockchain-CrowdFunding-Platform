import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {withStyles, makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import StepConnector from '@material-ui/core/StepConnector';
import PropTypes from 'prop-types';
import Check from '@material-ui/icons/Check';
import Circle from '@material-ui/icons/PlayCircleFilled';
const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
      },
    active: {
      '& $line': {
        borderColor: '#041727',
      },
    },
    completed: {
      '& $line': {
        borderColor: '#041727',
      },
    },
    line: {
      borderColor: 'grey',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);
  
  const useQontoStepIconStyles = makeStyles({
    root: {
      color: 'grey',
      display: 'flex',
      height: 50,
      alignItems: 'center',
    },
    active: {
      color: '#041727',
    },
    circle: {
        color: 'currentColor',
        zIndex: 1,
        fontSize: 30,
    },
    completed: {
      color: '#041727',
      zIndex: 1,
      fontSize: 30,
    },
  });
  
  function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;
  
    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
        })}
      >
        {completed ? <Check className={classes.completed} /> : <Circle className={classes.circle} />}
      </div>
    );
  }
  
  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
  };
class Checkpoints extends React.Component{
    constructor(props){
        super(props)
        var stepslength = this.props.project.totalCheckpoints
        var steps = []
        for(var i = 0; i < stepslength; i++){
            steps.push(i+1)
        }
        this.state = {
            steps : steps,
        }
    }
    
    render(){
        const {classes} = this.props
        return(
            <div style={{width:"100%"}}>
                <Stepper  orientation="vertical" activeStep={parseInt(this.props.project.completedCheckpoints)}  connector={<QontoConnector />}>
                    {this.state.steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </div>
        )
    }
}
export default (Checkpoints);