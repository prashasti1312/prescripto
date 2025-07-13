import express from 'express'
import { doctorList,loginDoctor} from '../controllers/doctorController.js' //,appointmentsDoctor 
// import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter=express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
// doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)

export default doctorRouter