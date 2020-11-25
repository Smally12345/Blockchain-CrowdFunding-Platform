import React from 'react';
import ProjectInstance from './contracts/ProjectInstance';
import CrowdFundInstance from './contracts/CrowdFundInstance';
import {Box, Grid, Card, CardContent, CardActions, Typography, Button, Paper, Chip, LinearProgress, CircularProgress, FormControlLabel, FormGroup, Checkbox} from '@material-ui/core';
import Checkpoints from './Checkpoints'
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const states = ["Fundraising", "Fundsraised", "Completed", "Expired"]
const StateColors = ["primary", "secondary","default", "secondary"]
class ProjectFundedList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        loading : true,
        address : this.props.address,
        projects: [],
        checkedY : [],
        checkedN : [],
    }
  }

  async load(){
    const arr = await CrowdFundInstance.methods.returnAllProjects().call()
    for(var i = 0; i < arr.length; i++){
      const project = ProjectInstance(arr[i])
      const data = await project.methods.getDetails().call()
      var bindex = -1
      console.log(data.Backers)
      for(var j = 0; j < data.Backers.length; j++){
        if(data.Backers[j] === this.state.address){
          bindex = j
          break
        }
      }
      if(bindex === -1){
        continue
      }
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
        votingTime : votingData.votingTime,
        refundVotingState : refundVotingData.refundVotingState,
        refundHasVoted : refundVotingData.refundHasVoted,
        refundResult : refundVotingData.refundResult,
        refundYesCount : refundVotingData.refundYesCount,
        refundNoCount : refundVotingData.refundNoCount,
        refundVotingTime : refundVotingData.refundVotingTime,
        bindex,
      }
      this.setState({
        projects : [...this.state.projects, projectdata],
        checkedY : [...this.state.checkedY, false],
        checkedN : [...this.state.checkedN, false],
      })
    }
    
  }
  componentDidMount(){
      this.load().then(()=>{
      this.setState({
        loading:false
      })
    })
  }

  handleVote(idx, projectaddr){
      const project = ProjectInstance(projectaddr)
      var choice;
      if(this.state.checkedY[idx] && !this.state.checkedN[idx]){
        choice = true
      }
      else if(this.state.checkedN[idx] && !this.state.checkedY[idx]){
        choice = false
      }
      else{
        alert("Choose one option")
        return;
      }
      if(this.state.projects[idx].votingState === true){
        project.methods.Vote(choice, this.state.projects[idx].bindex).send({
          from: this.state.address,
        }).then((res)=>{
          alert("vote success")
          let projects = [...this.state.projects]
          let project = {...this.state.projects[idx]}
          const data = res.events.VoteEvent.returnValues;
          project.votingState = data.votingState
          project.hasVoted = data.HasVoted
          project.votingResult = data.result
          if(project.votingState === false && project.votingResult === true){
            const checkpointdata = res.events.Checkpoint.returnValues;
            console.log(checkpointdata)
            project.paid = checkpointdata.paid/ 10**18
            project.completedCheckpoints = checkpointdata.CompletedCheckpoints
            project.state = checkpointdata.state
          }
          else if(project.votingState === false && project.votingResult === false){
            const triggerdata = res.events.Trigger.returnValues;
            project.refundVotingState = triggerdata.votingState
            project.refundVotingTime = triggerdata.votingTime
          }
          projects[idx] = project
          let checkedY = [...this.state.checkedY]
          checkedY[idx] = false
          let checkedN = [...this.state.checkedN]
          checkedN[idx] = false
          this.setState({
            projects,
            checkedY,
            checkedN
          })
        }).catch((err)=>{
          alert(err)
        })
      }
      else if(this.state.projects[idx].refundVotingState === true){
        project.methods.refundVote(choice, this.state.projects[idx].bindex).send({
          from: this.state.address,
        }).then((res)=>{
          alert("vote success")
          let projects = [...this.state.projects]
          let project = {...this.state.projects[idx]}
          const data = res.events.VoteEvent.returnValues;
          project.refundVotingState = data.votingState
          project.refundHasVoted = data.HasVoted
          project.refundResult = data.result
          if(project.refundVotingState === false && project.refundResult === true){
            const refunddata = res.events.Refund.returnValues;
            project.paid = refunddata.Paid/ 10**18
            project.currentBalance = refunddata.Currentbalance
            project.state = refunddata.state
          }
          projects[idx] = project
          this.setState({
            projects
          })
        }).catch((err)=>{
          alert(err)
        })
      }
      
  }

  handleChange = (idx, e) => {
    if (e.target.name === "checkedY"){
      let checkedY = [...this.state.checkedY]
      checkedY[idx] = e.target.checked
      this.setState({
        checkedY
      })
    }
    else{
      let checkedN = [...this.state.checkedN]
      checkedN[idx] = e.target.checked
      this.setState({
        checkedN
      })
    }
    
  }
  
  render(){
    if(this.state.loading ){
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
        if(project.state === "0" || project.state === "3"){
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
              <Checkpoints idx = {index} project = {project} handleCheckpoint = {this.handleCheckpoint} finishButton = {false}/>
            </CardContent>
            <CardActions>
              {project.votingState && <><Typography variant = "body1" >Vote to approve completion of checkpoint</Typography><br/></>}
              {project.refundVotingState && <><Typography variant = "body1" >Vote for termination and refund:</Typography><br/></>}
              <FormGroup row>
                <FormControlLabel disabled={(!project.votingState || project.hasVoted[project.bindex]) && (!project.refundVotingState || project.refundHasVoted[project.bindex]) } control={<Checkbox checked={this.state.checkedY[index]} onChange={(e)=>{this.handleChange(index,e)}} name="checkedY" color="primary"/>} label="Yes"/>
                <FormControlLabel disabled={(!project.votingState || project.hasVoted[project.bindex]) && (!project.refundVotingState || project.refundHasVoted[project.bindex])} control={<Checkbox checked={this.state.checkedN[index]} onChange={(e)=>{this.handleChange(index,e)}} name="checkedN" color="secondary"/>} label="No"/>
                <Button disabled={(!project.votingState || project.hasVoted[project.bindex]) && (!project.refundVotingState || project.refundHasVoted[project.bindex]) } variant="contained" color="primary" onClick={()=>{this.handleVote(index, project.address)}}>Vote</Button>
              </FormGroup>
            </CardActions>
          </Card>
          </Paper>
          </Grid>
        )
      })}
    </>
  )
  }

}
export default ProjectFundedList;