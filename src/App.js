import React from 'react';
import web3 from './contracts/web3'
import CrowdFundInstance from './contracts/CrowdFundInstance';
import ProjectList from './ProjectList';
import MyProjectList from './MyProjectList';
import ProjectFundedList from './ProjectFundedList'; 
import ProjectForm from './ProjectForm';
import {withStyles, Grid, CircularProgress, Tabs, Tab, AppBar, Button, Typography, Divider} from '@material-ui/core';
import ipfs from './contracts/ipfs';
import './App.css'
const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
    overflow:"hidden"
  }
});
class App extends React.Component{
  constructor(){
    super()
    this.state ={
      address : "",
      loading : true,
      tabvalue:0,
      buffer :"",
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
  async CreateProject(data){
    this.setState({
      loading:true,
    })
    console.log(data)
    let imgData = await ipfs.add(data.imgBuffer)
    let ipfsHash = imgData.path
    CrowdFundInstance.methods.startProject(data.Title, data.Desc, web3.utils.toWei(data.Goal, 'ether'), data.Deadline, data.Checkpoints, ipfsHash).send({from:this.state.address}).then((res)=>{
      alert("Project Created Successfully")
      this.setState({
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
    const {classes} = this.props
    if(this.state.loading ){
      return(
      <center><CircularProgress size={100} style={{marginTop:50}}/></center>
      )
    }
    return(
      <div className={classes.root}>
      <Grid container>
        <Grid xs={12} sm={12} item >
         <AppBar position="fixed" >
          <Tabs value={this.state.tabvalue} onChange={this.handleChange} variant="fullWidth" centered className="TabClass">
            <Tab label="All Projects" />
            <Tab label="Projects Started" />
            <Tab label="Projects Funded" />
          </Tabs>
        </AppBar>
        </Grid>
         <Grid  item container direction="row" justify = "center" alignItems = "center" className="divJumbotron"  >
            <Grid item style={{marginTop:"15%"}}>
              <Typography variant="h3" style={{color:"white"}}>CROWDCHAIN</Typography><br/>
              <center><Typography variant="subtitle1" style={{color:"white"}}>Ethereum based CrowdFunding Platform</Typography></center>
            </Grid>
            <Grid container item justify = "center" alignItems = "center" xs = {12} >
              <ProjectForm address = {this.state.address} CreateProject = {this.CreateProject}/>
            </Grid>
          </Grid>
          <Grid item container style={{marginTop:"7%"}}>
            {(this.state.tabvalue === 0) && 
              <Grid container item xs = {12} justify = "center" alignItems = "center">
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
        </div>
    )
  }

}
export default withStyles(styles)(App);