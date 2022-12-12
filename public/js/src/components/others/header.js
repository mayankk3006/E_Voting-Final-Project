import React from 'react'
import { NavLink } from 'react-router-dom'
import $ from 'jquery'

export default class Header extends React.Component {
  render() {
    let username = $('.data').data('username');
    let loggedUserId = $('.data').data('session');

    return (
      <div className='header_loggedin' >
        <div className='left' >
          <NavLink activeClassName='ha_active' exact to='/' style={{border: '1px solid black', borderRadius: '5px'}}>Home</NavLink>
          {loggedUserId === 1 && <NavLink activeClassName='ha_active' exact to='/candidates' style={{border: '1px solid black', borderRadius: '5px'}}>Candidates</NavLink>}
          {loggedUserId === 1 && <NavLink activeClassName='ha_active' exact to='/voters' style={{border: '1px solid black', borderRadius: '5px'}}>Voters</NavLink>}
        </div>
        <div className='right' >
          <NavLink activeClassName='ha_active' to='/edit-profile' style={{border: '1px solid black', borderRadius: '5px'}}>Edit Profile</NavLink>
          <NavLink activeClassName='ha_active' to={`/profile/${username}`} style={{border: '1px solid black', borderRadius: '5px'}}>Profile</NavLink>
          {loggedUserId !== 1 && <NavLink activeClassName='ha_active' to={`/feedback/${username}`} style={{border: '1px solid black', borderRadius: '5px'}}>Feedback</NavLink>}
          {loggedUserId === 1 && <NavLink activeClassName='ha_active' to={`/view-feedback/${username}`} style={{border: '1px solid black', borderRadius: '5px'}}>View Feedback</NavLink>}
          <a href='/logout' style={{border: '1px solid black', borderRadius: '5px'}}>Logout</a>
        </div>
      </div>
    )
  }
}
