import React from "react";

const Persons = ({filteredPersons}) => {
  return (
    <>
      {filteredPersons.map(person => (
        <div key={person.name}>
          {`${person.name} ${person.number}`}
        </div>
      ))}
    </>
  )
}

export default Persons;