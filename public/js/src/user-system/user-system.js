import $ from 'jquery'
import Notify from 'handy-notification'
import { commonLogin, sendEmail } from '../utils/utils'

// User signup
$('form.form_register').submit(e => {
  e.preventDefault()

  let
    username = $('.r_username').val(),
    email = $('.r_email').val(),
    password = $('.r_password').val(),
    password_again = $('.r_password_again').val(),
    bio = $('input[name="bio"]:checked').val();

  if (!username || !email || !password || !password_again || !bio) {
    Notify({ duration: 10000, value: 'Values are missing!!' })
  } else if (password != password_again) {
    Notify({ duration: 10000, value: 'Passwords don\'t match!!' })
  } else {

    let signupOpt = {
      data: {
        username,
        email,
        password,
        password_again,
        bio
      },
      btn: $('.r_submit'),
      url: '/user/signup',
      redirect: '/registered',
      defBtnValue: 'Signup',
    }
    commonLogin(signupOpt)

  }

})

// User login
$('form.form_login').submit(e => {
  e.preventDefault()

  let
    username = $('.l_username').val(),
    password = $('.l_password').val()
// console.log('username : ', username)
  if (!username || !password) {
    Notify({ duration: 10000, value: 'Values are missing!!' })
  } else {
    console.log('username : ', username);
    if($('.l_otp').is(":hidden") && username.toLowerCase() !== 'admin'){
      // $('.l_otp').show();
      sendEmail({username}).then((sendEmailData)=>{
        console.log('sendEmailData : ', sendEmailData);
        if(sendEmailData.sent){
          $('.l_otp').show();
          localStorage.setItem("login_otp", sendEmailData.otp);
        }else {
          Notify({ duration: 10000, value: 'User not found' });
        }
      }).catch(err => Notify({ duration: 10000, value: 'Unable to login' }))

    }else{

      let loginOpt = {
        data: {
          username: $('.l_username').val(),
          password: $('.l_password').val()
        },
         btn: $('.l_submit'),
         url: '/user/login',
         redirect: '/',
         defBtnValue: 'Login',
      }

      if(localStorage.getItem("login_otp") && username.toLowerCase() !== 'admin'){
        if(localStorage.getItem("login_otp") === $('.l_otp').val()){
          commonLogin(loginOpt);
        }else{
          Notify({ duration: 10000, value: 'Invalid OTP' });
        }
      }else{
        commonLogin(loginOpt)        
      }

    }
  }

})
