document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const emptyCart = document.getElementById("empty-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartTotal.textContent = "$0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    // Extract price as number
    const priceValue = parseFloat(item.price.replace("$", ""));
    total += priceValue;

    itemDiv.innerHTML = `
      <img class="cart-item-image" src="${item.image}" />
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${item.price}</p>
        <label for="quantity">Quantity:</label>
        <select class="cart-item-quantity">
          <option selected>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <button class="remove-button">Remove</button>
      </div>
    `;

    // Remove item on button click
    itemDiv.querySelector(".remove-button").addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });

    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
});

document.addEventListener("DOMContentLoaded", () => {
  const now = Date.now();
  const lastVisit = parseInt(localStorage.getItem("lastVisitTime")) || 0;
  const lastPopup = parseInt(localStorage.getItem("lastPopupShownAt")) || 0;

  const timeAway = now - lastVisit;
  const popupCooldown = now - lastPopup;

  // If user was away for more than 5 seconds and popup not shown recently
  if (timeAway > 5000 && popupCooldown > 30000) {
    showComebackPopup();
    localStorage.setItem("lastPopupShownAt", now);
  }

  // Save current visit timestamp for next page
  localStorage.setItem("lastVisitTime", now);
});

function showComebackPopup() {
  const popup = document.createElement("div");
  popup.className = "comeback-popup";
  popup.innerHTML = `<i class="fa-solid fa-gift"></i> You’re back! Enjoy 10% off on your mood pick 🛍️`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

