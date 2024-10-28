import { db } from "../config/database.js"
import { Email } from "../models/emailModel.js"

class EmailDAO {

  static getPrimaryEmailByUserId(userId) {
    const query = `SELECT * FROM emails WHERE user_id = ? AND is_primary = 1`
    const email = db.prepare(query).get(userId)
    return email ? new Email(email.id, email.user_id, email.email, true) : null
  }

  static getEmailsByUserId(userId) {
    const query = `SELECT * FROM emails WHERE user_id = ?`
    const emails = db.prepare(query).all(userId)
    return emails.map(
      (e) => new Email(e.id, e.user_id, e.email, e.is_primary === 1)
    )
  }

  static updateEmail(id, email) {
    const query = `UPDATE emails SET email = ? WHERE id = ?`
    db.prepare(query).run(email, id)
  }

  static deleteEmail(id) {
    const query = `DELETE FROM emails WHERE id = ?`
    db.prepare(query).run(id)
  }

  static addEmail(userId, email, isPrimary = false) {

    if (isPrimary) {
      const resetPrimaryQuery = `UPDATE emails SET is_primary = 0 WHERE user_id = ?`
      db.prepare(resetPrimaryQuery).run(userId)
    }

    const insertQuery = `INSERT INTO emails (user_id, email, is_primary) VALUES (?, ?, ?)`
    db.prepare(insertQuery).run(userId, email, isPrimary ? 1 : 0)
  }

  static setPrimaryEmail(userId, emailId) {
    const resetPrimaryQuery = `UPDATE emails SET is_primary = 0 WHERE user_id = ?`
    db.prepare(resetPrimaryQuery).run(userId)

    const setPrimaryQuery = `UPDATE emails SET is_primary = 1 WHERE id = ? AND user_id = ?`
    db.prepare(setPrimaryQuery).run(emailId, userId)
  }

  static deleteEmailsByUserId(userId) {
    const query = `DELETE FROM emails WHERE user_id = ?`
    db.prepare(query).run(userId)
  }

  static countEmails() {
    const stmt = db.prepare("SELECT count(*) as total FROM emails")
    const result = stmt.get()
    return result ? result.total : 0
  }

  static countPhones() {
    const stmt = db.prepare("SELECT count(*) as total FROM phones")
    const result = stmt.get()
    return result ? result.total : 0
  }
}

export { EmailDAO }
