/* eslint indent:0 */
/* eslint no-unreachable:0 */

const votersObj = {
  users: []
}

const voters = (state=votersObj, action) => {
  let py = action.payload

  switch (action.type) {
    case 'GET_VOTERS':
      return { ...state, users: py }
      break
  }
  return state
}

export default voters
