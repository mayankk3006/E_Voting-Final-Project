const
  app = require('express').Router(),
  db = require('../config/db')

app.post('/users-for-voting', async (req, res) => {
  let
    { id } = req.session,
    users = await db.query(`SELECT * FROM users WHERE bio = ?`, ['Candidate'])
    // users = await db.query('SELECT id, username FROM users WHERE id <> ? ORDER BY RAND() LIMIT 2', [ id ])
  res.json(users)
})

app.post('/vote', async (req, res) => {
  let { user
    , loginId 
  } = req.body

  console.log("---- req.body : ", req.body);
  await db.query('INSERT INTO voting(id_candidate, candidate_name, id_voter) VALUES (?,?,?)', [user.id, user.username, loginId]);
  res.json({ mssg: `Your vote for ${user.username} has been saved successfully.` })
})

app.post('/get-top-users', async (req, res) => {
  let
    users = await db.query(`SELECT * FROM users WHERE bio = ?`, ['Candidate'])
  res.json(users)
})

app.post('/get-voters', async (req, res) => {
  let
    users = await db.query(`SELECT * FROM users WHERE bio = ?`, ['Voter'])
  res.json(users)
})

app.post('/validate', async (req, res) => {
  console.log("Validate ... ", req.body)
  let data = await db.query(`SELECT * FROM voting WHERE id_voter = ?`, [req.body.id])
    console.log("validate data : ", data)
  res.json(data)
})

// FEEDBACK
app.get('/getfeedback', async (req, res) => {
    let feedbackData = await db.query(`
    SELECT *, feedback.id as id
    FROM feedback
    INNER JOIN users
    ON feedback.id_user = users.id;
    `)
    res.json(feedbackData);
})

module.exports = app
