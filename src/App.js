import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [searchName, setSearchName] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  const handleNameChange = event => setNewName(event.target.value)
  
  const handleNumberChange = event => setNewNumber(event.target.value)

  const handleSearchChange = event => setSearchName(event.target.value)

  const displayNotification = (message, error = false) => {
    setNotificationMessage({
      text: message,
      error
    })
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPhone = event => {
    event.preventDefault()
    const nameArr = persons.map(person => person.name.toLowerCase())
    const hasRepeatedName = nameArr.includes(newName.toLowerCase())
    //Check for name in array
    if (hasRepeatedName) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return
      const person = persons.find(n => n.name.toLowerCase() === newName.toLocaleLowerCase())
      const changedPerson = {...person, number: newNumber}
      personService
        .update(person.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(personMapped => personMapped.id !== person.id ? personMapped : returnedPerson))
          setNewName('')
          setNewNumber('')
          displayNotification(`Information of ${returnedPerson.name} modified`)
        })
        .catch(error => {
          displayNotification(`Information of ${changedPerson.name} has already been removed from server`, error)
          setPersons(persons.filter(p => p.id !== changedPerson.id))
        })
    }else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          displayNotification(`Added ${returnedPerson.name}`)
        })
    }
  }

  const filteredPersons = !searchName
    ? persons  
    : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  const deletePerson = deletedPerson => {
    if (!window.confirm(`Delete ${deletedPerson.name}?`)) return
    personService
      .del(deletedPerson.id)
      .then(personDeleted => {
        if (!personDeleted) return
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
      .catch(error => {
        displayNotification(`Information of ${deletedPerson.name} has already been removed from server`, error)
        setPersons(persons.filter(p => p.id !== deletedPerson.id))
      })
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
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
      {filteredPersons.map(person => (
        <Person
          key={person.id}
          person={person}
          handleDelete={() => deletePerson(person)}
        />
      ))}
    </div>
  )
}

export default App
