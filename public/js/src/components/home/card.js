import React from 'react'
import { Link } from 'react-router-dom'
import { post } from 'axios'
import Notify from 'handy-notification'
import $ from 'jquery'
import { connect } from 'react-redux'

@connect(store => {
  return {
    store
  }
})

export default class Card extends React.Component {

  state = {
    user: {},
  }

  vote = async e => {
    e.preventDefault()
    $('.card_select').blur().addClass('a_disabled')

    let
      { user
      } = this.props,
      { dispatch } = this.props,
      { data: { mssg } } = await post('/api/vote', { user
        ,loginId : $('.data').data('session')
      })

    $('.card_select').removeClass('a_disabled')
    Notify({ duration: 10000, value: mssg })
    this.props.voteSubmitted();
    dispatch()
  }

  render(){
    let { user: { id, username } } = this.props
    return (
      <div>
        <div className='card'>
          <img src={id ? `/users/${id}/avatar.jpg` : '/images/react.png'} />
          <Link to={`/profile/${username}`} className='card_username'>{username}</Link>
          <div className='card_links'>
            <a href='#' className='pri_btn card_select' onClick={this.vote} >Vote</a>
          </div>
        </div>
      </div>
    )
  }
}

