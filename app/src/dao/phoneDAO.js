import { db } from "../config/database.js"
import { Phone } from "../models/phoneModel.js"

class PhoneDAO {

  static getPrimaryPhoneByUserId(userId) {
    const query = `SELECT * FROM phones WHERE user_id = ? AND is_primary = 1 LIMIT 1`
    const phone = db.prepare(query).get(userId)
    return phone
      ? new Phone(phone.id, phone.user_id, phone.number, true)
      : null
  }

  static getPhonesByUserId(userId) {
    const query = `SELECT * FROM phones WHERE user_id = ?`
    const phones = db.prepare(query).all(userId)
    return phones.map(
      (phone) =>
        new Phone(phone.id, phone.user_id, phone.number, phone.is_primary === 1)
    )
  }

  static updatePhone(id, phoneNumber) {
    const query = `UPDATE phones SET number = ? WHERE id = ?`
    db.prepare(query).run(phoneNumber, id)
  }

  static addPhone(userId, phoneNumber, isPrimary = false) {

    if (isPrimary) {
      const resetPrimaryQuery = `UPDATE phones SET is_primary = 0 WHERE user_id = ?`
      db.prepare(resetPrimaryQuery).run(userId)
    }

    const insertQuery = `INSERT INTO phones (user_id, number, is_primary) VALUES (?, ?, ?)`
    db.prepare(insertQuery).run(userId, phoneNumber, isPrimary ? 1 : 0)
  }

  static setPrimaryPhone(userId, phoneId) {
    const resetPrimaryQuery = `UPDATE phones SET is_primary = 0 WHERE user_id = ?`
    db.prepare(resetPrimaryQuery).run(userId)

    const setPrimaryQuery = `UPDATE phones SET is_primary = 1 WHERE id = ? AND user_id = ?`
    db.prepare(setPrimaryQuery).run(phoneId, userId)
  }

  static deletePhone(id) {
    const query = `DELETE FROM phones WHERE id = ?`
    db.prepare(query).run(id)
  }

  static deletePhonesByUserId(userId) {
    const query = `DELETE FROM phones WHERE user_id = ?`
    db.prepare(query).run(userId)
  }

  static countPhones() {
    const stmt = db.prepare("SELECT count(*) as total FROM phones")
    const result = stmt.get()
    return result ? result.total : 0
  }
}

export { PhoneDAO }
