const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const container = document.getElementById("card-container");
let currentUser = null;

auth.onAuthStateChanged(user => {
  currentUser = user;
  loadCards();
});

function loadCards() {
  db.collection("cards").get().then(snapshot => {
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image-container">
          <img class="first" src="${data.image1}" alt="${data.name}" />
          <img class="second" src="${data.image2}" alt="${data.name}" />
        </div>
        <div class="card-content">
          <h3>${data.name}</h3>
        </div>
      `;

      const button = document.createElement("button");

      if (!currentUser) {
        button.textContent = "Login to Purchase";
        button.onclick = () => window.location.href = "auth.html";
      } else {
        button.textContent = `Get Link ($${data.price})`;
        button.onclick = () => startPayment(data, doc.id);
      }

      card.querySelector(".card-content").appendChild(button);
      container.appendChild(card);
    });
  });
}

function startPayment(data, cardId) {
  const options = {
    key: window.env.RAZORPAY_KEY,
    amount: data.price * 100,
    currency: "INR",
    name: "Only System",
    description: data.name,
    image: data.image1,
    handler: function (response) {
      alert("✅ Payment Successful!");
      // Save purchase
      db.collection("users")
        .doc(currentUser.uid)
        .collection("purchases")
        .doc(cardId)
        .set({
          cardId: cardId,
          purchasedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => window.open(data.fileUrl, "_blank"));
    },
    prefill: {
      email: currentUser.email
    },
    theme: { color: "#ff4081" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
