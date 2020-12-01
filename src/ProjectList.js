import React from 'react';
import CrowdFundInstance from './contracts/CrowdFundInstance';
import ProjectInstance from './contracts/ProjectInstance';
import {withStyles, Divider, Grid, Card, CardContent, CardActionArea,CardHeader,CardMedia,Typography,  Button, CircularProgress, Collapse} from '@material-ui/core';
import {Link} from 'react-router-dom';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
// const states = ["Fundraising", "Fundsraised", "Completed", "Expired"]
// const StateColors = ["primary", "secondary","default", "secondary"]
const styles = theme => ({
  root: {
    maxWidth: 400,
    height:"100%",
    boxShadow: "30px 50px 80px 30px rgba(15,19,25,0.1)"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  divider: {
    width:"50%",
  },
  dividerTwo: {
    width:"50%",
    height:5,
    color:"black"
  }
});
var ipfsurl = "https://ipfs.io/ipfs/"
class ProjectList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        loading:true,
        address : this.props.address,
        projects: [],
        expanded:[],
    }
  }

  async load(){
    this.setState({loading:true})
    const arr = await CrowdFundInstance.methods.returnAllProjects().call()
    
    for(var i = 0; i < arr.length; i++){
      const project = ProjectInstance(arr[i])
      const data = await project.methods.getDetails().call()
      const imgHash = await project.methods.getImage().call()
      const projectdata = {
        address : arr[i],
        creator : data.Creator,
        title : data.ProjectTitle,
        desc : data.ProjectDesc,
        goal : data.AmountGoal/ 10**18,
        currentBalance : data.CurrentBal/ 10**18,
        state :data.CurrentState,
        deadline : new Date(data.Deadline * 1000),
        totalCheckpoints : data.total_checkpoints,
        completedCheckpoints : data.completed_checkpoints,
        paid : data.Paid / 10**18,
        backers : data.Backers,
        imgHash : imgHash,
      }
      this.setState({
        projects : [...this.state.projects, projectdata],
        expanded: [...this.state.expanded, false]
      })
    }
  }
  componentDidMount(){
      this.load().then(()=>{
      this.setState({
        loading:false
      })
    })
    window.ethereum.on('accountsChanged',  (accounts)=> {
      this.load().then(()=>{
        this.setState({
          loading:false,
        })
      })
    })
    
  }
  
  

  handleExpanded = (idx)=>{
    let expanded = [...this.state.expanded]
    expanded[idx] = !expanded[idx]
    this.setState({expanded})
  }
  
  render(){
    const { classes } = this.props;
    if(this.state.loading ){
      return(
        <center><CircularProgress size={50} style={{marginTop:50}}/></center>
      )
    }
    return(
      <Grid container direction="row" wrap="wrap" spacing={6}>
      {this.state.projects.map((project,index) => {
        const day = this.state.projects[index].deadline.getDate().toString()
        const month = months[this.state.projects[index].deadline.getMonth()]
        const year = this.state.projects[index].deadline.getFullYear().toString()
        const date = day + " " + month + " " + year
        var progress = (project.currentBalance/project.goal) * 100
        if(progress > 100){
          progress = 100
        }
        
        return(
          <Grid item key = {index}  xs={12} sm={4}>
          <Card className={classes.root}>
            <CardActionArea component={Link} to={`/project/${project.address}`}>
              <CardMedia
                className={classes.media}
                image= {ipfsurl.concat(project.imgHash)}
              />
              <CardHeader
                title={project.title}
                subheader={`Deadline: ${date}`}
              />
            </CardActionArea>
            <Divider variant="middle" className={classes.divider}/>
            <Button onClick={()=>{this.handleExpanded(index)}}>See Description</Button>
            <Collapse in={this.state.expanded[index]} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant="body2" color="textSecondary" align="left" component="p">
                  {project.desc}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
          </Grid>
        )
      })}
    </Grid>
  )
  }

}
export default withStyles(styles)(ProjectList);