const pg = require('pg')

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

function getAlbums(cb) {
  _query('SELECT * FROM albums', [], cb)
}

function getAlbumsByID(albumID, cb) {
  _query('SELECT * FROM albums WHERE id = $1', [albumID], cb)
}

function createUser(user, cb) {
  _query(`INSERT INTO users(username, email, photo, password)
          VALUES($1, $2, $3, $4) RETURNING id`,
          [user.username, user.email, user.photo, user.password],
          cb
        )
}

function getUserByID(userID, cb) {
  _query(`SELECT * FROM users WHERE id = $1`, [userID], cb)
}

function getUserByLogin(email, cb) {
  _query(`SELECT * from users WHERE email = $1`, [email], cb)
}

function getReviewsByUserID(userID, cb) {
  _query(`SELECT * FROM reviews
          JOIN users ON users.id = reviews.user_id
          JOIN albums ON albums.id = reviews.album_id
          WHERE users.id = $1
          ORDER BY date_created DESC`,
          [userID], cb
        )
}

function getReviewsByAlbumID(albumID, cb) {
  _query(`SELECT * FROM reviews
          JOIN users ON users.id = reviews.user_id
          JOIN albums ON albums.id = reviews.album_id
          WHERE albums.id = $1
          ORDER BY date_created DESC`,
          [albumID], cb
        )
}

function _query(sql, variables, cb) {
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, (error, result) => {
    if (error) {
      console.log('QUERY -> !!ERROR!!')
      console.error(error)
      cb(error)
    } else {
      console.log('QUERY ->', JSON.stringify(result.rows))
      cb(error, result.rows)
    }
  })
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  createUser,
  getUserByID,
  getUserByLogin,
  getReviewsByUserID,
  getReviewsByAlbumID
}
