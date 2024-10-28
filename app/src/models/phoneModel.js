class Phone {
  constructor(id, userId, phoneNumber, isPrimary = false) {
    this.id = id
    this.userId = userId
    this.phoneNumber = phoneNumber
    this.isPrimary = isPrimary
  }
}

export { Phone }
