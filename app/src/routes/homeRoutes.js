import { Router } from 'express'
import { homePage } from '../controllers/homeController.js'

const router = Router()

router.get('/home', homePage)

export default router
