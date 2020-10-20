import React from 'react';
import web3 from './contracts/web3'
import ProjectInstance from './contracts/ProjectInstance';
import {Card, CardContent, CardActions, Typography, TextField, Button} from '@material-ui/core';
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var states = ["Fundraising", "Completed", "Expired"]
class ProjectList extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        address : this.props.address,
        projects: this.props.projects,
    }
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
 
    return(
      <>{this.state.projects.map((project,index) => {
        const day = this.state.projects[index].deadline.getDate().toString()
        const month = months[this.state.projects[index].deadline.getMonth()]
        const year = this.state.projects[index].deadline.getFullYear().toString()
        const date = day + " " + month + " " + year
        return(
          <Card variant="outlined" key={index}>
            <CardContent>
              <Typography variant = "h4">{project.title}</Typography>
              <Typography variant = "body1">{project.desc}</Typography>
              <Typography variant = "body1">state: {states[parseInt(project.state)]}   deadline: {date} </Typography>
              <Typography >{project.currentBalance} ether : {project.goal} ether</Typography>
            </CardContent>
            <CardActions>
              <TextField  name = "fundingAmount" label="Amount" value={project.fundingAmt} onChange = {(e)=>{this.handleFundChange(index,e)}}/>
              {(project.state === "0") && <Button size="small" color="primary" variant="contained" onClick={()=>{this.handleFund(project.address,index)}} >Fund</Button>}
              {(project.state !== "0") && <Button disabled size="small" color="secondary" variant="contained" onClick={()=>{this.handleFund(project.address,index)}} >Fund</Button>}
            </CardActions>
          </Card>
        )
      })}
    </>
  )
  }

}
export default ProjectList;