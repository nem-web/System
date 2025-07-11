// Firebase config
const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let isSignup = false;

function toggleMode() {
  isSignup = !isSignup;
  document.getElementById("form-title").textContent = isSignup ? "Sign Up" : "Sign In";
  document.querySelector("button").textContent = isSignup ? "Sign Up" : "Sign In";
  document.getElementById("name").style.display = isSignup ? "block" : "none";
  document.getElementById("toggle-text").textContent = isSignup
    ? "Already have an account?"
    : "Don't have an account?";
  document.querySelector(".switch a").textContent = isSignup ? "Sign In" : "Sign Up";
}

function submitForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password || (isSignup && !name)) {
    alert("Please fill all fields.");
    return;
  }

  // Force persistent login across sessions
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      if (isSignup) {
        return auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const uid = userCredential.user.uid;
            return db.collection("users").doc(uid).set({
              name,
              email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          })
          .then(() => {
            storeSession(auth.currentUser);
            alert("Signup successful!");
            window.location.href = "dashboard.html";
          });
      } else {
        return auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            storeSession(auth.currentUser);
            alert("Login successful!");
            window.location.href = "dashboard.html";
          });
      }
    })
    .catch((error) => {
      alert((isSignup ? "Signup" : "Login") + " failed: " + error.message);
    });
}

function storeSession(user) {
  const now = Date.now();
  localStorage.setItem("loginTime", now);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("loginState", "loggedin");
}

