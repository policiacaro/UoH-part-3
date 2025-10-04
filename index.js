const express = require('express')
const morgan = require('morgan')
const app = express()

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
    "name": "Mark Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

morgan.token('postData', function postRequestData (req) {
  return JSON.stringify(req.body)
})

app.get('', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get(`/api/persons/:id`,(request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const idArray = persons.map(person => Number(person.id))
  const newId = Math.ceil(Math.random() * 10000)

  while (idArray.includes(newId)) {
    newId = Math.ceil(Math.random() * 10000)
  }

  return newId
}

app.post(`/api/persons`, (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const listOfPeopleNames = persons.map(person => person.name)
  if (listOfPeopleNames.includes(request.body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId().toString(),
    name: request.body.name.toString(),
    number: request.body.number.toString()
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
