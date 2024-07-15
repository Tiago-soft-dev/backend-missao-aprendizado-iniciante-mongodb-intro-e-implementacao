const express=require('express')
const { MongoClient, ObjectId } = require('mongodb')

//dados de configuracao do servidor
const dbUrl = 'mongodb+srv://admin:WeL94dTtknnEOVJr@cluster0.1b2ewyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'mongodb-intro-e-implementacao'

async function main(){

//conexao do servidor    
const client = new MongoClient(dbUrl)
console.log('Conectando ao BD');
await client.connect()
console.log('BD conectado');
const db = client.db(dbName)
const collection = db.collection('personagem')

const app=express()
app.use(express.json())


const lista = ['Java', 'Kotlin', 'Android']

//endpoint read all get
app.get('/personagem', async (req,res)=>{
    const itens = await collection.find().toArray()
    res.send(itens)
})

//endpoint /personagem/count
app.get('/personagem/count', (req,res)=>{
    const totalItens = lista.length
    res.send(`Número total de itens: ${totalItens}`)
})

//endpoint read by id get
app.get('/personagem/:id', async (req,res)=>{
    let id = req.params.id
    const item = await collection.findOne({_id: new ObjectId(id)})
    if(!item){
        return res.status(404).send('Item não encontrado.')
    }
    res.send(item);
})

//endpoint create post
app.post('/personagem',(req,res)=>{
    const body = req.body
    const novoItem = body.nome
    if(!novoItem){
        return res.status(400).send('Corpo da requisição inválido')
    }

    if(lista.includes(novoItem)){
        return res.status(409).send('Item já existe na lista')
    }
    
    lista.push(novoItem)
    res.status(201).send('Item adicionado com sucesso: ' + novoItem)
})

//endpoint update put
app.put('/personagem/:id', (req,res)=>{
    const id = req.params.id - 1
    const body = req.body
    lista[id] = body.nome
    res.send('Item atualizado com sucesso')

})

//endpoint delete
app.delete('/personagem/:id', (req,res)=>{
    const id = req.params.id - 1
    delete lista[id]
    res.send('Item deletado com sucesso! ')
})

app.listen(3000, ()=>console.log('servidor online'))
}
main()