import React from 'react';
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
  const [user] = userAuthState(auth);

  return (
    // if user -> show ChatRoom, else -> show SignIn
    <div className="App">
      <header className="App-header">
        
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
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}

// Component that checks if there is a current user and returns Sign out button
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
