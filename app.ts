import express from 'express';
import { router } from "./routes"
const app = express();
const port: Number = 3333
//importar as rotas
app.use(express.json())
app.use(router)

app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`)
})

/**
 * para entrar no db só rodar{
 * docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=db_teste -d postgres
 * } o mesmo, abrir o shell{
 * docker exec -it af81fe9489f93212b146db34c7f88b72acfda9d42537cb819eabd0ffda3dd8b2 bash
 * } e rodar {
 * psql db_teste root
 * }
 *
 *
 * docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
 */