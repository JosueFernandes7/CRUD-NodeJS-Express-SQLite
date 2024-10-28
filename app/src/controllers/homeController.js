import { UserDao } from "../dao/userDAO.js"
import { EmailDAO } from "../dao/emailDAO.js"
import { PhoneDAO } from "../dao/phoneDAO.js"

// GET => /home
async function homePage(req, res) {
  try {
    const [userCount, emailCount, phoneCount] = await Promise.all([
      UserDao.countUsers(),
      EmailDAO.countEmails(),
      PhoneDAO.countPhones()
    ])

    res.render('home', {
      data: {
        userCount,
        emailCount,
        phoneCount
      }
    })
  } catch (error) {
    console.error('Erro ao carregar a página inicial:', error)
    res.status(500).send("Erro ao processar a requisição.")
  }
}

export { homePage }
