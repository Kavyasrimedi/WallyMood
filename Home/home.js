document.addEventListener("DOMContentLoaded", () => {
  let popupShown = false;

  // 🔹 Mood Popup on Scroll
  window.addEventListener("scroll", () => {
    if (!popupShown) {
      showMoodPopup();
      popupShown = true;
    }
  });

  // 🔹 Hide all cart confirmation messages initially
  document.querySelectorAll(".added-to-cart-message").forEach(msg => {
    msg.style.display = "none";
  });

  // 🔹 Add to Cart Button Handling
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-container");
      const name = productCard.querySelector(".product-name")?.innerText.trim();
      const price = productCard.querySelector(".product-price")?.innerText.trim();
      const image = productCard.querySelector(".product-image")?.src;

      trackHighIntentProduct(name, image, price);

      const product = { name, price, image };

      // Save to localStorage.cart
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.find(item => item.name === product.name);
      if (!exists) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Show confirmation message
      const messageBox = productCard.querySelector(".added-to-cart-message");
      if (messageBox) {
        document.querySelectorAll(".added-to-cart-message").forEach(msg => msg.style.display = "none");
        messageBox.style.display = "flex";
        setTimeout(() => {
          messageBox.style.display = "none";
        }, 1500);
      }
      trackUserIndecision(); 
    });
  });

  // 🔹 Wishlist Heart Toggle
  const hearts = document.querySelectorAll(".wishlist-heart");
  hearts.forEach(heart => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");

      if (heart.classList.contains("fa-regular")) {
        heart.classList.remove("fa-regular");
        heart.classList.add("fa-solid");
      } else {
        heart.classList.remove("fa-solid");
        heart.classList.add("fa-regular");
      }

      const productCard = heart.closest(".product-container");
      const name = productCard.querySelector(".product-name")?.innerText.trim();
      const price = productCard.querySelector(".product-price")?.innerText.trim();
      const image = productCard.querySelector(".product-image")?.src;

      trackHighIntentProduct(name, image, price);

      const product = { name, price, image };

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = wishlist.find(item => item.name === product.name);

      if (!exists) {
        wishlist.push(product);
      } else {
        wishlist = wishlist.filter(item => item.name !== product.name);
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      trackUserIndecision(); 
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let lastScrollTop = 0;
  let lastTime = Date.now();
  let popupShown = false;

  window.addEventListener("scroll", () => {
    const currentTime = Date.now();
    const scrollTop = window.scrollY;
    const scrollSpeed = Math.abs(scrollTop - lastScrollTop) / (currentTime - lastTime);

    // If user scrolls fast and popup not shown yet
    if (scrollSpeed > 0.5 && !popupShown) {
      showFlashDealPopup();
      popupShown = true;

      setTimeout(() => {
        popupShown = false;
      }, 15000); // allow showing again after 15s
    }

    lastScrollTop = scrollTop;
    lastTime = currentTime;
  });

  function showFlashDealPopup() {
    const popup = document.createElement("div");
    popup.className = "flash-deal-popup";
    popup.innerHTML = `<i class="fa-solid fa-bolt"></i> Flash Deal Unlocked! You're scrolling fast! 🎉`;


    document.body.appendChild(popup);
    popup.style.display = "block";

    setTimeout(() => {
      popup.remove();
    }, 4000);
  }
});

let comebackShown = false;

// Record the time when the user leaves the page or switches tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    localStorage.setItem("lastSeen", Date.now());
  }

  if (document.visibilityState === "visible" && !comebackShown) {
    const lastSeen = localStorage.getItem("lastSeen");
    const now = Date.now();

    // If user was away for more than 5 seconds, show comeback popup
    if (lastSeen && now - lastSeen > 5000) {
      showComebackPopup();
      comebackShown = true;
    }
  }
});

function showComebackPopup() {
  const popup = document.createElement("div");
  popup.className = "comeback-popup";
  popup.innerHTML = `<i class="fa-solid fa-gift"></i> Welcome back! Here’s 10% off just for you 🎁`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

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

document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-container");

  productCards.forEach(card => {
    let hoverTimer;

    card.addEventListener("mouseenter", () => {
      hoverTimer = setTimeout(() => {
        const tooltip = card.querySelector(".hover-suggestion");
        if (tooltip) tooltip.style.display = "block";
      }, 4000); // wait 4 seconds before showing
    });

    card.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      const tooltip = card.querySelector(".hover-suggestion");
      if (tooltip) tooltip.style.display = "none";
    });

    const addToCartBtn = card.querySelector(".add-to-cart-button");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const tooltip = card.querySelector(".hover-suggestion");
        if (tooltip) tooltip.style.display = "none";
        clearTimeout(hoverTimer);
      });
    }
  });
});


let actionCount = 0;
let actionTimer = null;

function trackUserIndecision() {
  actionCount++;

  if (!actionTimer) {
    actionTimer = setTimeout(() => {
      if (actionCount >= 3) {
        showIndecisionPopup();
      }
      actionCount = 0;
      actionTimer = null;
    }, 10000); // reset after 10 seconds
  }
}

function showIndecisionPopup() {
  const suggestionBox = document.createElement("div");
  suggestionBox.className = "indecision-popup";
  suggestionBox.innerHTML = `
    🤔 Not sure what to pick?<br>
    <strong>Here's what people love the most!</strong><br>
    <button class="see-trending-btn">See Trending</button>
  `;

  document.body.appendChild(suggestionBox);

  suggestionBox.querySelector(".see-trending-btn").addEventListener("click", () => {
    window.location.href = "../Home/home.html#trending";
  });

  setTimeout(() => {
    suggestionBox.remove();
  }, 6000);
}

function trackHighIntentProduct(productName, productImage, productPrice) {
  let productViews = JSON.parse(localStorage.getItem("highIntentViews")) || {};

  productViews[productName] = (productViews[productName] || 0) + 1;

  localStorage.setItem("highIntentViews", JSON.stringify(productViews));

  if (productViews[productName] % 3 ===0 ) {
    showHighIntentOfferPopup(productName, productImage, productPrice);
  }
}

function showHighIntentOfferPopup(name, image, price) {
  const popup = document.createElement("div");
  popup.className = "high-intent-offer";
  popup.innerHTML = `
    <h3>🔥 Special Offer Just for You!</h3>
    <img src="${image}" alt="${name}" />
    <p><strong>${name}</strong></p>
    <p>Original: ${price} <br><span style="color: green;">Now: ${(parseFloat(price.replace("$", "")) * 0.85).toFixed(2)} 💸 (15% OFF)</span></p>
    <button class="accept-offer-btn">Claim Offer</button>
  `;

  document.body.appendChild(popup);

  document.querySelector(".accept-offer-btn").addEventListener("click", () => {
    alert("Offer applied! Added to cart with discount.");
    popup.remove();
  });

  setTimeout(() => {
    popup.remove();
  }, 6000);
}
