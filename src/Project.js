import React from 'react';
import web3 from './contracts/web3';
import ProjectInstance from './contracts/ProjectInstance';
import CrowdFundInstance from './contracts/CrowdFundInstance';
import {withStyles, Box, Divider, Grid, Card, CardContent, CardActions, Typography, Button, Paper, Chip, LinearProgress, CircularProgress, TextField, FormControlLabel, FormGroup, Checkbox, AppBar, Tabs, Tab, Toolbar, FormControl, InputLabel, OutlinedInput, InputAdornment} from '@material-ui/core';
import Checkpoints from './Checkpoints'
import VoteTimer from './VoteTimer'
import {Link} from 'react-router-dom'
import { Icon, InlineIcon } from '@iconify/react';
import ethereumIcon from '@iconify-icons/mdi/ethereum';
import "./App.css";
import clsx from 'clsx';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const states = ["Fundraising", "Fundsraised", "Completed", "Expired"]
const StateColors = ["primary", "secondary","default", "secondary"]

const styles = theme => ({
  root:{
    flexGrow:1,
    display:'flex'
  },
  ImageHeader :{
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    height:"75vh",
    [theme.breakpoints.down('sm')]: {
      height: "65vh",
    },
    [theme.breakpoints.down('xs')]: {
      height: "55vh",
    },
  },
  textStyle: {
    fontFamily: 'family',
    color: theme.palette.secondary.main,
    fontSize: '2.5rem',
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  textfield:{
    marginRight:theme.spacing(2),
    width:"40%",
  },
  divider:{
    height:100,
  },
  fundButton : {
    backgroundColor: "#FFF",
    "&:hover": {
        backgroundColor: theme.palette.secondary.main,
        color:"white"
    },
  },
  butn:{
    backgroundColor:"#041727",
    color:"white",
    "&:hover": {
      backgroundColor: "#041727",
      color:"white"
  },
  },
  
});

class Project extends React.Component{
  constructor(props){
    super(props)
    this.state ={
        loading : true,
        address: "",
        project:"",
        checkedY : false,
        checkedN : false,
        fundingAmt:0,
        tabvalue:0,
        fundingAmt:0
    }
  }

  async load(){
    this.setState({loading:true})
    const accounts = await web3.eth.getAccounts()
    const project = ProjectInstance(this.props.match.params.paddress)
    const data = await project.methods.getDetails().call()
    const votingData = await project.methods.getVoteDetails().call()
    const refundVotingData = await project.methods.getRefundVoteDetails().call()
    const imgHash = await project.methods.getImage().call()
    var bindex = -1
    for(var i = 0; i < data.Backers.length; i++){
      if(data.Backers[i] === accounts[0]){
        bindex = i;
        break;
      }
    }
    const projectdata = {
      projectInst : project,
      address : this.props.match.params.paddress,
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
      votingState : votingData.votingState,
      hasVoted: votingData.HasVoted,
      votingResult : votingData.result,
      yesCount : votingData.YesCount,
      noCount : votingData.NoCount,
      votingTime : parseInt(votingData.votingTime),
      refundVotingState : refundVotingData.refundVotingState,
      refundHasVoted : refundVotingData.refundHasVoted,
      refundResult : refundVotingData.refundResult,
      refundYesCount : refundVotingData.refundYesCount,
      refundNoCount : refundVotingData.refundNoCount,
      refundVotingTime : parseInt(refundVotingData.refundVotingTime),
      imgHash : imgHash,
    }
    this.setState({
      loading:false,
      userAddr : accounts[0],
      bindex,
      project:projectdata,
    })
  }
  
  componentDidMount(){
    this.load().then(()=>{
      this.setState({
        loading:false,
      })
    })
    window.ethereum.on('accountsChanged',  (accounts)=> {
      this.load().then(()=>{
        this.setState({
          loading:false,
        })
      })
    })
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  async tick() {
    var project = {...this.state.project}
    if(project.votingState){
      if(project.votingTime === 0){
        return;
      }
      project.votingTime = project.votingTime - 1
    }
    else if(project.refundVotingState){
      if(project.refundVotingTime === 0){
        return;
      }
      project.refundVotingTime = project.refundVotingTime - 1
    }
    if(project.votingState === true && project.votingTime === 0){
      const votingData = await project.projectInst.methods.getVoteDetails().call()
        project.votingState = votingData.votingState
        project.hasVoted = votingData.HasVoted
        project.votingResult = votingData.result
        project.yesCount = votingData.YesCount
        project.noCount = votingData.NoCount
        project.votingTime = parseInt(votingData.votingTime)
      }
      else if(project.refundVotingState === true && project.refundVotingTime === 0){
        const refundVotingData = await project.projectInst.methods.getRefundVoteDetails().call()
        project.refundVotingState = refundVotingData.refundVotingState
        project.refundHasVoted = refundVotingData.refundHasVoted
        project.refundResult = refundVotingData.refundResult
        project.refundYesCount = refundVotingData.refundYesCount
        project.refundNoCount = refundVotingData.refundNoCount
        project.refundVotingTime = parseInt(refundVotingData.refundVotingTime)
      }
    this.setState({
      project
    })
    
  }
  

  handleChange = (e, newvalue)=>{
    this.setState({
      tabvalue : newvalue,
    })
  }

  handleFund = ()=>{
    this.state.project.projectInst.methods.contribute().send({
      from: this.state.userAddr,
      value: web3.utils.toWei(this.state.fundingAmt.toString(), 'ether')
    }).then((res)=>{
      alert("success")
      let project = {...this.state.project}
      const data = res.events.Fund.returnValues;
      project.currentBalance = data.CurrentBalance / 10**18
      project.state = data.state
      const bindex = data.backers.length - 1
      project.backers = data.backers
      this.setState({
        project,
        bindex,
        fundingAmt:0
      })
    }).catch((err)=>{
      alert(err)
    })
  }

  handleFundChange = (e)=>{
    this.setState({
      fundingAmt : e.target.value
    })
  }
  
  handleCheckpoint = () =>{
    this.state.project.projectInst.methods.triggerVoting().send({
      from: this.state.userAddr,
    }).then((res)=>{
      alert("voting process started")
      let project = {...this.state.project}
      const data = res.events.Trigger.returnValues;
      project.votingTime = parseInt(data.votingTime)
      project.votingState = data.votingState
      this.setState({
        project
      })
    }).catch((err)=>{
      alert(err)
    })
  }

  handleEndVoting = () =>{
    if(this.state.project.votingState === true){
      this.state.project.projectInst.methods.endVoting().send({
        from: this.state.userAddr,
      }).then((res)=>{
        alert("voting process terminated")
        let project = {...this.state.project}
        const data = res.events.VoteEvent.returnValues;
        project.votingResult = data.result
        project.votingState = data.votingState
        project.hasVoted = data.HasVoted
        const checkpointdata = res.events.Checkpoint.returnValues;
        project.paid = checkpointdata.paid/ 10**18
        project.completedCheckpoints = checkpointdata.CompletedCheckpoints
        project.state = checkpointdata.state
        this.setState({
          project
        })
      }).catch((err)=>{
        alert(err)
      })
    }
    else if(this.state.project.refundVotingState === true){
      this.state.project.projectInst.methods.endRefundVoting().send({
        from: this.state.userAddr,
      }).then((res)=>{
        alert("refund voting process terminated")
        let project = {...this.state.projects}
        const data = res.events.VoteEvent.returnValues;
        project.refundResult = data.result
        project.refundVotingState = data.votingState
        project.refundHasVoted = data.HasVoted
        this.setState({
          project
        })
      }).catch((err)=>{
        alert(err)
      })
    }
    
  }

  handleVote = ()=>{
      var choice;
      if(this.state.checkedY && !this.state.checkedN){
        choice = true
      }
      else if(this.state.checkedN && !this.state.checkedY){
        choice = false
      }
      else{
        alert("Choose one option")
        return;
      }
      if(this.state.project.votingState === true){
        this.state.project.projectInst.methods.Vote(choice, this.state.bindex).send({
          from: this.state.userAddr,
        }).then((res)=>{
          alert("vote success")
          let project = {...this.state.project}
          const data = res.events.VoteEvent.returnValues;
          project.votingState = data.votingState
          project.hasVoted = data.HasVoted
          project.votingResult = data.result
          if(project.votingState === false && project.votingResult === true){
            const checkpointdata = res.events.Checkpoint.returnValues;
            project.paid = checkpointdata.paid/ 10**18
            project.completedCheckpoints = checkpointdata.CompletedCheckpoints
            project.state = checkpointdata.state
          }
          else if(project.votingState === false && project.votingResult === false){
            const triggerdata = res.events.Trigger.returnValues;
            project.refundVotingState = triggerdata.votingState
            project.refundVotingTime = parseInt(triggerdata.votingTime)
          }
          let checkedY = false
          let checkedN = false
          this.setState({
            project,
            checkedY,
            checkedN
          })
        }).catch((err)=>{
          alert(err)
        })
      }
      else if(this.state.project.refundVotingState === true){
        this.state.project.projectInst.methods.refundVote(choice, this.state.bindex).send({
          from: this.state.userAddr,
        }).then((res)=>{
          alert("vote success")
          let project = {...this.state.project}
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
          this.setState({
            project
          })
        }).catch((err)=>{
          alert(err)
        })
      }
      
  }

  handleVoteChange = (e) => {
      this.setState({
        [e.target.name] : e.target.checked,
      })
  }

  
  render(){
    const {classes, className, ...other} = this.props
    if(this.state.loading){
      return(
      <center><CircularProgress size={100} style={{marginTop:50}}/></center>
      )
    }
    const day = this.state.project.deadline.getDate().toString()
    const month = months[this.state.project.deadline.getMonth()]
    const year = this.state.project.deadline.getFullYear().toString()
    const date = day + " " + month + " " + year
    var releasedProgress = (this.state.project.paid/this.state.project.currentBalance)*100
    if(this.state.project.state === "0"){
      releasedProgress = 0
    }
    return(
      <Grid container>
        <Grid item xs={12} sm={12} >
         <AppBar >
            <Toolbar className="TabClass">
              <Link to="/" style={{ textDecoration: 'none' }} >
                  <Button style={{color:"white"}}>
                    CROWDFUND
                  </Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid  item container direction="row" justify = "center" alignItems = "center" className={classes.ImageHeader} style={{backgroundImage:'url(https://ipfs.io/ipfs/'+this.state.project.imgHash+')'}} />
        <Grid item xs = {12} sm={12}>
          <center><Typography variant="h4" style={{fontWeight:"bold"}}><br/><br/>{this.state.project.title}<br/></Typography>
          <Typography variant="subtitle1" color="textSecondary">{states[this.state.project.state]}</Typography>
          <Divider variant="middle" style={{width:"50%", height:"0.15em"}}/><br/><br/></center>
        </Grid>
        <Grid item container>
          <Grid item xs = {12} sm = {4} style={{borderRight: '0.05em solid #D3D3D3'}}>
            <center><Typography className={classes.textStyle}>
              <Divider />
              <LinearProgress variant="determinate" color="secondary" value={(this.state.project.currentBalance/this.state.project.goal)*100}/>
              {this.state.project.currentBalance.toPrecision(4)} <Icon icon={ethereumIcon} />
              <Typography variant="subtitle2">Funds Raised</Typography>
              <Divider />
            </Typography>
            <Typography className={classes.textStyle}>
              {this.state.project.goal.toPrecision(4)} <Icon icon={ethereumIcon} />
              <Typography variant="subtitle2">Goal</Typography>
              <Divider />
            </Typography>
            <Typography className={classes.textStyle}>
              {this.state.project.paid.toPrecision(4)} <Icon icon={ethereumIcon} />
              <Typography variant="subtitle2">Funds released</Typography>
              <Divider />
            </Typography>
            <Typography className={classes.textStyle}>
              {this.state.project.backers.length}
              <Typography variant="subtitle2">Backers</Typography>
              <Divider />
            </Typography>
            <Typography className={classes.textStyle}>
              {date}
              <Typography variant="subtitle2">Deadline</Typography>
              <Divider />
            </Typography>
            <br/>
            <div>
            <TextField  variant="outlined" type="number"  color="secondary" InputLabelProps={{shrink: true,}} className={classes.textfield} onChange={this.handleFundChange} value={this.state.fundingAmt}/>
            <Button variant="outlined" color="secondary" className={classes.fundButton} size="large" onClick={this.handleFund}>Fund</Button>
            </div></center>
            <br/>
          </Grid>
          <Grid item xs={12} sm={8} >
            <Grid item  >
              <AppBar position="static" >
                <Tabs value={this.state.tabvalue} onChange={this.handleChange} variant="fullWidth" centered className="TabClass">
                  <Tab label="Description" />
                  <Tab label="Milestones" />
                </Tabs>
              </AppBar>
              <br/>
            </Grid>
            <Grid item style={{marginLeft:"10%", marginRight:"10%"}}>
               {this.state.tabvalue === 0 && <Typography component="p" variant="body1" >{this.state.project.desc}</Typography>}
              {this.state.tabvalue === 1 && (
                <>
                <Grid item>
                  <Box display="flex" alignItems="center" style={{margin:10}}>
                    <Box minWidth={25}>
                      <Typography variant="overline" color="textSecondary">Funds released</Typography>
                    </Box>
                    <Box width="100%" mr={2}>
                      <LinearProgress style={{height:10, borderRadius:2}} variant="determinate" color="secondary" value={releasedProgress} />
                    </Box>
                    <Box minWidth={25}>
                      <Typography variant="overline" color="textSecondary">Funds raised</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item >
                  {this.state.userAddr === this.state.project.creator &&(
                  <><Button style={{margin:5, marginRight:10}} className={clsx(classes.butn, className)} {...other} disabled={this.state.project.state !== "1" || this.state.project.votingState || this.state.project.refundVotingState} variant="contained"  onClick={this.handleCheckpoint}>
                    Trigger Checkpoint
                  </Button>
                  <Button style={{margin:5, marginRight:10}} disabled={this.state.project.state !== "1" || (!this.state.project.votingState && !this.state.project.refundVotingState) || this.state.project.votingTime > 0 || this.state.project.refundVotingTime > 0} variant="contained" color="secondary" onClick={this.handleEndVoting}>
                    End Voting
                  </Button><br/><br/>
                  {this.state.project.votingState && (<Typography >Voting Ends In:     <VoteTimer  value = {this.state.project.votingTime} /></Typography>)}
                  {this.state.project.refundVotingState && (<Typography>Voting Ends In:   <VoteTimer value = {this.state.project.refundVotingTime} /></Typography>)}
                  <br/></>)}
                  {this.state.userAddr !== this.state.project.creator && this.state.bindex !== -1 && (
                  <Grid item xs sm>
                    {this.state.project.votingState && <><Typography variant = "body1" >Vote to approve completion of checkpoint</Typography><br/></>}
                    {this.state.project.refundVotingState && <><Typography variant = "body1" >Vote for termination and refund:</Typography><br/></>}
                    <FormGroup row>
                      <FormControlLabel disabled={(!this.state.project.votingState || this.state.project.hasVoted[this.state.bindex]) && (!this.state.project.refundVotingState || this.state.project.refundHasVoted[this.state.bindex]) } control={<Checkbox checked={this.state.checkedY} onChange={this.handleVoteChange} name="checkedY" color="secondary"/>} label="Yes"/>
                      <FormControlLabel disabled={(!this.state.project.votingState || this.state.project.hasVoted[this.state.bindex]) && (!this.state.project.refundVotingState || this.state.project.refundHasVoted[this.state.bindex])} control={<Checkbox checked={this.state.checkedN} onChange={this.handleVoteChange} name="checkedN" color="secondary"/>} label="No"/>
                      <Button className={clsx(classes.butn, className)} size="small" disabled={(!this.state.project.votingState || this.state.project.hasVoted[this.state.bindex]) && (!this.state.project.refundVotingState || this.state.project.refundHasVoted[this.state.bindex]) } variant="contained"  onClick={this.handleVote}>Vote</Button>
                    </FormGroup><br/>
                    {this.state.project.votingState && (<Typography >Voting Ends In:     <VoteTimer  value = {this.state.project.votingTime} /></Typography>)}
                    {this.state.project.refundVotingState && (<Typography>Voting Ends In:   <VoteTimer value = {this.state.project.refundVotingTime} /></Typography>)}
                  </Grid>
                  )}
                </Grid>
                <Grid item >
                  <Checkpoints project={this.state.project} />
                </Grid>
                </>
               )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

}
export default withStyles(styles)(Project);