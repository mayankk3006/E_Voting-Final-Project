import React from 'react'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import $ from 'jquery'
import Title from '../others/title'
import * as user_action from '../../store/actions/user-a'
import * as fn from '../../utils/utils'
import TimeAgo from 'handy-timeago'
import ChangeAvatar from './change-avatar'
import Overlay from '../others/overlay'

@connect(store => {
  return {
    user: store.User
  }
})

export default class Edit extends React.Component {

  state = {
    username: '',
    email: '',
    description : '',
    bio: '',
    file: '',
    avatar_change: false,
    preview_img: '/images/react.png',
    targetFile: ''
  }

  originalUsername = '';
  originalEmail = ''
  originalUserId = null;

  componentDidMount = () => {
    let
      { dispatch } = this.props,
      username = $('.data').data('username')
      console.log("username : ", username);

    let url_param = this.props.location.pathname.replace(this.props.match.path,'').replace('/','');
    console.log("url_param : ", url_param);
    let User_name = url_param ? url_param : username;
    dispatch(user_action.user_details(User_name))
    this.originalUsername = User_name;
  }

  componentWillReceiveProps = ({ user: { user_details: { id, username, email, description, bio } } }) => {
    console.log("ID : ", id)
    this.setState({ username, email, description, bio })
    this.originalEmail = email;
    this.originalUserId = id;
  }

  /* eslint indent:0 */
  /* eslint no-unreachable:0 */
  update_ = (e, of) => {
    let v = e.target.value
    switch (of) {
      case 'username':
        this.setState({ username: v })
        break
      case 'email':
        this.setState({ email: v })
        break
      case 'description' : 
      this.setState({ description: v })
        break
      case 'bio':
        this.setState({ bio: v })
        break
      case 'file':
        this.setState({ file: v })
        break
      case 'avatar_change':
        this.setState(state => ({ avatar_change: !state.avatar_change }))
        break
    }
  }

  edit_profile = e => {
    e.preventDefault()
    let
      // { username: susername, email: semail } = this.props.user.user_details,
      { username, email, description, bio } = this.state
    fn.edit_profile({ susername : this.originalUsername, semail:this.originalEmail, username, email, description, UserId: this.originalUserId })
    // fn.edit_profile({ susername, semail, username, email, bio })
  }

  resend_vl = e => {
    e.preventDefault()
    fn.resend_vl()
  }

  preview_avatar = e => {
    this.update_(e, 'file')
    this.update_(e, 'avatar_change')
    let
      reader = new FileReader(),
      file = e.target.files[0]
    this.setState({ targetFile: file })
    reader.onload = e => this.setState({ preview_img: e.target.result })
    reader.readAsDataURL(file)
  }

  back = e => {
    e.preventDefault()
    this.update_(e, 'avatar_change')
    this.setState({ file: '' })
  }

  change_avatar = e => {
    e.preventDefault()
    fn.change_avatar({ file: this.state.targetFile })
  }

  render(){
    console.log("EDIT - this.props : ", this.props);
    let
      { username, email, bio, description, file, avatar_change, preview_img } = this.state,
      { joined, id } = this.props.user.user_details

    return (
      <div class='edit' style={{border: '1px solid black',padding: '50px',borderRadius: '20px',background: 'white'}}>

        <Title value='Edit Profile' />

        <FadeIn duration='300ms' className='edit_animation' >
          <div className='edit_info' style={{paddingLeft: '135px'}}>
            {/* <img
              className='edit_img'
              src={id ? `/users/${id}/avatar.jpg` : '/images/react.png'}
              alt='Your avatar'
            /> */}
            {/* <span>{`@${username}`}</span> */}
            <span>Edit Profile</span>
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
              onChange={e => this.update_(e, 'username')}
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
              onChange={e => this.update_(e, 'email')}
            />
          </div>
          <div className='ed_div'>
            <span className='edit_span'>Description</span>
            <textarea
              type='text'
              className='e_description'
              placeholder='Description..'
              autoComplete='false'
              autoFocus
              spellCheck='false'
              value={description}
              onChange={e => this.update_(e, 'description')}
            ></textarea>
          </div>
          {/* <div className='eb_div'>
            <span className='edit_span'>Bio</span>
            <textarea
              className='e_bio'
              placeholder='Bio..'
              spellCheck='false'
              value={bio}
              onChange={e => this.update_(e, 'bio')}
            ></textarea>
          </div> */}
          <div className='eb_btns'>
            <a href='#' className='pri_btn e_done' onClick={this.edit_profile} style={{border: '1px solid black;'}}>Save</a>
          </div>

        </FadeIn>

        {
          avatar_change ?
            <div>
              <Overlay/>
              <ChangeAvatar
                back={this.back}
                preview_img={preview_img}
                change_avatar={this.change_avatar}
              />
            </div>
          : null
        }

      </div>
    )
  }
}
