import React from 'react';
import web3 from './contracts/web3'
import CrowdFundInstance from './contracts/CrowdFundInstance';
import ProjectList from './ProjectList';
import MyProjectList from './MyProjectList';
import ProjectFundedList from './ProjectFundedList'; 
import ProjectForm from './ProjectForm';
import {Grid, CircularProgress, Tabs, Tab, AppBar} from '@material-ui/core';

import './App.css'
class App extends React.Component{
  constructor(){
    super()
    this.state ={
      address : "",
      loading : true,
      tabvalue:0,
    }
    this.CreateProject = this.CreateProject.bind(this);
  }
  async load(){
    const accounts = await web3.eth.getAccounts()
    this.setState({
      address : accounts[0],
    })
  }
  componentDidMount(){
      this.load().then(()=>{
      this.setState({
        loading:false
      })
    })
  }
  CreateProject(data){
    this.setState({
      loading:true,
    })
    CrowdFundInstance.methods.startProject(data.Title, data.Desc, web3.utils.toWei(data.Goal, 'ether'), data.Deadline, data.Checkpoints).send({from:this.state.address}).then((res)=>{
      alert("Project Created Successfully")
      // const projectInfo = res.events.ProjectStarted.returnValues;
      // const projectdata = {
      //   address : projectInfo.contractAddress,
      //   title : projectInfo.projectTitle,
      //   desc : projectInfo.projectDesc,
      //   goal : projectInfo.goal/ 10**18,
      //   currentBalance : 0,
      //   fundingAmt:0,
      //   state : "0", 
      //   deadline : new Date(projectInfo.deadline * 1000),
      //   totalCheckpoints: projectInfo.TotalCheckpoints,
      //   completedCheckpoints : 0,
      //   paid : 0,
      //   backers : [],
      //   votingState : false,
      //   hasVoted: [],
      //   votingResult : false,
      // }
      this.setState({
        // projects : [...this.state.projects, projectdata],
        // projects_started : [...this.state.projects_started, projectdata],
        loading:false
      })
    }).catch(()=>{
      alert("Error in Creating New Project")
      this.setState({
        loading:false,
      })
    })
  }

  handleChange = (e, newvalue)=>{
    this.setState({
      tabvalue : newvalue,
    })
  }
  
  
  render(){
    if(this.state.loading ){
      return(
      <center><CircularProgress size={100} style={{marginTop:50}}/></center>
      )
    }
    return(
      <Grid container style={{width:"100%"}}>
         <AppBar >
          <Tabs value={this.state.tabvalue} onChange={this.handleChange}  centered variant="fullWidth">
            <Tab label="All Projects" />
            <Tab label="Projects Started" />
            <Tab label="Projects Funded" />
          </Tabs>
        </AppBar>
         <Grid container  direction="row" justify = "center" alignItems = "center" spacing={2} className="divJumbotron" style={{paddingTop:"25%"}} >
            <Grid container  item justify = "center" alignItems = "center" xs = {12} >
                <ProjectForm address = {this.state.address} CreateProject = {this.CreateProject}/>
              </Grid>
            {(this.state.tabvalue === 0) && 
              <Grid container item  justify = "center" alignItems = "center"  xs = {12} spacing={5} >
                <ProjectList address = {this.state.address} />
              </Grid>
            }
            {(this.state.tabvalue === 1) && 
              <Grid container item justify = "center" alignItems = "center" xs = {12} spacing={5} >
                <MyProjectList address = {this.state.address} />
              </Grid>
            }
            {(this.state.tabvalue === 2) && 
              <Grid container item justify = "center" alignItems = "center" xs = {12} spacing={5} >
                <ProjectFundedList address = {this.state.address}/>
              </Grid>
            }
          </Grid> 
        </Grid>
    )
  }

}
export default App;