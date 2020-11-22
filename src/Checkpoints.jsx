import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Checkpoints extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeStep : this.props.completedCheckpoints,
            steps : ['Checkupointo Ichi', 'Checkupointo Ni', 'Checkupointo San'],
        }
    }
    handleClick = () =>{
        this.props.handleCheckpoint(this.props.idx, this.props.projectaddr)
        this.handleNext()
    }
    
    handleNext = () => {
        var activeStep = this.state.activeStep + 1
        this.setState({
            activeStep
        })
    }
    render(){
        console.log(this.props.totalCheckpoints)
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
                    {this.state.activeStep === this.props.totalCheckpoints ? (
                    <div>
                        <Typography style={{marginTop:1, marginBottom:1}}>All steps completed</Typography>
                    </div>
                    ) : (
                    <div>
                        <Button variant="contained" color="primary" onClick={this.handleClick}>
                            Finish Checkpoint
                        </Button>
                    </div>
                    )}
                </div>
            </div>
        )
    }
}
export default Checkpoints;