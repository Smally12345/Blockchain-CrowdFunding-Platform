import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

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
        return(
            <div style={{width:"100%"}}>
                <Stepper activeStep={parseInt(this.props.project.completedCheckpoints)} alternativeLabel>
                    {this.state.steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </div>
        )
    }
}
export default Checkpoints;