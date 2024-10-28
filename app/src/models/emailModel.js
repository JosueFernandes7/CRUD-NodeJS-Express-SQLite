class Email {
  constructor(id, userId, email, isPrimary = false) {
    this.id = id
    this.userId = userId
    this.email = email
    this.isPrimary = isPrimary
  }
}

export { Email }
