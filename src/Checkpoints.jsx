import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Checkpoints extends React.Component{
    constructor(props){
        super(props)
        var stepslength = this.props.project.totalCheckpoints
        var steps = []
        for(var i = 0; i < stepslength; i++){
            steps.push(i+1)
        }
        this.state = {
            activeStep : this.props.project.completedCheckpoints,
            steps : steps,
        }
    }
    handleClick = () =>{
        this.props.handleCheckpoint(this.props.idx, this.props.project.address)
        // this.handleNext()
    }
    
    handleNext = () => {
        var activeStep = this.state.activeStep + 1
        this.setState({
            activeStep
        })
    }
    render(){
        console.log(this.props.project.totalCheckpoints)
        console.log(this.state.activeStep)
        return(
            <div style={{width:"100%"}}>
                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {this.state.steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
                <div>
                    {this.state.activeStep === this.props.project.totalCheckpoints ? (
                    <div>
                        <Typography style={{marginTop:1, marginBottom:1}}>All steps completed</Typography>
                    </div>
                    ) : (
                    <div>
                        {this.props.finishButton === true && ( 
                            <Button disabled={this.props.project.state !== "1" || this.props.project.votingState} variant="contained" color="primary" onClick={this.handleClick}>
                                Finish Checkpoint
                            </Button>
                            )
                        }
                    </div>
                    )}
                </div>
            </div>
        )
    }
}
export default Checkpoints;