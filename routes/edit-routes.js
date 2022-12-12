const
  app = require('express').Router(),
  db = require('../config/db'),
  mail = require('../config/mail'),
  root = process.cwd(),
  upload = require('multer')({
    dest: `${root}/public/temp/`
  }),
  { ProcessImage, DeleteAllOfFolder } = require('handy-image-processor')

// FOR GETTING THE COUNT OF GIVEN FIELD
app.post('/what-exists', async (req, res) => {
  let
    { what, value } = req.body,
    [{ count }] = await db.query(`SELECT COUNT(${what}) AS count FROM users WHERE ${what}=?`, [value])
  res.json(count)
})

// EDIT PROFILE
app.post('/edit-profile', async (req, res) => {
  let
    { susername, username, email, description, UserId } = req.body
    // { id: session } = req.session

    console.log('susername, username, email, description, UserId : ', susername, username, email, description, UserId);

  req.checkBody('username', 'Username is empty').notEmpty()

  req.checkBody('email', 'Email is empty').notEmpty()
  req.checkBody('email', 'Email is invalid').isEmail()

  let errors = await req.getValidationResult()

  if (!errors.isEmpty()) {
    let array = []
    errors.array().forEach(item => array.push(item.msg))
    res.json({ mssg: array })
  } else {
    // req.session.username = username
    if(req.session.username === susername) req.session.username = username;
    await db.query('UPDATE users SET username=?, email=?, description=? WHERE id=?', [username, email, description, UserId])
    res.json({
      mssg: 'Profile edited!!',
      success: true
    })
  }

})

// FEEDBACK
app.post('/feedback', async (req, res) => {
  let
    { id, feedback } = req.body
  console.log("req.body : ", req.body);
    await db.query('INSERT INTO feedback(id_user, feedback) VALUES (?,?)', [id, feedback])
    res.json({
      mssg: 'Success!',
      // mssg: 'Feedback Saved Successfully',
      success: true
    })
})

// deleteCandidate
app.post('/deleteCandidate', async (req, res) => {
  let
    { id } = req.body
    await db.query('DELETE FROM users WHERE id=?', [id])
    await db.query('DELETE FROM stats WHERE user=?', [id])
    await db.query('DELETE FROM profile_views WHERE view_by=? or view_to=?', [id, id])
    await db.query('DELETE FROM feedback WHERE id_user=?', [id])
    res.json({
      mssg: 'Deleted Successfully',
      success: true
    })

})

app.post('/sendemail', async (req, res) => {
  let data = await db.query('SELECT * FROM users WHERE username=?', [req.body.username])
  console.log('user data : ', data);
  if(data && data.length){
    // email = data[0].email;
    console.log('sending email to : ', data[0].email);

    let otp = Math.floor(100000 + Math.random() * 900000);

    await mail({
      to: data[0].email,
      subject: 'E-Voting Login OTP',
      html: `
        Hello ${req.body.username}, 
        <br><br>
        Your One Time Password is ${otp}.
        <br><br>
        Regards,
        <br>
        Admin`
    })

    res.json({sent : true, otp});
  }else{
    res.json({sent : false});
  }
})

// FOR RESENDING THE VERIFICATION LINK
app.post('/resend_vl', async (req, res) => {
  let
    { id } = req.session,
    [{ username, email }] = await db.query('SELECT username, email FROM users WHERE id=?', [id]),
    url = `http://localhost:${process.env.PORT}/deep/most/topmost/activate/${id}`,
    options = {
      to: email,
      subject: 'Activate your EVoting account',
      html: `<span>Hello ${username}, You received this message because you created an account on EVoting.<span><br><span>Click on button below to activate your account and explore.</span><br><br><a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Activate</a>`
    }
  await mail(options)
  res.json({ mssg: 'Verification link sent to your email!!' })
})

// CHANGING THE AVATAR
app.post('/change-avatar', upload.single('avatar'), async (req, res) => {
  let
    { file, session } = req,
    obj = {
      srcFile: file.path,
      width: 200,
      height: 200,
      destFile: `${root}/public/users/${session.id}/avatar.jpg`
    }

  await ProcessImage(obj)
  await DeleteAllOfFolder(`${root}/public/temp/`)

  res.json({ mssg: 'Avatar changed!!' })
})

module.exports = app
