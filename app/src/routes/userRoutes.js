import { Router } from 'express'
import {
  listUsers,
  addUser,
  searchUsersByName,
  userDetails,
  addEmail,
  setPrimaryEmail,
  deleteEmail,
  addPhone,
  setPrimaryPhone,
  deletePhone,
  updateUsers,
  updateUserName,
  deleteUser,
  pageAddUser
} from '../controllers/userController.js'

const router = Router()

// GET
router.get('/', listUsers)
router.get('/add', pageAddUser)
router.get('/search', searchUsersByName)
router.get('/user/:id', userDetails)
router.get('/updateUser/:id', updateUsers)

// POST
router.post('/add', addUser)
router.post('/email/add', addEmail)
router.post('/phone/add', addPhone)

// PUT
router.put('/:id/updateName', updateUserName)
router.put('/email/:id/setPrimary', setPrimaryEmail)
router.put('/phone/:id/setPrimary', setPrimaryPhone)

// DELETE
router.delete('/deleteUser/:id', deleteUser)
router.delete('/email/:id/delete', deleteEmail)
router.delete('/phone/:id/delete', deletePhone)

export default router
