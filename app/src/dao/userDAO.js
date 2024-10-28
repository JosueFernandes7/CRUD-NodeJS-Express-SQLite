import { db } from "../config/database.js"
import { User } from "../models/userModel.js"

class UserDao {

  static list(offset = 0, limit = 5) {
    const query = `SELECT * FROM users LIMIT ? OFFSET ?`
    const stmt = db.prepare(query)
    const users = stmt.all(limit, offset)
    return users
  }

  static countUsers() {
    const stmt = db.prepare("SELECT count(*) as total FROM users")
    const result = stmt.get()
    return result ? result.total : 0
  }

  static countUsersByName(name) {
    const stmt = db.prepare("SELECT count(*) as total FROM users WHERE name LIKE ?")
    const result = stmt.get(`%${name}%`) 
    return result ? result.total : 0
  }

  static listByName(name, limit = 5) {
    const query = `SELECT * FROM users WHERE name LIKE ? LIMIT ?`
    const stmt = db.prepare(query)
    const users = stmt.all(`%${name}%`, limit) 
    return users
  }

  static findByCpf(cpf) {
    const stmt = db.prepare("SELECT * FROM users WHERE cpf = ?")
    const userRow = stmt.get(cpf)
    
    return userRow ? new User(userRow.id, userRow.cpf, userRow.name, userRow.profile) : null
  }

  static save(cpf, name) {
    try {
      const profile = Math.random() < 0.2 ? "ADMIN" : "CLIENTE" // 10% ADMIN <==> 80% CLIENTE
      const stmt = db.prepare(
        "INSERT INTO users (cpf, name, profile) VALUES (@cpf, @name, @profile)"
      )
      return stmt.run({ cpf, name, profile })
    } catch (e) {
      console.log(e)
    }
  }

  static findById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1")
    const userRow = stmt.get(id)
    return userRow ? new User(userRow.id, userRow.cpf, userRow.name, userRow.profile) : null
  }

  static updateName(id, name) {
    const query = `UPDATE users SET name = ? WHERE id = ?`
    db.prepare(query).run(name, id)
  }

  static deleteUserById(id) {
    const query = `DELETE FROM users WHERE id = ?`
    db.prepare(query).run(id)
  }

  static countUsers() {
    const stmt = db.prepare("SELECT count(*) as total FROM users")
    const result = stmt.get()
    return result ? result.total : 0
  }
}

export { UserDao }
