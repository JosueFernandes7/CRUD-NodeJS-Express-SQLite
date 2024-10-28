import { UserDao } from "../dao/userDAO.js"
import { EmailDAO } from "../dao/emailDAO.js"
import { PhoneDAO } from "../dao/phoneDAO.js"
import {
  logError,
  isValidCpf,
  isValidPhone,
  handleValidationError,
} from "../utils/validators.js"
import { User } from "../models/userModel.js"
import { formatCPF } from "../utils/string.js"


// DELETE => /users/deleteUser/:id
async function deleteUser(req, res) {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    return handleValidationError(res, "ID de usuário inválido.")
  }

  try {
    const user = await UserDao.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." })
    }

    if (user.profile === "ADMIN") {
      return res
        .status(403)
        .json({ error: "Não é permitido excluir um usuário ADMIN." })
    }

    await EmailDAO.deleteEmailsByUserId(userId)
    await PhoneDAO.deletePhonesByUserId(userId)
    await UserDao.deleteUserById(userId)

    res.json({ success: true })
  } catch (error) {
    logError("deleteUser", error)
    res.status(500).json({ error: "Erro ao processar a exclusão do usuário." })
  }
}

// DELETE => /users/email/:id/delete
async function deleteEmail(req, res) {
  const emailId = parseInt(req.params.id)

  if (isNaN(emailId)) {
    return handleValidationError(res, "ID de email inválido.")
  }

  try {
    await EmailDAO.deleteEmail(emailId)
    res.json({ message: "Email removido com sucesso." })
  } catch (error) {
    logError("deleteEmail", error)
    res.status(500).json({ error: "Erro ao remover email." })
  }
}

// DELETE => /users/phone/:id/delete
async function deletePhone(req, res) {
  const phoneId = parseInt(req.params.id)

  if (isNaN(phoneId)) {
    return handleValidationError(res, "ID de telefone inválido.")
  }

  try {
    await PhoneDAO.deletePhone(phoneId)
    res.json({ message: "Telefone removido com sucesso." })
  } catch (error) {
    logError("deletePhone", error)
    res.status(500).json({ error: "Erro ao remover telefone." })
  }
}

// PUT => /users/:id/updateName
async function updateUserName(req, res) {
  const userId = parseInt(req.params.id)
  const { name } = req.body

  if (!userId || isNaN(userId)) {
    return handleValidationError(res, "ID de usuário inválido.")
  }

  if (!name || name.trim() === "") {
    return handleValidationError(res, "Nome é obrigatório.")
  }

  try {
    await UserDao.updateName(userId, name.trim())
    res.json({ message: "Nome atualizado com sucesso." })
  } catch (error) {
    logError("updateUserName", error)
    res.status(500).json({ error: "Erro ao atualizar o nome." })
  }
}

// PUT => /users/email/:id/setPrimary
async function setPrimaryEmail(req, res) {
  const emailId = parseInt(req.params.id)
  const { userId } = req.body

  if (!userId || isNaN(emailId)) {
    return handleValidationError(res, "User ID e Email ID são obrigatórios.")
  }

  try {
    await EmailDAO.setPrimaryEmail(userId, emailId)
    res.json({ message: "Email definido como principal com sucesso." })
  } catch (error) {
    logError("setPrimaryEmail", error)
    res.status(500).json({ error: "Erro ao definir email como principal." })
  }
}

// PUT => /users/phone/:id/setPrimary
async function setPrimaryPhone(req, res) {
  const phoneId = parseInt(req.params.id)
  const { userId } = req.body

  if (!userId || isNaN(phoneId)) {
    return handleValidationError(res, "User ID e Phone ID são obrigatórios.")
  }

  try {
    await PhoneDAO.setPrimaryPhone(userId, phoneId)
    res.json({ message: "Telefone definido como principal com sucesso." })
  } catch (error) {
    logError("setPrimaryPhone", error)
    res.status(500).json({ error: "Erro ao definir telefone como principal." })
  }
}

// POST => /users/phone/add
async function addPhone(req, res) {
  const { userId, phone } = req.body

  if (!isValidPhone(phone)) {
    return handleValidationError(res, "Número de telefone inválido. Certifique-se de que o formato está correto. (DDD) XXXX-XXXX")
  }

  if (!userId || !phone || !isValidPhone(phone)) {
    return handleValidationError(res, "User ID e telefone são obrigatórios.")
  }

  try {
    await PhoneDAO.addPhone(userId, phone)
    res.json({ message: "Telefone adicionado com sucesso." })
  } catch (error) {
    logError("addPhone", error)
    res.status(500).json({ error: "Erro ao adicionar telefone." })
  }
}

// POST => /users/email/add
async function addEmail(req, res) {
  const { userId, email } = req.body
  if (!userId || !email) {
    return handleValidationError(res, "User ID e email são obrigatórios.")
  }

  try {
    await EmailDAO.addEmail(userId, email)
    res.json({ message: "Email adicionado com sucesso." })
  } catch (error) {
    logError("addEmail", error)
    res.status(500).json({ error: "Erro ao adicionar email." })
  }
}

// POST => /users/add
async function addUser(req, res) {
  const { cpf, name, email, phone } = req.body

  if (!cpf || !name || !email || !phone) {
    return res.status(400).json({
      success: false,
      errorMessage:
        "Todos os campos são obrigatórios. Por favor, preencha todos os campos.",
    })
  }

  if (!isValidCpf(cpf)) {
    return res.status(400).json({
      success: false,
      errorMessage:
        "CPF inválido. Certifique-se de que possui 11 dígitos numéricos.",
    })
  }
  
  if (!isValidPhone(phone)) {
    return res.status(400).json({
      success: false,
      errorMessage:
        "Número de telefone inválido. Certifique-se de que o formato está correto. (DDD) XXXX-XXXX",
    })
  }

  try {
    const formatedCpf = formatCPF(cpf)
    const existingUser = await UserDao.findByCpf(formatedCpf)

    if (existingUser) {
      return res.status(400).json({
        success: false,
        errorMessage: `O usuário com CPF ${cpf} já está cadastrado. Por favor, use outro CPF.`,
      })
    }

    await UserDao.save(formatedCpf, name)
    const user = await UserDao.findByCpf(formatedCpf)

    if (!user) {
      throw new Error("Erro ao recuperar o usuário após salvá-lo.")
    }

    await EmailDAO.addEmail(user.id, email, true)
    await PhoneDAO.addPhone(user.id, phone, true)

    res.json({ success: true, message: "Usuário cadastrado com sucesso!" })
  } catch (error) {
    console.error(`Erro inesperado ao cadastrar o usuário: ${error.message}`)
    res.status(500).json({
      success: false,
      errorMessage:
        "Erro ao processar a requisição. Tente novamente mais tarde.",
    })
  }
}

// GET => /search
async function searchUsersByName(req, res) {
  const search = req.query.name || ""
  const usersPerPage = 5

  if (!search) {
    return res.json({ users: [] })
  }

  try {
    const usersRaw = await UserDao.listByName(search, usersPerPage)
    const users = usersRaw.map((u) => {
      const primaryEmail =
        EmailDAO.getPrimaryEmailByUserId(u.id)?.email || null
      const primaryPhone =
        PhoneDAO.getPrimaryPhoneByUserId(u.id)?.phoneNumber || null

      return {
        id: u.id,
        name: u.name,
        cpf: u.cpf,
        primaryEmail,
        primaryPhone,
        profile: u.profile,
      }
    })

    res.json({ users })
  } catch (error) {
    logError("searchUsersByName", error)
    res.status(500).json({ error: "Erro ao buscar usuários pelo nome." })
  }
}

// GET => /users
async function listUsers(req, res) {
  const currentPage = parseInt(req.query.page) || 1
  const usersPerPage = 5
  
  try {
    const totalUsers = await UserDao.countUsers()
    const totalPages = Math.ceil(totalUsers / usersPerPage)
    if(totalUsers != 0) {
      if (currentPage > totalPages) {
        
        return res.redirect(`/users?page=${totalPages}`)
      }
      if (currentPage < 1) {
        return res.redirect(`/users?page=1`)
      }
    }

    const offset = (currentPage - 1) * usersPerPage
    const usersRaw = await UserDao.list(offset, usersPerPage)

    const users = usersRaw.map((u) => {
      const primaryEmail =
        EmailDAO.getPrimaryEmailByUserId(u.id)?.email || null
      const primaryPhone =
        PhoneDAO.getPrimaryPhoneByUserId(u.id)?.phoneNumber || null

      return {
        ...new User(u.id, u.cpf, u.name, u.profile),
        primaryEmail,
        primaryPhone,
      }
    })
    console.log({users})
    
    res.render("usersListagem", {
      data: {
        users,
        currentPage,
        totalUsers,
        totalPages,
        error: null,
      },
    })
  } catch (error) {
    logError("listUsers", error)
    res.status(500).send("Erro ao carregar a lista de usuários.")
  }
}

// GET => /users/:id
async function userDetails(req, res) {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    return res.status(400).send("ID de usuário inválido.")
  }

  try {
    const user = await UserDao.findById(userId)
    if (!user) {
      return res.status(404).send("Usuário não encontrado.")
    }

    const primaryEmail = await EmailDAO.getPrimaryEmailByUserId(userId)
    const allEmails = await EmailDAO.getEmailsByUserId(userId)
    const emails = allEmails.filter((email) => !email.isPrimary)

    const primaryPhone = await PhoneDAO.getPrimaryPhoneByUserId(userId)
    const allPhones = await PhoneDAO.getPhonesByUserId(userId)
    const phones = allPhones.filter((phone) => !phone.isPrimary)

    res.render("userDetails", {
      data: {
        user,
        primaryEmail,
        emails,
        primaryPhone,
        phones,
      },
    })
  } catch (error) {
    logError("userDetails", error)
    res.status(500).send("Erro ao carregar os detalhes do usuário.")
  }
}

// GET => /users/add
function pageAddUser(req, res) {
  res.render("addUser", { data: { title: "WEB II - Add User" } })
}

// GET => /users/updateUser/:id
async function updateUsers(req, res) {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    return res.status(400).send("ID de usuário inválido.")
  }

  try {
    const user = await UserDao.findById(userId)
    if (!user) {
      return res.status(404).send("Usuário não encontrado.")
    }

    const primaryEmail = await EmailDAO.getPrimaryEmailByUserId(userId)
    const allEmails = await EmailDAO.getEmailsByUserId(userId)
    const emails = allEmails.filter((email) => !email.isPrimary)

    const primaryPhone = await PhoneDAO.getPrimaryPhoneByUserId(userId)
    const allPhones = await PhoneDAO.getPhonesByUserId(userId)
    const phones = allPhones.filter((phone) => !phone.isPrimary)

    res.render("userUpdate", {
      data: {
        user,
        primaryEmail,
        emails,
        primaryPhone,
        phones,
      },
    })
  } catch (error) {
    logError("updateUsers", error)
    res.status(500).send("Erro ao carregar os detalhes do usuário.")
  }
}

export {
  addUser,
  addEmail,
  addPhone,
  listUsers,
  deleteUser,
  deleteEmail,
  userDetails,
  deletePhone,
  updateUsers,
  pageAddUser,
  updateUserName,
  setPrimaryPhone,
  setPrimaryEmail,
  searchUsersByName,
}
