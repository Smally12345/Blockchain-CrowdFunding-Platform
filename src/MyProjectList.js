import React from 'react';
import ProjectInstance from './contracts/ProjectInstance';
import CrowdFundInstance from './contracts/CrowdFundInstance';
import {Box, Grid, Card, CardContent, Typography, Paper, Button, Chip, LinearProgress, CircularProgress} from '@material-ui/core';
import Checkpoints from './Checkpoints';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const states = ["Fundraising", "Fundsraised","Completed", "Expired"]
const StateColors = ["primary", "secondary","default", "secondary"]
class MyProjectList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        loading : true,
        address : this.props.address,
        projects: [],
    }
  }
  
  async load(){
    const arr = await CrowdFundInstance.methods.returnAllProjects().call()
    for(var i = 0; i < arr.length; i++){
      const project = ProjectInstance(arr[i])
      const data = await project.methods.getDetails().call()
      const votingData = await project.methods.getVoteDetails().call()
      const refundVotingData = await project.methods.getRefundVoteDetails().call()
      const projectdata = {
        address : arr[i],
        creator : data.Creator,
        title : data.ProjectTitle,
        desc : data.ProjectDesc,
        goal : data.AmountGoal/ 10**18,
        currentBalance : data.CurrentBal/ 10**18,
        fundingAmt:0,
        state :data.CurrentState,
        deadline : new Date(data.Deadline * 1000),
        totalCheckpoints : data.total_checkpoints,
        completedCheckpoints : data.completed_checkpoints,
        paid : data.Paid / 10**18,
        backers : data.Backers,
        votingState : votingData.votingState,
        hasVoted: votingData.HasVoted,
        votingResult : votingData.result,
        yesCount : votingData.YesCount,
        noCount : votingData.NoCount,
        votingTime : votingData.votingTime,
        refundVotingState : refundVotingData.refundVotingState,
        refundHasVoted : refundVotingData.refundHasVoted,
        refundResult : refundVotingData.refundResult,
        refundYesCount : refundVotingData.refundYesCount,
        refundNoCount : refundVotingData.refundNoCount,
        refundVotingTime : refundVotingData.refundVotingTime,
      }
      if(data.Creator === this.state.address){
        this.setState({
          projects : [...this.state.projects, projectdata]
        }) 
      }
    }
    
  }
  componentDidMount(){
      this.load().then(()=>{
      this.setState({
        loading:false
      })
    })
  }

  handleCheckpoint = (idx, projectaddr)=>{
    const project = ProjectInstance(projectaddr)
    project.methods.triggerVoting().send({
      from: this.state.address,
    }).then((res)=>{
      alert("voting process started")
      let projects = [...this.state.projects]
      let project = {...this.state.projects[idx]}
      const data = res.events.Trigger.returnValues;
      project.votingTime = data.votingTime
      project.votingState = data.votingState
      projects[idx] = project
      this.setState({
        projects
      })
    }).catch((err)=>{
      alert(err)
    })
  }

  handleEndVoting = (idx, projectaddr)=>{
    const project = ProjectInstance(projectaddr)
    if(this.state.projects[idx].votingState === true){
      project.methods.endVoting().send({
        from: this.state.address,
      }).then((res)=>{
        alert("voting process terminated")
        let projects = [...this.state.projects]
        let project = {...this.state.projects[idx]}
        const data = res.events.VoteEvent.returnValues;
        project.votingResult = data.result
        project.votingState = data.votingState
        project.hasVoted = data.HasVoted
        const checkpointdata = res.events.Checkpoint.returnValues;
        project.paid = checkpointdata.paid/ 10**18
        project.completedCheckpoints = checkpointdata.CompletedCheckpoints
        project.state = checkpointdata.state
        projects[idx] = project
        this.setState({
          projects
        })
      }).catch((err)=>{
        alert(err)
      })
    }
    else if(this.state.projects[idx].refundVotingState === true){
      project.methods.endRefundVoting().send({
        from: this.state.address,
      }).then((res)=>{
        alert("refund voting process terminated")
        let projects = [...this.state.projects]
        let project = {...this.state.projects[idx]}
        const data = res.events.VoteEvent.returnValues;
        project.refundResult = data.result
        project.refundVotingState = data.votingState
        project.refundHasVoted = data.HasVoted
        projects[idx] = project
        this.setState({
          projects
        })
      }).catch((err)=>{
        alert(err)
      })
    }
    
  }
  
  render(){
    if(this.state.loading){
      return(
        <center><CircularProgress size={50} style={{marginTop:50}}/></center>
      )
    }
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
        if(project.state === "0"){
          progress = 0
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
                  <Typography variant="body2" color="textSecondary">{project.paid.toPrecision(4)} ETH</Typography>
                </Box>
                <Box width="100%" mr={2}>
                  <LinearProgress style={{height:10, borderRadius:2}} variant="determinate" value={progress} />
                </Box>
                <Box minWidth={25}>
                  <Typography variant="body2" color="textSecondary">{project.currentBalance} ETH</Typography>
                </Box>
              </Box>
              <Checkpoints idx = {index} project = {project} finishButton = {true} handleEndVoting = {this.handleEndVoting}/>
              <br/>
              <Button disabled={project.state !== "1" || project.votingState || project.refundVotingState} variant="contained" color="primary" onClick={() => {this.handleCheckpoint(index, project.address)}}>
                Finish Checkpoint
              </Button>
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