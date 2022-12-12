import React from 'react'
import { connect } from 'react-redux'
import Title from '../others/title'
import { FadeIn } from 'animate-components'
import Card from './card'
import $ from 'jquery'
import { validate } from '../../store/actions/validate'
import * as fn from '../../utils/utils'

@connect(store => {
  return {}
})

export default class Home extends React.Component {

  state={
    header : 'Voting',
    showCards : false
  }

  componentDidMount = async () => {
    this.props.dispatch()
    let voteData = await fn.validate({ id : $('.data').data('session') });
    console.log("voteData : ", voteData)
    if($('.data').data('session') == 1){
      this.setState({header : 'Welcome Admin!'});
    }else if(voteData.data.length){
      this.setState({header : 'Vote Submitted'});
    }else this.setState({showCards : true});
  }

  refresh_users = e => {
    e.preventDefault()
    this.props.dispatch()
  }

  voteSubmitted = ()=>{
    this.setState({header : 'Vote Submitted', showCards : false});
  }

  render(){
    let { users } = this.props;
    console.log("--- HOME !!! ", this.props);
    
    return (
      <div class='home'>

        <Title value='Home' />

        <FadeIn duration='300ms' >
          <div className='' style={{width: '150%', left: '-100px'}}>

            <div className='fm_header'>
              <span>{this.state.header}</span>
            </div>

            {this.state.showCards && <div className='fm_main'>
              {
                users.map(user => {
                  console.log("user : ",user);
                  return <Card key={user.id} user={user} voteSubmitted={this.voteSubmitted}/>
                })
              }

            </div>}

          </div>
        </FadeIn>

      </div>
    )
  }
}
