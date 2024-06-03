import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber
    };

    axios
      .post('http://localhost:3001/api/persons', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person =>
        <div key={person.id}>
          {person.name} {person.number}
        </div>
      )}
    </div>
  );
};

export default App;
