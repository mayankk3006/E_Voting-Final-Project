import React from 'react'
import $ from 'jquery'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import { get_top_users } from '../../store/actions/topUsers-a'
import Title from '../others/title'
import TopList from './topList'
import End from '../others/end'
import Nothing from '../others/nothing'

@connect(store => {
  return {
    topUsers: store.TopUsers,
    user: store.User
  }
})

export default class TopUsers extends React.Component {

  componentDidMount = () => {
    this.props.dispatch(get_top_users());
  }

  render() {
    console.log("user  this.props : ", this.props)
    let
      { topUsers: { users } } = this.props,
      map_users = users.map(u => <TopList key={u.stats_id} {...u} /> )

    return (
      <div className='top explore'>
        <Title value='Candidates' />
        <FadeIn duration='300ms'>
          <div className='explores'>
            {users.length == 0 ? <Nothing mssg='No Election Held currently!!' /> : map_users }
            {users.length != 0 ? <End /> : null}
          </div>
        </FadeIn>
      </div>
    )
  }
}
