import express from 'express';
const app = express();
const port = 3333
//importar as rotas

app.get('/', (req, res) => {
    res.send('Hello Word!');
})

app.listen(port, (err) => {
    return console.error(err)
})