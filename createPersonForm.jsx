import React, { useState } from 'react';

const CreatePersonForm = ({ personService, addPerson }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inputNameRef = useRef(null);
  const inputNumberRef = useRef(null);

  const createPerson = async () => {
    const name = inputNameRef.current.value;
    const number = inputNumberRef.current.value;

    try {
      // Create new person
      await personService.create({ name, number }); // Replace with your actual service call

      // Success handling
      setName('');
      setNumber('');
      setErrorMessage(''); // Clear error message
      addPerson({ name, number }); // Call function to update displayed persons
      showSuccessMessage('Henkilö lisätty onnistuneesti!');
    } catch (error) {
      // Error handling
      console.error(error);
      setErrorMessage(error.message); // Set error message from backend
    }
  };

  const showSuccessMessage = (message) => {
    // Implement success message display logic (e.g., temporary toast)
  };

  return (
    <div>
      <h2>Lisää uusi henkilö</h2>
      {/* Input fields for name and number */}
      <input
        ref={inputNameRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nimi"
      />
      <input
        ref={inputNumberRef}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Puhelinnumero"
      />
      <button onClick={createPerson}>Lisää henkilö</button>

      {/* Error message display (if any) */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreatePersonForm;
