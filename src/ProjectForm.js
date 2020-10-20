import React from 'react';
import { TextField, Button} from '@material-ui/core';
class App extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      address : this.props.address,
      Title: "",
      Desc:"",
      Goal: 0,
      Deadline: "",
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value,
    })
  }
  
  render(){
  return(
    <>
      <form onSubmit={(event)=>{
          event.preventDefault();
          const data = {Title :this.state.Title, Desc:this.state.Desc, Goal:this.state.Goal, Deadline:this.state.Deadline};
          this.props.CreateProject(data)}} noValidate autoComplete="off">
        <TextField  name = "Title" label="Title" value={this.state.Title} onChange = {this.handleChange}/>
        <TextField  name = "Desc" label="Description" value={this.state.Desc} onChange = {this.handleChange}/>
        <TextField  name = "Goal" label="Target Amount" value={this.state.Goal} onChange = {this.handleChange}/>
        <TextField  name = "Deadline" label="Deadline" value={this.state.Deadline} onChange = {this.handleChange}/>
        <center><Button type="submit">Start Project</Button></center>
      </form>
    </>
  )
  }

}
export default App;