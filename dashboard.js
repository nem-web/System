const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const container = document.getElementById("purchases");

auth.onAuthStateChanged(async user => {
  if (!user) {
    alert("Please log in to view your dashboard.");
    window.location.href = "auth.html";
    return;
  }

  const purchases = await db.collection("users")
    .doc(user.uid)
    .collection("purchases")
    .get();

  if (purchases.empty) {
    container.innerHTML = "<p>You haven't purchased anything yet.</p>";
    return;
  }

  purchases.forEach(async doc => {
    const cardId = doc.data().cardId;
    const cardDoc = await db.collection("cards").doc(cardId).get();
    const card = cardDoc.data();

    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
      <img src="${card.image1}" alt="${card.name}" />
      <div class="card-content">
        <h3>${card.name}</h3>
        <button onclick="window.open('${card.fileUrl}', '_blank')">View Now</button>
      </div>
    `;
    container.appendChild(cardElement);
  });
});

function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userEmail");
    localStorage.setItem("loginState", "loggedout");
    window.location.href = "auth.html";
  });
}

