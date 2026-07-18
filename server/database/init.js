const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { encrypt } = require('../utils/crypto')

module.exports = function initDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = path.resolve(__dirname, '../db.sqlite')
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        return reject(err)
      }
    })

    db.serialize(() => {
      // Create casino_user table
      db.run(`CREATE TABLE IF NOT EXISTS casino_user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT,
        user TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        pass TEXT,
        account_type INTEGER,
        money REAL,
        profile_pic TEXT,
        is_verified INTEGER DEFAULT 0,
        verification_token TEXT,
        signup TEXT
      )`)

      // Create login_user table
      db.run(`CREATE TABLE IF NOT EXISTS login_user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        login_date TEXT,
        device TEXT,
        ip_address TEXT,
        city TEXT,
        country TEXT
      )`)

      // Create history_user table
      db.run(`CREATE TABLE IF NOT EXISTS history_user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        game_name TEXT,
        game_id TEXT,
        game_type TEXT,
        date TEXT,
        status INTEGER,
        sum REAL
      )`)

      // Create order_table table
      db.run(`CREATE TABLE IF NOT EXISTS order_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        payment_id TEXT,
        customer_id TEXT,
        order_date TEXT,
        amount REAL,
        method TEXT,
        country TEXT,
        city TEXT,
        email TEXT,
        phone TEXT,
        description TEXT,
        currency TEXT,
        currency_exchange TEXT,
        exchange_rate REAL
      )`)

      // Create withdraw_table table
      db.run(`CREATE TABLE IF NOT EXISTS withdraw_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL,
        currency TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        country TEXT,
        city TEXT,
        iban TEXT,
        date TEXT
      )`)

      // Create newsletters table
      db.run(`CREATE TABLE IF NOT EXISTS newsletters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT
      )`)

      // Seed default demo user
      const demoEmail = 'user@gmail.com'
      const demoPass = 'test123'
      const encryptedPass = JSON.stringify(encrypt(demoPass))
      const uuid = 'demo-user-uuid-123456789'
      const timestamp = new Date().getTime() + ""

      db.run(
        `INSERT OR IGNORE INTO casino_user (uuid, user, email, phone, pass, account_type, money, signup, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuid, 'DemoUser', demoEmail, '+1234567890', encryptedPass, 1, 1000, timestamp, 1],
        (err) => {
          db.close(() => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      )
    })
  })
}
