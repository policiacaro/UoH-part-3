const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('postData', function (req,res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const newId = Math.ceil(Math.random() * 10000)
  while((persons.map(p => p.id)).includes(`${newId}`)) {
    newId = Math.ceil(Math.random() * 10000)
  }
  return newId.toString()
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const newPerson = persons.find(person => person.id === id)
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post(`/api/persons`, (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  if ((persons.map(p => p.name).includes(request.body.name))) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const newPerson = {
    "id": generateId(),
    "name": request.body.name,
    "number": request.body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*
app.get('', (request, response) => {

})
*/
