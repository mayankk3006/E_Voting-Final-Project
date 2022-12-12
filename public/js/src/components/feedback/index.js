import React from 'react'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import $ from 'jquery'
import Title from '../others/title'
import * as user_action from '../../store/actions/user-a'
import * as fn from '../../utils/utils'

@connect(store => {
  return {
    user: store.User
  }
})

export default class Feedback extends React.Component {

  state = {
    id: null,
    username: '',
    email: '',
    feedback: ''
  }

  componentDidMount = () => {
    let
      { dispatch } = this.props,
      username = $('.data').data('username')
    dispatch(user_action.user_details(username))
  }

  componentWillReceiveProps = ({ user: { user_details: { id, username, email, feedback }} }) => {
    this.setState({ id, username, email, feedback })
  }

  update_ = (e) => {
    let v = e.target.value
    this.setState({ feedback: v })
  }

  submit_feedback = e => {
    e.preventDefault()
    let { id, feedback } = this.state
    fn.submit_feedback({ id, feedback })
  }

  render(){
    console.log("props : ", this.props);
    let
      { username, email, feedback } = this.state

    return (
      <div class='edit' style={{border: '1px solid black',padding: '50px',borderRadius: '20px',background: 'white'}}>

        <Title value='Feedback' />

        <FadeIn duration='300ms' className='edit_animation' >
          <div className='edit_info' style={{textAlign : 'center', fontWeight: 'bold', fontSize: '20px'}}>
            Feedback
          </div>
          <div className='eu_div'>
            <span className='edit_span'>Username</span>
            <input
              type='text'
              className='e_username'
              placeholder='Username..'
              autoComplete='false'
              autoFocus
              spellCheck='false'
              value={username}
              disabled={true}
            />
          </div>
          <div className='ee_div'>
            <span className='edit_span'>Email</span>
            <input
              type='email'
              className='e_email'
              placeholder='Email..'
              autoComplete='false'
              spellCheck='false'
              value={email}
              disabled={true}
            />
          </div>
          <div className='eb_div'>
            <span className='edit_span'>Feedback</span>
            <textarea
              className='e_feedback'
              placeholder='Feedback..'
              spellCheck='false'
              value={feedback}
              onChange={e => this.update_(e, 'feedback')}
            ></textarea>
          </div>
          <div className='eb_btns'>
            <a href='#' className='pri_btn e_done' onClick={this.submit_feedback} >Submit Feedback</a>
          </div>

        </FadeIn>

      </div>
    )
  }
}
