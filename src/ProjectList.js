import React from 'react';
import web3 from './contracts/web3';
import CrowdFundInstance from './contracts/CrowdFundInstance';
import ProjectInstance from './contracts/ProjectInstance';
import {Box, Grid, Card, CardContent, CardActions, Typography, TextField, Button, Paper, Chip, LinearProgress, CircularProgress} from '@material-ui/core';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const states = ["Fundraising", "Fundsraised", "Completed", "Expired"]
const StateColors = ["primary", "secondary","default", "secondary"]
class ProjectList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        loading:true,
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
      }
      this.setState({
        projects : [...this.state.projects, projectdata]
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
  
  handleFund(projectaddr, idx){
      const project = ProjectInstance(projectaddr)
      project.methods.contribute().send({
        from: this.state.address,
        value: web3.utils.toWei(this.state.projects[idx].fundingAmt.toString(), 'ether')
      }).then((res)=>{
        alert("success")
        let projects = [...this.state.projects]
        let project = {...this.state.projects[idx]}
        const data = res.events.Fund.returnValues;
        project.currentBalance = data.CurrentBalance / 10**18
        project.state = data.state
        project.backers = data.backers
        project.fundingAmt = "0"
        projects[idx] = project
        this.setState({
          projects
        })
      }).catch((err)=>{
        alert(err)
      })
      
  }
  handleFundChange(idx, e){
    let projects = [...this.state.projects]
    let project = {...this.state.projects[idx]}
    project.fundingAmt = e.target.value
    projects[idx] = project
    this.setState({
      projects
    })
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
        var progress = (project.currentBalance/project.goal) * 100
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
                  <Typography variant="body2" color="textSecondary">{project.currentBalance} ETH</Typography>
                </Box>
                <Box width="100%" mr={2}>
                  <LinearProgress style={{height:10, borderRadius:2}} variant="determinate" value={progress} />
                </Box>
                <Box minWidth={25}>
                  <Typography variant="body2" color="textSecondary">{project.goal} ETH</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <TextField  name = "fundingAmount" variant="outlined" type = "number" label="Amount" InputLabelProps={{shrink: true,}} value={project.fundingAmt} onChange = {(e)=>{this.handleFundChange(index,e)}}/>
              {(project.state === "0") && <Button size="small" color="primary" variant="contained" onClick={()=>{this.handleFund(project.address,index)}} >Fund</Button>}
              {(project.state !== "0") && <Button disabled size="small" color="secondary" variant="contained" onClick={()=>{this.handleFund(project.address,index)}} >Fund</Button>}
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
export default ProjectList;