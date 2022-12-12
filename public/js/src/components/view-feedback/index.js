import React from 'react'
import $ from 'jquery'
import { FadeIn } from 'animate-components'
import { connect } from 'react-redux'
import Title from '../others/title'
import Feedback from './feedback'
import End from '../others/end'
import Nothing from '../others/nothing'
import * as fn from '../../utils/utils'

@connect(store => {
  return {
    user: store.User
  }
})

export default class viewFeedback extends React.Component {

  state = {
    feedbackData : []
  }

  componentDidMount = async () => {
    let feedbackData = (await fn.get_feedback()).data;
    this.setState({feedbackData});
  }

  render() {
    let feedbackDataArray = this.state.feedbackData.map(item => <Feedback key={item.id} {...item} /> )

    return (
      <div className='top explore'>
        <div style={{textAlign : 'center', fontSize: '20px', color: 'white'}}>Feedback</div>
        <FadeIn duration='300ms'>
          <div className='explores' style={{width:'1200px',marginLeft: '200px'}}>
            {this.state.feedbackData.length == 0 ? <Nothing mssg='No Feedback Submitted.' /> : feedbackDataArray }
          </div>
        </FadeIn>
      </div>
    )
  }
}
