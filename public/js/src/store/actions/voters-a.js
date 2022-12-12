import { post } from 'axios'

const get_voters = () => {
  return dispatch => {
    post('/api/get-voters')
      .then(u => dispatch({ type: 'GET_VOTERS', payload: u.data }) )
      .catch(e => console.log(e))
  }
}

module.exports = {
  get_voters,
}
