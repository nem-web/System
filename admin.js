const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!email || !pass) {
    alert("Please enter both email and password.");
    return;
  }

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("admin-panel").style.display = "block";
      loadCards();
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
}

function addCard() {
  const name = document.getElementById("name").value.trim();
  const image1 = document.getElementById("image1").value.trim();
  const image2 = document.getElementById("image2").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const fileUrl = document.getElementById("fileUrl").value.trim();

  if (!name || !image1 || !image2 || isNaN(price) || !fileUrl) {
    alert("Please fill all fields correctly.");
    return;
  }

  db.collection("cards").add({ name, image1, image2, price, fileUrl }).then(() => {
    alert("Card added!");
    clearFormFields();
    loadCards();
  }).catch(err => {
    alert("Error adding card: " + err.message);
  });
}

function clearFormFields() {
  document.getElementById("name").value = "";
  document.getElementById("image1").value = "";
  document.getElementById("image2").value = "";
  document.getElementById("price").value = "";
  document.getElementById("fileUrl").value = "";
}

function loadCards() {
  const container = document.getElementById("admin-cards");
  container.innerHTML = "<p>Loading...</p>";

  db.collection("cards").get().then((snapshot) => {
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${data.image1}" alt="${data.name}" />
        <div class="card-content">
          <h3>${data.name}</h3>
          <p>$${data.price}</p>
          <button onclick="deleteCard('${doc.id}')">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });
  }).catch(err => {
    container.innerHTML = "<p>Error loading cards.</p>";
    console.error(err);
  });
}

function deleteCard(id) {
  if (!confirm("Delete this card?")) return;
  db.collection("cards").doc(id).delete().then(loadCards);
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("admin-panel").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  });
}
