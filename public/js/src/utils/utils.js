import $ from 'jquery'
import { get, post } from 'axios'
import Notify from 'handy-notification'
import * as user_actions from '../store/actions/user-a'

// FUNCTION FOR SHORTENING
export const shortener = (elem, length) => {
  let
    parse = parseInt(length),
    len = elem.length
  if (!parse) { return }
  return (len >= parse) ? `${elem.substr(0, length - 2)}..` : (len < parse) ? elem : null
}

// FUNCTION TO TOGGLE
export const toggle = el => {
  let style = el.style.display
  style === 'none' ? el.style.display = 'block' : el.style.display = 'none'
}

export const sendEmail = async (options) => {
  let { username } = options;
  let {data: sendEmailData} = await post('/api/sendemail', { username });
  return sendEmailData;
}

// FUNCTION FOR COMMON LOGIN
export const commonLogin = options => {
  let
    { data, btn, url, redirect, defBtnValue } = options,
    overlay2 = $('.overlay-2')

  btn
    .attr('value', 'Please wait..')
    .addClass('a_disabled')
  overlay2.show()

  post(url, data)
    .then(s => {
      let { data: { mssg, success } } = s
      if (success) {
        Notify({ duration: 10000,
          value: mssg,
          done: () => location.href = redirect
        })
        btn.attr('value', 'Redirecting..')
        overlay2.show()
      } else {
        Notify({ duration: 10000, value: mssg })
        btn
          .attr('value', defBtnValue)
          .removeClass('a_disabled')
        overlay2.hide()
      }
      btn.blur()
    })
    .catch(e => console.log(e))
}

// FUNCTION TO CAPITALIZE FIRST LETTER OF A WORD
export const c_first = str =>
  str.charAt(0).toUpperCase() + str.substr(1)

// TO REMOVE LINE OF LAST ELEMENT
export const llr = () => {
  let
    f = $('.modal_main').children(),
    s = $('.display_content').children().length - 1
  f.eq(s).find('hr').remove()
}

// FUNCTION TO CHECK WHETHER ITS ME OR NOT
export const Me = user =>
  user == $('.data').data('session') ? true : false

// FUNCTION TO CHECK WHETHER EMAIL IS ACTIVATED ON NOT
export const e_v = () => {
  let ea = $('.data').data('email-verified')
  return ea == 'yes' ? true : false
}

export const forProfile = async options => {
  let
    { dispatch, username, invalidUser } = options,
    { data: valid } = await post('/api/is-user-valid', { username }),
    s_username = $('.data').data('username')

  if (!valid) {
    invalidUser()
  } else {
    username != s_username ? post('/api/view-profile', { username }) : null

    dispatch(user_actions.user_details(username))
    dispatch(user_actions.get_profile_views(username))
  }

}

export const edit_profile = async options => {
  let
    { susername, semail, username, email, description, UserId } = options,
    button = $('.e_done'),
    { data: uCount } = await post('/api/what-exists', { what: 'username', value: username }),
    { data: eCount } = await post('/api/what-exists', { what: 'email', value: email })

  button.
    addClass('a_disabled')
    .text('Processing..')
    .blur()

    console.log('susername, semail, username, email, description, UserId  : ', susername, semail, username, email, description, UserId )

  if (!username) {
    Notify({ duration: 10000, value: 'Username must not be empty!!' })
  } else if (!email) {
    Notify({ duration: 10000, value: 'Email must not be empty!!' })
  } else if (uCount == 1 && username.toString().toLowerCase() != susername.toString().toLowerCase()) {
    Notify({ duration: 10000, value: 'Username already exists!!' })
  } else if (eCount == 1 && email.toString().toLowerCase() != semail.toString().toLowerCase()) {
    Notify({ duration: 10000, value: 'Email already exists!!' })
  } else {
    let { data: { mssg, success } } = await post('/api/edit-profile', { susername, username, email, description, UserId })
    Notify({ duration: 10000,
      value: mssg,
      done: () => success ? location.href='/' : null
    })
  }

  button
    .removeClass('a_disabled')
    .text('Done Editing')
    .blur()

}

export const submit_feedback = async options => {
  let
  { id, feedback } = options,
  button = $('.e_done')

  button.
  addClass('a_disabled')
  .text('Processing..')
  .blur()

  if (!feedback) {
    Notify({ duration: 10000, value: 'Feedback must not be empty!!' })
  } else {
    let { data: { mssg, success } } = await post('/api/feedback', { id, feedback });
    alert('Feedback Submitted Successfully.');
    Notify({ duration: 10000,
      value: mssg,
      done: () => success ? 
      (
      location.href='/feedback' 
      )
      // location.href='/' 
      : null
    })
  }

  button
    .removeClass('a_disabled')
    .text('Feedback Submitted')
    .blur()

}

export const get_feedback = async () => {
  return await get('/api/getfeedback');
}

export const deleteCandidate = async options => {
  let
  { id } = options
  console.log("deleteCandidate - ", id);

  let { data: { mssg, success } } = await post('/api/deleteCandidate', { id })
    Notify({ duration: 10000,
      value: mssg,
      done: () => success ? location.href='/' : null
  })
}

export const validate = async data => {
  let
  { id } = data

 return await post('/api/validate', { id })
}


export const resend_vl = () => {
  let
    vl = $('.resend_vl'),
    o = $('.overlay-2')

  vl
    .addClass('a_disabled')
    .text('Sending verification link..')
  o.show()

  post('/api/resend_vl')
    .then(s => {
      let { data: { mssg } } = s
      Notify({ duration: 10000, value: mssg })
      vl
        .text('Verification link sent!!')
        .removeClass('a_disabled')
        .blur()
      o.hide()
    })
}

export const change_avatar = async options => {
  let
    { file } = options,
    form = new FormData()

  $('.overlay-2').show()
  $('.c_a_add')
    .text('Changing avatar..')
    .addClass('a_disabled')

  form.append('avatar', file)

  let { data } = await post('/api/change-avatar', form)
  Notify({ duration: 10000,
    value: data.mssg,
    done: () => location.reload()
  })

}
