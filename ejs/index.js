const express = require('express')
const { Router } = express
const Contenedor = require('./Contenedor.js')

const app = express()
const router = Router()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'))
app.set('view engine', 'ejs')
app.set('views', './views')

let seeProducts = new Contenedor('productos')

router.get('/', (req, res) => {
    let data
    (async function getData () {
        data = await seeProducts.getAll()
        res.render('index', {title: 'Coderhouse', data: data})
    })()
})

router.get('/new-product', (req, res) => {
    res.render('newProduct', {title: "Nuevo producto"})
})

router.get('/:id', async (req, res) => {
    let result = await seeProducts.getById(req.params.id)
    if(result === null) {
        result = { error : 'producto no encontrado' }
        console.log('producto no encontrado')
    }
    res.send(JSON.stringify(result))
})

router.post('/', async (req, res) => {
    const id = await seeProducts.save(req.body)
    console.log(req.body);
    res.redirect('/api/productos/new-product')
})

router.delete('/:id', async (req, res) => {
    await seeProducts.deleteById(req.params.id)
    res.send("Eliminación correcta")
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const result = await seeProducts.update(id, req.body)
    
    result != null ? res.send("Producto actualizado") : (res.send("ID no válida"), console.log("ID no válida"))
})

app.use('/api/productos', router)
app.listen(process.env.PORT || 8080)