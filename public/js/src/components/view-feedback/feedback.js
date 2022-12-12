import React from 'react'
import { Link } from 'react-router-dom'

export default class TopList extends React.Component {
  render() {
    let { username, feedback, date } = this.props
    let formattedDate = (new Date(date)).toString().substring(0,24);
    return (
      <div className="explores_list" style={{width: '40%',display: 'inline-block', border: '1px solid grey', margin: '10px', border: '1px solid black',borderRadius: '10px'}}>
        <div className="exl_main">
          <div className="exl_content">
            <span className='exl_username' >{username}</span>
            <div className="exl_desc" style={{height: '100px'}}>
              <span className="exl_email">{feedback}</span>
            </div>
            <span className="exl_followers">{formattedDate}</span>
          </div>
        </div>
      </div>      
    )
  }
}
