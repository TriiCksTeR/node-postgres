import { Request, Response, text } from 'express';
import User from '../models/user'
import * as yup from 'yup';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const key: string = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYxNTg1NjU3OSwiaWF0IjoxNjE1ODU2NTc5fQ.BczrTQ26wM4yWplQ14H2VYDUz1Bh8AEEALCnmwmCGjU'
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

        const user_db = await User.findOne({ where: { email: request.body.email } })
        if (user_db) {
            return response.status(400).json({
                error: "User Email Already Exists"
            });
        } else {
            const pass = request.body.password;
            const saltRounds = 10
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

    async userAuthenticate(request: Request, response: Response) {
        const schema = yup.object().shape({
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


        const password: any = await User.findOne({
            attributes: ['password'], where: { email: request.body.email }
        });

        const payloadId = await User.findOne({ attributes: ['id'], where: { email: request.body.email } });

        const userData = await User.findOne({ where: { email: request.body.email } });

        if (!password) {
            return response.status(400).json({ error: "Email Incorrectly or Does Not Exists" });
        } else {
            const [pass] = Object.values(password.toJSON())

            const condition = await bcrypt.compare(request.body.password, String(pass))
            if (!condition) {
                return response.status(400).json({ error: "password wrong" });
            } else {

                const token = jwt.sign({ payloadId }, key, { expiresIn: '1h' })
                return response.status(201).json({ userData, token });
            }
        };
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
            jwt.verify(request.body.token, key, () => {
                try {
                    return response.status(201).json(user_db);
                } catch (error) {
                    return response.status(400).json({ error: "Invalid Token" })
                }
            })
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