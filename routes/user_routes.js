const
  app = require('express').Router(),
  db = require('../config/db'),
  fs = require('fs'),
  dir = process.cwd(),
  { promisify } = require('util'),
  mail = require('../config/mail'),
  hl = require('handy-log'),
  mw = require('../config/middlewares')

app.get('/result', mw.NotLoggedIn, async (req, res) => {
  let data = await db.query('SELECT COUNT(*) as vote, id_candidate, candidate_name from voting Group by id_candidate, candidate_name Order by vote desc');
  res.render('result', { winner : {...data[0]} ,result : data })
})

app.get('/testimonials', mw.NotLoggedIn, async (req, res) => {
  let data = await db.query(`
  SELECT *, feedback.id as id
  FROM feedback
  INNER JOIN users
  ON feedback.id_user = users.id;
  `)
  res.render('testimonials', { testimonials : data.map(item => {item.date = (new Date(item.date)).toString().substring(0,24); return item;}) })
})

app.get('/candidates', mw.NotLoggedIn, async (req, res) => {
  let data = await db.query(`SELECT * FROM users WHERE bio = ?`, ['Candidate'])
  console.log('c data : ', data);
  res.render('candidates', { selectedCandidate : {...data[0]} ,candidateList : data })
})

app.get('/login', mw.NotLoggedIn, (req, res) => {
  let options = { title: 'Login' }
  res.render('login', { options })
})

app.get('/signup', mw.NotLoggedIn, (req, res) => {
  let options = { title: 'Signup' }
  res.render('signup', { options })
})

app.post('/user/signup', async (req, res) => {
  console.log("req.body : ", req.body);
  try {
    let {
      body: { username, email, password, password_again, bio },
      session
    } = req
  
    req.checkBody('username', 'Username is empty!!').notEmpty()
  
    req.checkBody('email', 'Email is empty').notEmpty()
    req.checkBody('email', 'Email is invalid').isEmail()
  
    req.checkBody('password', 'Password field is empty').notEmpty()
    req.checkBody('password_again', 'Password field is empty').notEmpty()
    req.checkBody('password', 'Passwords don\'t match').equals(password_again)
  
    let errors = await req.getValidationResult()
  
    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(e => array.push(e.msg))
      res.json({ mssg: array })
    } else {
  
      let
        [{ usernameCount }] = await db.query('SELECT COUNT(username) as usernameCount from users WHERE username=?', [ username ]),
        [{ emailCount }] = await db.query('SELECT COUNT(email) as emailCount from users WHERE email=?', [ email ])
  
      if (usernameCount == 1) {
        res.json({ mssg: 'Username already exists!!' })
      } else if (emailCount == 1) {
        res.json({ mssg: 'Email already exists!!' })
      } else {
  
        let
          newUser = {
            username,
            email,
            password,
            bio,
            joined: new Date().getTime(),
            email_verified: 'no'
          },
          { insertId, affectedRows } = await db.create_user(newUser),
          mkdir = promisify(fs.mkdir)
  
        await db.query('INSERT INTO stats(user, username) VALUES(?, ?)', [ insertId, username ])
  
        if (affectedRows == 1){
  
          await mkdir(dir + `/public/users/${insertId}`)
          fs
            .createReadStream(dir + '/public/images/react.png')
            .pipe(fs.createWriteStream(dir + `/public/users/${insertId}/avatar.jpg`))
  
          let
            url = `http://localhost:${process.env.PORT}/deep/most/topmost/activate/${insertId}`,
            options = {
              to: email,
              subject: 'Activate your EVoting account',
              html: `<span>Hello ${username}, You received this message because you created an account on E Voting.<span><br><span>Click on button below to activate your account and explore.</span><br><br><a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Activate</a>`
            }
  
          res.json({
                mssg: `Hello, ${username}!!`,
                success: true
          })

        } else {
          res.json({ mssg: 'An error occured creating your account!!' })
        }
  
      }
  
    } 
  } catch (error) {
    console.log("error : ", error);
  }

})

app.post('/user/login', async (req, res) => {

  try {
    let {
      body: { username: rusername, password: rpassword },
      session
    } = req
  
    req.checkBody('username', 'Username is empty!!').notEmpty()
    req.checkBody('password', 'Password field is empty!!').notEmpty()
  
    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(e => array.push(e.msg))
      res.json({ mssg: array })
    } else {
      console.log("checking")
      let [{ userCount, id, password, email_verified }] = await db.query('SELECT COUNT(id) as userCount, id, password, email_verified from users WHERE username=? GROUP BY ID LIMIT 1', [ rusername ])
      console.log("userCount ", userCount);
      if (userCount == 0){
        res.json({ mssg: 'User not found!!' })
      } else {
        let same = await db.comparePassword(rpassword, password)
        if (!same) {
          res.json({ mssg: 'Wrong password!!' })
        } else {
  
          session.id = id
          session.username = rusername
          session.email_verified = email_verified
  
          res.json({
            mssg: `Hello, ${rusername}!!`,
            success: true
          })
  
        }
      }
  
    }   
  } catch (error) {
      console.log("error : ", error);
  }
})

app.get('/logout', mw.LoggedIn, (req, res) => {
  let url = req.session.reset() ? '/login' : '/'
  res.redirect(url)
})

app.get('/registered', mw.LoggedIn, async (req, res) => {
  let
    { id } = req.session,
    [{ email_verified }] = await db.query('SELECT email_verified FROM users WHERE id=? LIMIT 1', [ id ]),
    options = {
      title: 'Registered',
      mssg: 'Email has been sent. Check your inbox and click on the provided link!!'
    }

  email_verified == 'yes'
    ? res.redirect('/')
    : res.render('registered', { options })

})

app.get('/deep/most/topmost/activate/:id', async (req, res) => {
  let
    { params: { id }, session } = req,
    { changedRows } = await db.query('UPDATE users SET email_verified=? WHERE id=?', ['yes', id]),
    mssg

  session.email_verified = 'yes'
  mssg = changedRows == 0 ? 'alr' : 'yes'

  res.redirect(`/email-verification/${mssg}`)

})

module.exports = app
