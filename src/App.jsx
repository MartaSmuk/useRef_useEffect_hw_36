import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import NoteList from './NoteList.jsx';
import NoteItem from './NoteItem.jsx';

function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const myRef = useRef(null);

  // Fetch user data while mounting
  useEffect(() => {
    async function getUser() {
      try {
        const URL = "https://jsonplaceholder.typicode.com/users/1";
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setUserData({
          name: json.name,
          username: json.username,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  // Take items from localStorage while mounting the comp
  useEffect(() => {
    const savedItems = localStorage.getItem('myItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage when its items change
  useEffect(() => {
    localStorage.setItem('myItems', JSON.stringify(items));
  }, [items]);

  const doInputChange = () => {
    setInputValue(myRef.current.value);
  };

  const doSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      inputValue: myRef.current.value,
      id: items.length + 1
    };

    if (newItem.inputValue.trim() !== '') {
      setItems((prevItems) => [...prevItems, newItem]);
      setInputValue('');
      myRef.current.value = '';
    }
  };

  return (
    <div>
      <h2>User data</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {userData && !isLoading && !error && (
        <div>
          <p>Name: {userData.name}</p>
          <p>Username: {userData.username}</p>
        </div>
      )}
      <form onSubmit={doSubmit}>
        <input
          ref={myRef}
          type="text"
          onChange={doInputChange}
          placeholder="Enter your note"
        />
        <button id="submitButton" type="submit">Ok</button>
      </form>
      <h2>Your notes:</h2>
      {items.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <NoteList>
          {items.map((item) => (
            <NoteItem key={item.id} note={item.inputValue} />
          ))}
        </NoteList>
      )}
    </div>
  );
}

export default App;
