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
      imgBuffer:null,
      DialogOpen: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.captureFile = this.captureFile.bind(this);
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

  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };
  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
      const imgBuffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
      this.setState({imgBuffer});
  };

  render(){
  return(
    <Grid>
    <Button variant="contained" color="secondary" size="large" onClick={this.handleOpen}>
        Start New Project
      </Button>
      <Dialog fullWidth={true} open={this.state.DialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Start New Project</DialogTitle>
        <form onSubmit={(event)=>{
            event.preventDefault();
            const data = {Title :this.state.Title, Desc:this.state.Desc, Goal:this.state.Goal, Deadline:this.state.Deadline, Checkpoints:this.state.Checkpoints, imgBuffer:this.state.imgBuffer};
            this.props.CreateProject(data)}} noValidate autoComplete="off">
        <DialogContent>
          <TextField  fullWidth name = "Title" label="Title" value={this.state.Title} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Desc" label="Description" value={this.state.Desc} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Goal" label="Target Amount" value={this.state.Goal} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Deadline" label="Deadline" value={this.state.Deadline} onChange = {this.handleChange}/><br/><br/>
          <TextField  fullWidth name = "Checkpoints" label="Checkpoints" value={this.state.Checkpoints} onChange = {this.handleChange}/><br/>
          <input 
              type = "file"
              onChange = {this.captureFile}
            />
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