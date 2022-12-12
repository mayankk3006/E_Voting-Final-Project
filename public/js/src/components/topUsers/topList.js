import React from 'react'
import { Link } from 'react-router-dom'

export default class TopList extends React.Component {
  render() {
    // console.log("list this.props : ", this.props)
    let { user, username, votes } = this.props

    return (
      <Link to={`/profile/${username}`} >
      <div className="explores_list" >
        <div className="exl_main">
          <img src={ user ? `/users/${user}/avatar.jpg` : '/images/spacecraft.jpg' } />
          <div className="exl_content">
            <span className='exl_username' >{username}</span>
            <div className="exl_desc">
              <span className="exl_email">{votes}.</span>
            </div>
          </div>
        </div>
      </div>
      </Link>
    )
  }
}
