import { post } from 'axios'

const validate = (id) => {
  return dispatch => {
    post('/api/validate', {id})
      .then(data => dispatch({ type: 'VALIDATE', payload: data.data }))
      .catch(e => console.log(e))
  }
}

module.exports = {
  validate
}
