import React from 'react';
import { Grid,TextField, Button, Dialog, DialogContent, DialogActions, DialogTitle} from '@material-ui/core';
class App extends React.Component{
  constructor(props){
    super(props)
    this.state ={
      address : this.props.address,
      Title: "",
      Desc:"",
      Goal: 0,
      Deadline: "",
      Checkpoints:0,
      DialogOpen: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value,
    })
  }
  
  handleOpen(){
    this.setState({
      DialogOpen : true,
    })
  }
  handleClose(){
    this.setState({
      DialogOpen : false,
    })
  }
  render(){
  return(
    <Grid>
    <Button variant="contained" color="primary" size="large" onClick={this.handleOpen}>
        Start New Project
      </Button>
      <Dialog fullWidth={true} open={this.state.DialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Start New Project</DialogTitle>
        <form onSubmit={(event)=>{
            event.preventDefault();
            const data = {Title :this.state.Title, Desc:this.state.Desc, Goal:this.state.Goal, Deadline:this.state.Deadline, Checkpoints:this.state.Checkpoints};
            this.props.CreateProject(data)}} noValidate autoComplete="off">
        <DialogContent>
          <TextField  fullWidth name = "Title" label="Title" value={this.state.Title} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Desc" label="Description" value={this.state.Desc} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Goal" label="Target Amount" value={this.state.Goal} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Deadline" label="Deadline" value={this.state.Deadline} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Checkpoints" label="Checkpoints" value={this.state.Checkpoints} onChange = {this.handleChange}/><br/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose} type ="submit"  color="primary">
            Create
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
  }

}
export default App;