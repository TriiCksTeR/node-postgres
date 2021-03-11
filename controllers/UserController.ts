import { Request, Response } from 'express';
import User from '../models/user'
import yup from 'yup';
import bcrypt from 'bcrypt'

class UserController {
    async create(request: Request, response: Response) {
        const schema = yup.object().shape({
            firstName: yup.string().required("First Name is Required"),
            lastName: yup.string().required("Last Name is Required"),
            email: yup.string().email().required("Email is Required"),
            password: yup.string().required("Password is Required")
                .matches(RegExp("(.*[a-z].*)"), "Lowercase")
                .matches(RegExp("(.*[A-Z].*)"), "Uppercase")
                .matches(RegExp("(.*\\d.*)"), "Number")
                .matches(RegExp("/[a-zA-Z0-9]\z/"), "Without Special Characters")
            // '[!@#$%^&*(),.?":{}|<>]'), "Special" <<habilite special characters
        })
        try {
            await schema.isValid(request.body, { abortEarly: false })
        } catch (error) {
            const err = error.errors;
            return response.status(400).json({ err })
        }

        const user_db = await User.findOne(request.body.email)
        if (user_db) {
            return response.status(400).json({
                error: "User Email Already Exists"
            });
        } else {
            const pass = request.body.password;
            const saltRounds = '10'
            const hash = await bcrypt.hash(pass, saltRounds);

            const newUser = await User.create({
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                password: hash
            });
            return response.status(201).json(newUser);
        }
    }


    async update(request: Request, response: Response) {
        const schema = yup.object().shape({
            id: yup.string().required("id is Required")
        })
        try {
            await schema.isValid(request.body, { abortEarly: false })
        } catch (error) {
            const err = error.errors;
            return response.status(400).json({ err })
        }


        const user_db = await User.findByPk(request.body.id)
        if (!user_db) {
            return response.status(400).json({ error: 'User does not Exists' });
        } else {
            await user_db.update(request.body);
        }
        return response.status(201).json();
    }


    async find(request: Request, response: Response) {
        const db_users = await User.findAll();
        if (!db_users) {
            return response.status(400).json({ error: "You Need Create Users" })
        } else {
            return response.status(201).json(db_users);
        }
    }


    async findOne(request: Request, response: Response) {
        const schema = yup.object().shape({
            id: yup.string().required("id is Required")
        })
        try {
            await schema.isValid(request.body, { abortEarly: false })
        } catch (error) {
            const err = error.errors;
            return response.status(400).json({ err })
        }


        const user_db = await User.findByPk(request.body.id);
        if (!user_db) {
            return response.status(400).json({ error: "User does not Exists" })
        } else {
            return response.status(201).json(user_db);
        }
    }


    async delete(request: Request, response: Response) {
        const schema = yup.object().shape({
            id: yup.string().required("id is Required")
        })
        try {
            await schema.isValid(request.body, { abortEarly: false })
        } catch (error) {
            const err = error.errors;
            return response.status(400).json({ err })
        }


        const user_db = await User.findByPk(request.body.id);
        if (!user_db) {
            return response.status(400).json({ error: "User does not Exists" })
        } else {
            await user_db?.destroy();
        }
        return response.status(201).json();
    }


    async deleteAll(request: Request, response: Response) {
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