import React, { Component } from 'react';
import { useState, useRef, useEffect} from 'react';
import './App.css';
import NoteList from './NoteList.jsx';
import NoteItem from './NoteItem.jsx';

function App() {
   // //manage array of inputs
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 
  const myRef = useRef(null);

  useEffect(() => {
    async function getUser() {
      try {
        const URL = "https://jsonplaceholder.typicode.com/users/1";
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        const userName = json.name;
        const userUserName = json.username;
        setUserData({
          name: userName,
          username: userUserName,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
    getUser();
  }, []);

  const doInputChange = () => {
    setInputValue(myRef.current.value);
  };

  useEffect(() => {
    const itemsJSON = JSON.stringify(items);
    localStorage.setItem('myItems', itemsJSON);
    
  }, [items])

  const doSubmit = (event) => {
    event.preventDefault();  //disable natural feature of the form
    
    //generate an id based on array length
    const newItem = {
      inputValue: myRef.current.value,
      id: items.length + 1
    };

    if(newItem.inputValue !== '') {
      //add new item to the array of items
      setItems((prevItems) => [...prevItems, newItem]);
      setInputValue(''); //clear input field after submission
      myRef.current.value = '';
    }
  }

   //check if the items array is emty. If yes, show "no notes yet"
    const content = localStorage.getItem('myItems') === '[]' ? (
      <p>No notes yet</p>
    ) : (
      <NoteList>
        {items.map(item => (
          <NoteItem key={item.id} note={item.inputValue} />
        ))}
      </NoteList>
    );

  return (
    <div>
      <h2>User data</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {userData && !isLoading && !error && (
        <div>
          <p>Name: {userData?.name}</p>
          <p>Username: {userData?.username}</p>
        </div>
      )}
      <form onSubmit={doSubmit}>
        <input
          ref={myRef}
          type="text"
          onChange={doInputChange}
          placeholder="Enter your name"
         />
         <button id="submitButton" type="submit">Ok</button>
      </form>
      <h2>Your notes:</h2>
      <NoteList >
        {content}
      </NoteList>
    </div>
  )
}

export default App
