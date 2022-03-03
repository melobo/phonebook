import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchName, setSearchName] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = event => setNewName(event.target.value)
  
  const handleNumberChange = event => setNewNumber(event.target.value)

  const handleSearchChange = event => setSearchName(event.target.value)

  const addPhone = event => {
    event.preventDefault()
    const nameArr = persons.map(person => person.name.toLowerCase())
    const hasRepeatedName = nameArr.includes(newName.toLowerCase())
    //Check for name in array
    if (hasRepeatedName) return window.alert(`${newName} is already added to phonebook`)
    const phoneObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    
    setPersons(persons.concat(phoneObject))
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = !searchName
    ? persons  
    : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchName={searchName}
        handleSearchChange={handleSearchChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        addPhone={addPhone}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App
