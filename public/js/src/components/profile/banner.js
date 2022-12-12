/* eslint indent:0 */

import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as fn from '../../utils/utils'

@connect(store => {
  return {
    user: store.User
  }
})

export default class Banner extends React.Component {

  state = {
    loggedUserId: null
  }

  componentDidMount = () => {
    let loggedUserId = $('.data').data('session')
    this.setState({loggedUserId});
  }

  deleteCandidate = ()=>{
    console.log("deleteCandidate")
    fn.deleteCandidate({id : this.props.user.user_details.id});
  }

  render() {
    let {
      user: { user_details, profile_views, ranking, votes },
    } = this.props

    let editurl = '/edit-profile/'+user_details.username;
    return (
      <div>
        <div className='user_banner' style={{border: '1px solid black',borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}>

          <div className='profile_img_div'>
            <img
              src={ user_details.id ? `/users/${user_details.id}/avatar.jpg` : '/images/react.png' }
              alt='Your profile'
            />
          </div>

          <div className='user_buttons'>
          {
            fn.Me(user_details.id)
            ? <Link to='/edit-profile' className='follow pri_btn' style={{border: '1px solid black'}}>Edit Profile</Link>
            : null
          }
          </div>

          <div className='user_info'>
            {
              user_details.id ?
                <div>
                  <Link to='#' className='user_main_link'>{user_details.username}</Link>
                  <span className='user_no_notes'>{user_details.email}</span>
                  <div className={`user_bio ${!user_details.bio ? 'no_bio' : null}`}>
                    {
                      user_details.bio ?
                        <span style={{fontWeight: 'bold'}}>{user_details.bio}</span>
                        :<span></span>
                    }
                  </div>
                  {this.state.loggedUserId === 1 && this.state.loggedUserId !== this.props.user.user_details.id && <div className="exl_ff" style={{float: 'left', fontSize: '14px'}}>
                    <a href={editurl} style={{border: 'none', background: 'none', cursor: 'pointer', color: '#2895F1'}}>Edit</a>
                  </div>}
                  {this.state.loggedUserId === 1 && this.state.loggedUserId !== this.props.user.user_details.id && <div className="exl_ff" style={{float: 'right', fontSize: '15px'}}>
                    <button style={{border: 'none', background: 'none', cursor: 'pointer', color: '#2895F1'}} onClick={this.deleteCandidate}>Delete</button>
                  </div>}
                  <br/>
                </div>
              : null
            }
          
          </div>

        </div>

      </div>
    )
  }
}
