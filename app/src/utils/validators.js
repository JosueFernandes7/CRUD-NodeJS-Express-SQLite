function isValidCpf(cpf) {
  if (typeof cpf !== 'string') return false
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
  cpf = cpf.split('').map(el => +el)
  const rest = (count) => (cpf.slice(0, count-12)
      .reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10
  return rest(10) === cpf[9] && rest(11) === cpf[10]
}

function isValidPhone(phone) {
  // Removes non-numeric characters (spaces, parentheses, hyphens, etc.)
  phone = phone.replace(/[^\d]/g, '')

  // Checks if the length is 10 (landline) or 11 (cellphone with area code)
  if (phone.length !== 10 && phone.length !== 11) {
    return false
  }

  // Checks if the number follows the Brazilian format for landline or mobile phones
  const fixedPhonePattern = /([+55]{3})([(]?[0]?[1-9]{2}[)]?)[9]?([1-9]{4})-?([0-9]{4})/
  /// (XX) XXXX-XXXX
  const mobilePhonePattern = /^(\d{2})(\d{5})(\d{4})$/ // (XX) XXXXX-XXXX

  // Tests if the number matches one of the patterns
  return fixedPhonePattern.test(phone) || mobilePhonePattern.test(phone)
}

function handleValidationError(res, message) {
  return res.status(400).json({ error: message })
}

function logError(location, error) {
  console.error(`Erro em ${location}:`, error.message)
}

export { isValidCpf , isValidPhone, logError, handleValidationError}
