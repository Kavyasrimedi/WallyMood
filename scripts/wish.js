document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    const emptyWishlist = document.getElementById("empty-wishlist");
  
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (wishlist.length === 0) {
      emptyWishlist.style.display = "block";
      return;
    }
  
    emptyWishlist.style.display = "none";
  
    function saveWishlistAndReload() {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      location.reload(); // Refresh to reflect changes
    }
  
    wishlist.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("wishlist-item");
  
      itemDiv.innerHTML = `
        <img class="wishlist-img" src="${item.image}" alt="${item.name}">
        <div class="wishlist-details">
          <h3>${item.name}</h3>
          <p>${item.price}</p>
          <div class="wishlist-actions">
            <button class="move-to-cart-btn">Move to Cart</button>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      `;
  
      // Append to wishlist container
      wishlistContainer.appendChild(itemDiv);
  
      // Remove button functionality
      itemDiv.querySelector(".remove-btn").addEventListener("click", () => {
        wishlist.splice(index, 1);
        saveWishlistAndReload();
      });
  
      // Move to cart functionality
      itemDiv.querySelector(".move-to-cart-btn").addEventListener("click", () => {
        // Avoid duplicates in cart
        const existsInCart = cart.find(c => c.name === item.name);
        if (!existsInCart) {
          cart.push(item);
          localStorage.setItem("cart", JSON.stringify(cart));
        }
  
        // Remove from wishlist
        wishlist.splice(index, 1);
        saveWishlistAndReload();
      });
    });
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
  