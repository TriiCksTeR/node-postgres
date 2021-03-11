import { Request, Response } from 'express';
import User from '../models/user'

class UserController {
    async create(request: Request, response: Response) {
        const user = await User.create(request.body);
        return response.status(201).json(user);
    }
    async update(request: Request, response: Response) {
        const user_db = await User.findByPk(request.params.id)
        if (!user_db) {
            return response.status(400).json({ error: 'User does not Exists' })
        } else {
            await user_db.update(request.body)
        }
        return response.status(201).json()
    }
    async find(request: Request, response: Response) {
        const db_users = await User.findAll()
        return response.status(201).json(db_users)
    }
    async findOne(request: Request, response: Response) {
        const user_db = await User.findByPk(request.params.id)
        return response.status(201).json(user_db)

    }
    async delete(request: Request, response: Response) {
        const user_db = await User.findByPk(request.params.id)
        await user_db?.destroy();
        return response.status(201).json(user_db)
    }
    async deleteAll(request: Request, response: Response) {
        const db_users = await User.findAll()
        await Promise.all(db_users?.map(async (user) => {
            await user.destroy()
        }))
        return response.status(201).json(db_users)
    }


}
export { UserController }