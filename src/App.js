import React from 'react';
import web3 from './contracts/web3'
import CrowdFundInstance from './contracts/CrowdFundInstance';
import ProjectInstance from './contracts/ProjectInstance';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
class App extends React.Component{
  constructor(){
    super()
    this.state ={
      projects: [],
      address : "",
      loading : true,
    }
    this.CreateProject = this.CreateProject.bind(this);
  }
  async load(){
    const accounts = await web3.eth.getAccounts()
    this.setState({
      address : accounts[0],
    })
    const arr = await CrowdFundInstance.methods.returnAllProjects().call()
    for(var i = 0; i < arr.length; i++){
      const project = ProjectInstance(arr[i])
      const data = await project.methods.getDetails().call()
      const projectdata = {
        address : arr[i],
        title : data.ProjectTitle,
        desc : data.ProjectDesc,
        goal : data.AmountGoal/ 10**18,
        currentBalance : data.CurrentBal/ 10**18,
        fundingAmt:0,
        state :data.CurrentState,
        deadline : new Date(data.Deadline * 1000),
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
  CreateProject(data){
    this.setState({
      loading:true,
    })
    CrowdFundInstance.methods.startProject(data.Title, data.Desc, web3.utils.toWei(data.Goal, 'ether'), data.Deadline).send({from:this.state.address}).then((res)=>{
      alert("Project Created Successfully")
      const projectInfo = res.events.ProjectStarted.returnValues;
      const projectdata = {
        address : projectInfo.contractAddress,
        title : projectInfo.projectTitle,
        desc : projectInfo.projectDesc,
        goal : projectInfo.goal/ 10**18,
        currentBalance : 0,
        fundingAmt:0,
        state : "0", 
        deadline : new Date(projectInfo.deadline * 1000)
      }
      this.setState({
        projects : [...this.state.projects, projectdata],
        loading:false
      })
    }).catch(()=>{
      alert("Error in Creating New Project")
      this.setState({
        loading:false,
      })
    })
  }
  
  
  render(){
    if(this.state.loading ){
      return(<h1>loading</h1>)
    }
    return(
      <>
        <h1>Projects</h1>
        <ProjectForm address = {this.state.address} CreateProject = {this.CreateProject}/>
        <ProjectList address = {this.state.address} projects = {this.state.projects}/>
        <>
        </>
      </>
    )
  }

}
export default App;