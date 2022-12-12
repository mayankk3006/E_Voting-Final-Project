/* eslint indent:0 */
/* eslint no-unreachable:0 */

const fm_def = {
  users: [],
}

const validate = (state=fm_def, action) => {
  let py = action.payload

  switch (action.type) {
    case 'VALIDATE':
      return { data: py }
      break
  }
  return state
}

export default validate
