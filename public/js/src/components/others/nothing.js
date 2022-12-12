import React from 'react'
import PropTypes from 'prop-types'

export default class Nothing extends React.Component{

  render(){
    let { mssg, showMssg } = this.props
    return(
      <div class='home_last_mssg' style={{border: '1px solid black',borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px'}} >
        <img src='/images/large.jpg' />
        { showMssg ? <span>{mssg}</span> : null }
      </div>
    )
  }
}

Nothing.defaultProps = {
  mssg: 'Hello, a message for you!',
  showMssg: true
}

Nothing.propTypes = {
  mssg: PropTypes.string,
  showMssg: PropTypes.bool
}
