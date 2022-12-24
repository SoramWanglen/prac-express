

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

let port = 2345

// app.get('/',(req,res)=>{
//     res.send('welcome to home page!')
// })

// const deleteButton = document.querySelector('#delete-button')

// deleteButton.addEventListener('click', _ => {
//     fetch('/quotes', {
//       method: 'delete',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name: 'Darth Vadar'
//       })
//     })
//       .then(res => {
//         if (res.ok) return res.json()
//       })
//       .then(data => {
//         window.location.reload()
//       })
//   })


MongoClient.connect('mongodb+srv://wanglen:asdf1234@cluster0.r79zfp2.mongodb.net/?retryWrites=true&w=majority',{useUnifiedTopology:true})
    .then(client=>{
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        //need to put app.set before any app. function like use,get
        app.set('view engine','ejs')

        
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
        app.use(express.static('public'))

        app.get('/', (req,res)=>{
           // res.sendFile(__dirname + '/test.html')
            db.collection('quotes').find().toArray()
            .then(results=>{
                console.log(results)
                res.render('index.ejs',{})
            })
            .catch(error=>console.error(error))
            
           
        })

        app.post('/quotes',(req,res)=>{
            console.log('form submission successful!')
            console.log(req.body)
            quotesCollection.insertOne(req.body)
            .then(result=>{
                console.log(result)
                res.redirect('/')
            })
            .catch(error=>console.error(error))
        })

        app.put('/quotes',(req,res)=>{
            console.log(req.body)
            quotesCollection.findOneAndUpdate(
                {name: 'Yoda'},
                {
                    $set:{
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result=>{
                    console.log(result)
                    res.json('Success')
                })
                .catch(error=>console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
              { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                  return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vadar\'s quote')
              })
              .catch(error => console.error(error))
          })

        app.listen(port,()=>{
            console.log('server is running successfully!')
         })
    })




