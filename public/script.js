// Simulated database
const actressData = [
  {
    name: "Emma Watson",
    image1: "https://example.com/emma1.jpg",
    image2: "https://example.com/emma2.jpg",
    price: 29.99
  },
  {
    name: "Scarlett Johansson",
    image1: "https://example.com/scarlett1.jpg",
    image2: "https://example.com/scarlett2.jpg",
    price: 34.99
  }
];

// Rendering cards
const container = document.getElementById("card-container");

actressData.forEach((actress) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="image-container">
      <img class="first" src="${actress.image1}" alt="${actress.name}" />
      <img class="second" src="${actress.image2}" alt="${actress.name}" />
    </div>
    <div class="card-content">
      <h3>${actress.name}</h3>
      <button>Buy Now ($${actress.price})</button>
    </div>
  `;

  container.appendChild(card);
});
