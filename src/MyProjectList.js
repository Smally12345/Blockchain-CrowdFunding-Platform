import React from 'react';
import ProjectInstance from './contracts/ProjectInstance';
import {Box, Grid, Card, CardContent, Typography, TextField, Button, Paper, Chip, LinearProgress} from '@material-ui/core';
import Checkpoints from './Checkpoints';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const states = ["Fundraising", "Fundsraised","Completed"]
const StateColors = ["primary", "secondary","default"]
class MyProjectList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        address : this.props.address,
        projects: this.props.projects,
    }
  }
  
  handleCheckpoint = (idx, projectaddr)=>{
    const project = ProjectInstance(projectaddr)
    project.methods.completeCheckpoints().send({
      from: this.state.address,
    }).then((res)=>{
      alert("checkpoint completed")
      let projects = [...this.state.projects]
      let project = {...this.state.projects[idx]}
      const data = res.events.Checkpoint.returnValues;
      project.paid = data.paid / 10**18
      project.state = data.state
      project.completedCheckpoints = data.CompletedCheckpoints
      projects[idx] = project
      this.setState({
        projects
      })
    }).catch((err)=>{
      alert(err)
    })
}
  
  render(){
 
    return(
      <>{this.state.projects.map((project,index) => {
        const day = this.state.projects[index].deadline.getDate().toString()
        const month = months[this.state.projects[index].deadline.getMonth()]
        const year = this.state.projects[index].deadline.getFullYear().toString()
        const date = day + " " + month + " " + year
        var progress = (project.paid/project.currentBalance) * 100
        if(progress > 100){
          progress = 100
        }
        
        return(
          <Grid  item xs = {12} > 
          <Paper elevation = {2} >
          <Card elevation ={2} variant="outlined" key={index} style={{padding:"20px",boxShadow: "0px 50px 80px 0px rgba(15,19,25,0.1)"}}>
            <CardContent>
              <Chip label={states[project.state]} color={StateColors[project.state]} />
              <Typography style={{float:"right"}}>Deadline: {date} </Typography>
              <center><Typography variant = "h4">{project.title}</Typography></center>
              <Typography variant = "body1" style={{marginTop:"2%", marginBottom:"2%"}} >{project.desc}</Typography>
              <Box display="flex" alignItems="center">
                <Box minWidth={25}>
                  <Typography variant="body2" color="textSecondary">{project.paid} ETH</Typography>
                </Box>
                <Box width="100%" mr={2}>
                  <LinearProgress style={{height:10, borderRadius:2}} variant="determinate" value={progress} />
                </Box>
                <Box minWidth={25}>
                  <Typography variant="body2" color="textSecondary">{project.currentBalance} ETH</Typography>
                </Box>
              </Box>
              <Checkpoints idx = {index} projectaddr = {project.address} completedCheckpoints = {project.completedCheckpoints} totalCheckpoints = {project.totalCheckpoints} handleCheckpoint = {this.handleCheckpoint}/>
            </CardContent>
          </Card>
          </Paper>
          </Grid>
        )
      })}
    </>
  )
  }

}
export default MyProjectList;