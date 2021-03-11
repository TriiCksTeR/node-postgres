import { Request, Response } from 'express';
import User from '../models/user'

class UserController {
    async create(request: Request, response: Response) {
        //validation here

        const user_db = await User.findByPk(request.params.email)
        if (user_db) {
            return response.status(400).json({
                error: { "User Email Already Exists"}
            })
        } else {
            await User.create(request.body);
        }
        return response.status(201).json();
    }
    async update(request: Request, response: Response) {
        //validation here


        const user_db = await User.findByPk(request.params.id)
        if (!user_db) {
            return response.status(400).json({ error: 'User does not Exists' });
        } else {
            await user_db.update(request.body);
        }
        return response.status(201).json();
    }
    async find(request: Request, response: Response) {
        //validation here


        const db_users = await User.findAll();
        if (!db_users) {
            return response.status(400).json({ error: "You Need Create Users" })
        } else {
            return response.status(201).json(db_users);
        }
    }
    async findOne(request: Request, response: Response) {
        //validation here


        const user_db = await User.findByPk(request.params.id);
        if (!user_db) {
            return response.status(400).json({ error: "User does not Exists" })
        } else {
            return response.status(201).json(user_db);
        }
    }
    async delete(request: Request, response: Response) {
        //validation here


        const user_db = await User.findByPk(request.params.id);
        if (!user_db) {
            return response.status(400).json({ error: "User does not Exists" })
        } else {
            await user_db?.destroy();
        }
        return response.status(201).json();
    }
    async deleteAll(request: Request, response: Response) {
        //validation here


        const db_users = await User.findAll()
        if (!db_users) {
            return response.status(400).json({ error: "You Need Create Users" })
        } else {
            await Promise.all(db_users?.map(async (user) => {
                await user.destroy()
            }))
        }
        return response.status(201).json(db_users)
    }


}
export { UserController }