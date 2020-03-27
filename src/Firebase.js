import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDzMT6KwCmlxd1n3mRtjoMiYg23Dw7RVUU",
  authDomain: "webgammon-xm.firebaseapp.com",
  databaseURL: "https://webgammon-xm.firebaseio.com",
  projectId: "webgammon-xm",
  storageBucket: "webgammon-xm.appspot.com",
  messagingSenderId: "173753375399",
  appId: "1:173753375399:web:e6738a749a6c3b35431982",
  measurementId: "G-DQMSDFCH0Z"
};

const firebaseApp = firebase.initializeApp(config);

const db = firebaseApp.firestore();

export { db };
