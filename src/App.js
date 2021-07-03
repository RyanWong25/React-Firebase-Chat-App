import React, { useRef, useState, useEffect } from 'react';
import './App.css';

// import firebase sdk, authentication, and firestore
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import hooks for ease of use with firebase in React
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCHxzPsfdOPekN3_XIkpIpflwD5AOCfUTQ",
  authDomain: "single-room-chat-app.firebaseapp.com",
  projectId: "single-room-chat-app",
  storageBucket: "single-room-chat-app.appspot.com",
  messagingSenderId: "847548066294",
  appId: "1:847548066294:web:4997b5680988760c8e3fd7",
  measurementId: "G-WHDN9DTK31"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  // signed in -> user is an object
  // signed out -> user is null
  const [user] = useAuthState(auth);

  return (
    // if user -> show ChatRoom, else -> show SignIn
    <div className="App">

      <header>
       <h1>🐟 FishBowl 🐟</h1>
       <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

// Component that listens to click event and runs the function signInWithGoogle
// instantiates provider (GoogleAuthProvider) and popup window on click event
function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Swim in with Google</button>
  )

}

// Component that checks if there is a current user and returns Sign out button
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Swim Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  // reference a firestore collection
  const messagesRef = firestore.collection('messages');
  // query documents in a collection
  const query = messagesRef.orderBy('createdAt').limit(25);

  // listen to data with a useCollectionData hook
  // reacts to changes in realtime
  const [messages] = useCollectionData(query, {idField: 'id'});

  // submit form to firestore to perform a write to the database
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    //prevent page refresh on event/form submit
    e.preventDefault();
    
    const { uid, photoURL } = auth.currentUser; 

    //create new document in firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

  }

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }, [messages])

  // loop over each document
  // use form to collect the user's message
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      
        <div ref={dummy}></div>

      </main>
    
      <form onSubmit={sendMessage}>
        
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Glug Glug..." />

        <button type="submit" disabled={!formValue}>🐟</button>

      </form>
    </>
  )
}

// read chat messages
function ChatMessage(props) {
  
  const { text, uid, photoURL } = props.message;

  // conditional CSS, comparing user ID from firestore document to current user
  // see if message is sent or received
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
