const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./db')

const port = process.env.PORT || 3000

const app = express()

require('ejs')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
  secret: 'temporary secret string',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}))

app.use((req, res, next) => {
  if(req.session.user) {
    res.locals.user = req.session.user
  } else {
    res.locals.user = undefined
  }
  res.locals.errorMessage = undefined
  next()
})

app.get('/', (req, res) => {
  db.getAlbums((error, albums) => {
    if (error) {
      res.status(500).render('error', {error})
    } else {
      res.render('index', {albums})
    }
  })
})

app.get('/albums/:albumID', (req, res) => {
  const albumID = req.params.albumID

  db.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      res.status(500).render('error', {error})
    } else {
      const album = albums[0]
      res.render('album', {album})
    }
  })
})

app.get('/users/:id', (req, res) => {
  const userID = req.params.id

  db.getUserByID(userID, (error, users) => {
    if (error) {
      res.status(500).render('error', {error})
    } else {
      const user = users[0]
      res.render('profile', {user})
    }
  })
})

app.get('/sign-up', (req, res) => {
  res.render('sign-up')
})

app.post('/sign-up', (req, res) => {
  let errorMessage
  if(req.body.password !== req.body['password-confirmation']) {
    errorMessage = "Password does not match confirmation"
    res.render('sign-up', {errorMessage})
    return
  }
  db.createUser(req.body, (error, user) => {
    if (error) {
      res.status(500).render('error', {error})
    } else {
      req.session.user = user[0]
      res.redirect(`/users/${user[0].id}`)
    }
  })
})

app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})

app.post('/sign-in', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  let errorMessage
  db.getUserByLogin(email, (error, user) => {
    if (error) {
      res.status(500).render('error', {error})
    } else if (user[0].password !== password || !user[0]) {
      errorMessage = "Incorrect username or password"
      res.render('sign-in', {errorMessage})
    } else {
      req.session.user = user[0]
      res.redirect(`/users/${user[0].id}`)
    }
  })
})

app.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.use((req, res) => {
  res.status(404).render('not_found')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
