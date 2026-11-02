"use strict";

/*
  Shared JavaScript file for:

  home.html
  about.html
  services.html
  enquiry.html
  contact.html
*/

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupActiveNavigation();
  setupBackToTop();
  setupCart();
  setupCatalogue();
  setupDialogs();
  setupGallery();
  setupForms();
  updateYear();
});

/* =========================================================
   Navigation
========================================================= */

// Opens and closes the mobile menu, and closes it on link click, Escape or when the screen gets wide.
function setupNavigation() {
  const menu = document.querySelector("#mobile-nav");
  const menuButton = document.querySelector("#menu-button");

  if (!menu || !menuButton) {
    return;
  }

  // Hides the mobile menu and resets the button's accessibility labels.
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

  menuButton.addEventListener("click", () => {
    const opening = menu.hidden;

    menu.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation"
    );
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
}

// Highlights the nav link for the page the visitor is currently on (aria-current).
function setupActiveNavigation() {
  const currentFile =
    window.location.pathname.split("/").pop() || "home.html";

  const currentPage =
    currentFile === "index.html" || currentFile === ""
      ? "home.html"
      : currentFile;

  document.querySelectorAll("a.nav-link").forEach((link) => {
    const linkFile =
      new URL(link.href, window.location.href).pathname.split("/").pop() ||
      "home.html";

    if (linkFile === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* =========================================================
   Back to top
========================================================= */

// Shows a 'back to top' button after scrolling down and scrolls smoothly up when clicked.
function setupBackToTop() {
  const topButton = document.querySelector("#top-button");

  if (!topButton) {
    return;
  }

  // Only show the button once the visitor has scrolled past 420px.
  function updateButton() {
    topButton.hidden = window.scrollY < 420;
  }

  window.addEventListener("scroll", updateButton, {
    passive: true
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  updateButton();
}

/* =========================================================
   Services and products catalogue
========================================================= */

const catalogueItems = [
  {
    id: "computer",
    name: "Computer literacy",
    category: "learning",
    icon: "⌘",
    description:
      "Build confidence with essential digital skills, from everyday computer use to getting online."
  },
  {
    id: "adult",
    name: "Adult education",
    category: "learning",
    icon: "✎",
    description:
      "Learning opportunities that support adults as they develop knowledge and practical skills."
  },
  {
    id: "sports",
    name: "Youth sports and recreation",
    category: "youth",
    icon: "⚽",
    description:
      "Healthy play, teamwork and recreational activities for young people."
  },
  {
    id: "arts",
    name: "Arts and culture",
    category: "youth",
    icon: "✳",
    description:
      "Creative activities that help community members express themselves and connect."
  },
  {
    id: "leadership",
    name: "Leadership development",
    category: "youth",
    icon: "✦",
    description:
      "Opportunities to grow confidence, collaboration and leadership skills."
  },
  {
    id: "family",
    name: "Family counselling",
    category: "support",
    icon: "♡",
    description:
      "A supportive pathway for families seeking guidance and connection."
  },
  {
    id: "jobs",
    name: "Job-placement assistance",
    category: "support",
    icon: "↗",
    description:
      "Practical assistance for people exploring employment opportunities."
  },
  {
    id: "seniors",
    name: "Senior citizen programmes",
    category: "support",
    icon: "☀",
    description:
      "Social and recreational activities that support connection in later life."
  },
  {
    id: "scarf",
    name:
      "Wrapped in love – Donate a scarf (We Distribute It For You)",
    category: "donation",
    icon: "🧣",
    description:
      "Add a R30,00 scarf donation to your cart. The centre distributes the scarf for you.",
    price: "R30,00"
  }
];

// Currently selected category tab, and the cart loaded from browser storage.
let activeCategory = "all";
let cart = getStoredCart();

// Connects the search box, sort menu and category tabs to the services catalogue.
function setupCatalogue() {
  const catalogueGrid = document.querySelector("#catalogue-grid");

  if (!catalogueGrid) {
    return;
  }

  const searchInput = document.querySelector("#catalogue-search");
  const sortSelect = document.querySelector("#catalogue-sort");
  const resultCount = document.querySelector("#result-count");
  const emptyResults = document.querySelector("#empty-results");
  const categoryTabs = document.querySelectorAll(
    "#category-tabs .tab"
  );

  updateCartCount();

  // Filters by category + search text, sorts, then redraws the cards and result count.
  function renderCatalogue() {
    const searchTerm = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let matchingItems = catalogueItems.filter((item) => {
      const categoryMatches =
        activeCategory === "all" ||
        item.category === activeCategory;

      const searchableText = [
        item.name,
        item.description,
        item.category
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatches && searchableText.includes(searchTerm);
    });

    const sortValue = sortSelect
      ? sortSelect.value
      : "featured";

    if (sortValue === "az") {
      matchingItems = [...matchingItems].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortValue === "za") {
      matchingItems = [...matchingItems].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    catalogueGrid.replaceChildren(
      ...matchingItems.map(createCatalogueCard)
    );

    if (resultCount) {
      resultCount.textContent =
        `${matchingItems.length} ` +
        `${matchingItems.length === 1 ? "result" : "results"} found`;
    }

    if (emptyResults) {
      emptyResults.hidden = matchingItems.length !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderCatalogue);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderCatalogue);
  }

  categoryTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category || "all";

      categoryTabs.forEach((currentTab) => {
        currentTab.setAttribute(
          "aria-selected",
          String(currentTab === tab)
        );
      });

      renderCatalogue();
    });

    tab.addEventListener("keydown", (event) => {
      const navigationKeys = [
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End"
      ];

      if (!navigationKeys.includes(event.key)) {
        return;
      }

      event.preventDefault();

      let nextIndex;

      if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = categoryTabs.length - 1;
      } else {
        const direction =
          event.key === "ArrowRight" ? 1 : -1;

        nextIndex =
          // Wrap around so the arrows loop from last tab to first and back.
          (index + direction + categoryTabs.length) %
          categoryTabs.length;
      }

      categoryTabs[nextIndex].focus();
      categoryTabs[nextIndex].click();
    });
  });

  renderCatalogue();
}

// Builds one catalogue card (icon, category, title, description, price, button) as DOM elements.
function createCatalogueCard(item) {
  const article = document.createElement("article");
  article.className =
    "soft-card catalogue-card flex flex-col overflow-hidden";

  const visual = document.createElement("div");
  visual.className = "catalogue-card-visual";
  visual.setAttribute("aria-hidden", "true");
  visual.textContent = item.icon;

  const content = document.createElement("div");
  content.className = "catalogue-card-content";

  const category = document.createElement("p");
  category.className = "catalogue-category";
  category.textContent = getCategoryLabel(item.category);

  const heading = document.createElement("h3");
  heading.textContent = item.name;

  const description = document.createElement("p");
  description.textContent = item.description;

  content.append(category, heading, description);

  if (item.price) {
    const price = document.createElement("p");
    price.className = "catalogue-price";
    price.textContent = item.price;
    content.append(price);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "action action-primary";
  button.textContent = item.price
    ? "Add to Cart"
    : "View programme details";

  button.addEventListener("click", () => {
    if (item.price) {
      addToCart(item);
    } else {
      showProgrammeDetails(item, button);
    }
  });

  content.append(button);
  article.append(visual, content);

  return article;
}

// Turns an internal category key into a friendly label for display.
function getCategoryLabel(category) {
  const labels = {
    learning: "Learning",
    youth: "Youth & culture",
    support: "Community support",
    donation: "Donate"
  };

  return labels[category] || category;
}

// Loads the saved cart from localStorage, keeping only known priced items with valid quantities.
function getStoredCart() {
  try {
    const storedCart = localStorage.getItem("dreamCentreCart");
    if (storedCart !== null) {
      const parsed = JSON.parse(storedCart);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
      return Object.fromEntries(catalogueItems
        .filter((item) => item.price && Number.isSafeInteger(parsed[item.id]) && parsed[item.id] > 0)
        .map((item) => [item.id, parsed[item.id]]));
    }
    // The previous cart only supported scarf donations and stored a count.
    const previousCount = Number(localStorage.getItem("dreamCentreCartCount"));
    return Number.isSafeInteger(previousCount) && previousCount > 0
      ? { scarf: previousCount }
      : {};
  } catch {
    return {};
  }
}

// Adds up the quantities of every item in the cart.
function getCartCount() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

// Updates every cart badge on the page with the current item count.
function updateCartCount() {
  const cartCountElement = document.querySelector("#cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = String(getCartCount());
  }
}

// Adds one of an item to the cart, saves it and shows a confirmation message.
function addToCart(item) {
  cart[item.id] = (cart[item.id] || 0) + 1;
  try {
    localStorage.setItem("dreamCentreCart", JSON.stringify(cart));
    localStorage.setItem("dreamCentreCartCount", String(getCartCount()));
  } catch {
    // Keep the cart usable for this visit when browser storage is unavailable.
  }

  updateCartCount();
  const cartCount = getCartCount();

  const feedback = document.querySelector("#cart-feedback");

  if (feedback) {
    feedback.textContent =
      `${item.name} added to cart. ` +
      `${cartCount} ${cartCount === 1 ? "item" : "items"} in cart. ` +
      "No payment has been taken.";
  }
}

// Removes one of an item; deletes it from the cart when the quantity reaches zero.
function removeFromCart(itemId) {
  if (!cart[itemId]) return;
  cart[itemId] -= 1;
  if (cart[itemId] <= 0) {
    delete cart[itemId];
  }
  try {
    localStorage.setItem("dreamCentreCart", JSON.stringify(cart));
    localStorage.setItem("dreamCentreCartCount", String(getCartCount()));
  } catch {
    // Keep the cart usable for this visit when browser storage is unavailable.
  }
  updateCartCount();
}

// Empties the whole cart and saves the empty cart.
function clearCart() {
  cart = {};
  try {
    localStorage.setItem("dreamCentreCart", JSON.stringify(cart));
    localStorage.setItem("dreamCentreCartCount", "0");
  } catch {
    // Keep the cart usable for this visit when browser storage is unavailable.
  }
  updateCartCount();
}

// Turns the cart badge into a button and creates the cart popup (dialog).
function setupCart() {
  const display = document.querySelector(".cart-display");
  if (!display) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "cart-display";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "cart-dialog");
  button.append(...display.childNodes);
  display.replaceWith(button);

  const dialog = document.createElement("div");
  dialog.id = "cart-dialog";
  dialog.className = "dialog-backdrop";
  dialog.hidden = true;
  dialog.innerHTML = `
    <div class="dialog-box cart-dialog-box" role="dialog" aria-modal="true" aria-labelledby="cart-heading" tabindex="-1">
      <div class="dialog-header">
        <h2 id="cart-heading">Your cart</h2>
        <button type="button" class="dialog-close" aria-label="Close cart">×</button>
      </div>
      <p id="cart-summary"></p>
      <ul id="cart-items" class="cart-items"></ul>
      <p id="cart-empty">Your cart is empty.</p>
      <!-- Place-order form: shown only when the cart has items -->
      <form id="cart-order-form" class="cart-order-form" novalidate hidden>
        <h3>Place your order</h3>
        <label for="order-name">Full name</label>
        <input id="order-name" name="name" type="text" autocomplete="name" required>
        <label for="order-email">Email</label>
        <input id="order-email" name="email" type="email" autocomplete="email" required>
        <label for="order-phone">Phone</label>
        <input id="order-phone" name="phone" type="tel" autocomplete="tel" required>
        <p id="order-status" class="order-status" role="status" aria-live="polite"></p>
        <button type="submit" id="cart-place-order" class="cart-place-order">Place order</button>
      </form>
      <button type="button" id="cart-clear" class="cart-clear" hidden>Cancel whole order</button>
    </div>`;
  document.body.append(dialog);

  // Redraws the list of items inside the cart popup.
  function renderCartDialog() {
    const count = getCartCount();
    dialog.querySelector("#cart-summary").textContent =
      `${count} ${count === 1 ? "item" : "items"} in your cart`;
    dialog.querySelector("#cart-empty").hidden = count !== 0;
    dialog.querySelector("#cart-clear").hidden = count === 0;
    dialog.querySelector("#cart-order-form").hidden = count === 0;
    const rows = catalogueItems.filter((item) => cart[item.id]).map((item) => {
      const row = document.createElement("li");
      row.className = "cart-item";
      const icon = document.createElement("span");
      icon.className = "cart-item-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;
      const details = document.createElement("div");
      const name = document.createElement("h3");
      name.textContent = item.name;
      const quantity = document.createElement("p");
      quantity.textContent = `Quantity: ${cart[item.id]}`;
      details.append(name, quantity);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove one ${item.name} from cart`);
      remove.addEventListener("click", () => {
        removeFromCart(item.id);
        renderCartDialog();
      });
      row.append(icon, details, remove);
      return row;
    });
    dialog.querySelector("#cart-items").replaceChildren(...rows);
  }

  button.addEventListener("click", () => {
    renderCartDialog();
    openDialog(dialog, button);
  });

  // Place order: checks the details, saves the order, then empties the cart.
  const orderForm = dialog.querySelector("#cart-order-form");
  const orderStatus = dialog.querySelector("#order-status");
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = orderForm.name.value.trim();
    const email = orderForm.email.value.trim();
    const phone = orderForm.phone.value.trim();
    // Same simple email / phone checks used by the other forms.
    if (name.length < 2) { orderStatus.textContent = "Please enter your full name."; orderForm.name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { orderStatus.textContent = "Please enter a valid email address."; orderForm.email.focus(); return; }
    if (!/^[+\d][\d\s()-]{8,}$/.test(phone)) { orderStatus.textContent = "Please enter a valid phone number."; orderForm.phone.focus(); return; }

    const submit = orderForm.querySelector("#cart-place-order");
    if (submit.disabled) return; // stop double orders
    submit.disabled = true;
    orderStatus.textContent = "Placing your order…";

    const orderNumber = "JDC-" + Date.now().toString(36).toUpperCase();
    const items = catalogueItems.filter((item) => cart[item.id])
      .map((item) => `${item.name} x${cart[item.id]}`).join(", ");
    const record = {
      formType: "order", orderNumber, name, email, phone, items,
      itemCount: getCartCount(), submittedAt: new Date().toISOString()
    };

    let saved = false;
    try { saved = await saveToCanvaSheet(record); } catch (error) { console.error(error); }
    if (!saved) { try { saveLocally(record); } catch (error) { console.error(error); } }

    clearCart();
    orderForm.reset();
    submit.disabled = false;
    renderCartDialog();
    dialog.querySelector("#cart-summary").textContent =
      `Thank you, ${name}! Your order ${orderNumber} has been placed. We'll contact you at ${email} to confirm. No payment has been taken.`;
    orderStatus.textContent = "";
  });

  dialog.querySelector("#cart-clear").addEventListener("click", () => {
    clearCart();
    renderCartDialog();
  });
  updateCartCount();
}

/* =========================================================
   Dialogs
========================================================= */

let lastFocusedElement = null;

// Adds closing behaviour to every popup: close button, clicking outside, and Escape key.
function setupDialogs() {
  const dialogs = document.querySelectorAll(".dialog-backdrop");

  dialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector(".dialog-close");

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closeDialog(dialog);
      });
    }

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDialog(dialog);
      }

      if (event.key === "Tab") {
        trapFocus(event, dialog);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document
        .querySelectorAll(".dialog-backdrop:not([hidden])")
        .forEach((dialog) => closeDialog(dialog));
    }
  });
}

// Shows a popup, stops the page behind it scrolling and moves focus into it.
function openDialog(dialog, originElement) {
  if (!dialog) {
    return;
  }

  lastFocusedElement = originElement || document.activeElement;

  dialog.hidden = false;
  document.body.style.overflow = "hidden";

  const closeButton = dialog.querySelector(".dialog-close");

  if (closeButton) {
    closeButton.focus();
  } else {
    dialog.focus();
  }
}

// Hides a popup and returns focus to the element that opened it.
function closeDialog(dialog) {
  if (!dialog || dialog.hidden) {
    return;
  }

  dialog.hidden = true;
  document.body.style.overflow = "";

  if (
    lastFocusedElement &&
    document.body.contains(lastFocusedElement)
  ) {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
}

// Keeps Tab / Shift+Tab cycling inside the open popup so keyboard users don't get lost.
function trapFocus(event, dialog) {
  const focusableElements = [
    ...dialog.querySelectorAll(
      "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
  ].filter((element) => !element.hidden);

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement =
    focusableElements[focusableElements.length - 1];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}

// Fills the details popup with a programme's info and opens it.
function showProgrammeDetails(item, originButton) {
  const dialog = document.querySelector("#detail-dialog");
  const heading = document.querySelector("#detail-heading");
  const description = document.querySelector(
    "#detail-description"
  );

  if (!dialog || !heading || !description) {
    return;
  }

  heading.textContent = item.name;

  description.textContent =
    `${item.description} ` +
    "To ask about availability or how to participate, send us an enquiry.";

  openDialog(dialog, originButton);
}

/* =========================================================
   Gallery
========================================================= */

// Opens a larger preview of a gallery image (with caption) when it is clicked.
function setupGallery() {
  const galleryDialog = document.querySelector("#gallery-dialog");
  const previewImage = document.querySelector("#preview-image");
  const previewCaption = document.querySelector(
    "#preview-caption"
  );

  if (!galleryDialog || !previewImage || !previewCaption) {
    return;
  }

  document.querySelectorAll(".gallery-button").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const caption = button.querySelector("span");

      if (!image) {
        return;
      }

      previewImage.src = image.currentSrc || image.src;
      previewImage.alt = image.alt || "";

      previewCaption.textContent = caption
        ? caption.textContent.trim()
        : "";

      openDialog(galleryDialog, button);
    });
  });
}

/* =========================================================
   Forms and validation
========================================================= */

// Basic email shape check: text@text.text (does not prove the address exists).
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Optional +, then 7-19 digits, spaces, brackets or hyphens.
const phonePattern = /^\+?[0-9][0-9 ()-]{6,18}$/;

// Sets up the enquiry/contact forms and live validation when fields lose focus or change.
function setupForms() {
  const enquiryForm = document.querySelector("#enquiry-form");
  const contactForm = document.querySelector("#contact-form");

  if (enquiryForm) {
    setupForm(enquiryForm, "enquiry");
  }

  if (contactForm) {
    setupForm(contactForm, "contact");
  }

  document
    .querySelectorAll(
      "form input:not([type='checkbox']), form select, form textarea"
    )
    .forEach((control) => {
      control.addEventListener("blur", () => {
        validateField(control);
      });

      control.addEventListener("input", () => {
        if (control.getAttribute("aria-invalid") === "true") {
          validateField(control);
        }
      });

      control.addEventListener("change", () => {
        if (control.getAttribute("aria-invalid") === "true") {
          validateField(control);
        }
      });
    });
}

// Handles submitting one form: validate, block double submits, save, and show status.
function setupForm(form, formType) {
  // Prevents the form being sent twice while a save is in progress.
  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const controls = [
      ...form.querySelectorAll(
        "input:not([type='checkbox']), select, textarea"
      )
    ];

    const isValid = controls
      .map(validateField)
      .every(Boolean);

    const status = form.querySelector(".form-status");

    if (!isValid) {
      setStatus(
        status,
        "Please correct the highlighted fields.",
        "error"
      );

      const firstInvalid = controls.find(
        (control) =>
          control.getAttribute("aria-invalid") === "true"
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    const submitButton = form.querySelector(
      "button[type='submit']"
    );

    submitting = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    setStatus(
      status,
      formType === "contact" ? "Sending your message…" : "Saving your submission…",
      "neutral"
    );

    try {
      const record = createFormRecord(form, formType);
      if (formType === "contact") {
        // Send directly to the owner's chosen service on any host, including exports.
        const response = await fetch("https://formspree.io/f/xeaaoqnb", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _replyto: record.email,
            _subject: `Website contact: ${record.subject}`,
            full_name: record.full_name,
            email: record.email,
            phone: record.phone,
            subject: record.subject,
            message: record.message
          })
        });
        if (!response.ok) {
          setStatus(status, "Your message could not be sent. Please try again.", "error");
          return;
        }
        setStatus(
          status,
          "Thank you. Your message has been submitted.",
          "success"
        );
      } else {
        const savedToCanvaSheet = await saveToCanvaSheet(record);

      if (savedToCanvaSheet) {
        setStatus(
          status,
          "Saved to the Canva Sheet. This confirms the submission, not email delivery.",
          "success"
        );
      } else {
        saveLocally(record);

        setStatus(
          status,
          "Saved in this browser. Connect the Canva Sheet SDK or a backend for production storage.",
          "success"
        );
      }
      }

      form.reset();

      controls.forEach((control) => {
        control.removeAttribute("aria-invalid");

        const errorElement = document.querySelector(
          `#${control.id}-error`
        );

        if (errorElement) {
          errorElement.textContent = "";
        }
      });
    } catch (error) {
      setStatus(
        status,
        formType === "contact" ? "Your message could not be sent. Check your internet connection and try again." : "The submission could not be saved. Please try again.",
        "error"
      );
    } finally {
      submitting = false;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
}

// Collects the form's values into one object ready to be saved.
function createFormRecord(form, formType) {
  const getValue = (name) => {
    const element = form.elements.namedItem(name);

    if (!element || !("value" in element)) {
      return "";
    }

    return element.value.trim();
  };

  const newsletter = form.elements.namedItem("newsletter");

  return {
    form_type: formType,
    full_name: getValue("full_name"),
    email: getValue("email"),
    phone: getValue("phone"),
    enquiry_type:
      formType === "enquiry"
        ? getValue("enquiry_type")
        : "",
    subject:
      formType === "contact"
        ? getValue("subject")
        : "",
    message: getValue("message"),
    newsletter:
      formType === "enquiry" &&
      newsletter &&
      newsletter.checked === true,
    submitted_at: new Date().toISOString()
  };
}

// Checks one field, shows/clears its error message and returns true if it is valid.
function validateField(control) {
  const message = getValidationMessage(control);
  const errorElement = document.querySelector(
    `#${control.id}-error`
  );

  if (errorElement) {
    errorElement.textContent = message;
  }

  control.setAttribute(
    "aria-invalid",
    String(Boolean(message))
  );

  return message === "";
}

// Returns the error text for a field, or an empty string if it is valid.
function getValidationMessage(control) {
  const value = control.value.trim();

  if (control.required && !value) {
    return "This field is required.";
  }

  if (!value) {
    return "";
  }

  if (
    control.type === "email" &&
    !emailPattern.test(value)
  ) {
    return "Enter a valid email address.";
  }

  if (
    control.type === "tel" &&
    !phonePattern.test(value)
  ) {
    return "Enter a valid phone number.";
  }

  if (
    control.name === "message" &&
    value.length < 10
  ) {
    return "Please write at least 10 characters.";
  }

  if (
    control.maxLength > 0 &&
    value.length > control.maxLength
  ) {
    return `Use no more than ${control.maxLength} characters.`;
  }

  return "";
}

// Shows a status message under the form (success, error or neutral).
function setStatus(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message;

  if (type === "error") {
    element.style.color = "#a43121";
  } else if (type === "success") {
    element.style.color = "#087e83";
  } else {
    element.style.color = "#4b6273";
  }
}

/* =========================================================
   Canva Sheet support
========================================================= */

let dataSdkReady = false;
let dataSdkPromise = null;

// Tries to save the form record using the online data SDK.
async function saveToCanvaSheet(record) {
  if (!window.dataSdk) {
    return false;
  }

  const ready = await ensureDataSdk();

  if (!ready) {
    return false;
  }

  const result = await window.dataSdk.create(record);

  return Boolean(result && result.isOk);
}

// Loads the data SDK script once, if it isn't already on the page.
async function ensureDataSdk() {
  if (dataSdkReady && window.dataSdk) {
    return true;
  }

  if (!window.dataSdk) {
    return false;
  }

  if (!dataSdkPromise) {
    dataSdkPromise = (async () => {
      try {
        const result = await window.dataSdk.init({
          onDataChanged() {
            // Form submissions are saved but not displayed on the page.
          }
        });

        dataSdkReady = Boolean(result && result.isOk);
        return dataSdkReady;
      } catch (error) {
        console.error(error);
        dataSdkReady = false;
        return false;
      }
    })();
  }

  const ready = await dataSdkPromise;

  if (!ready) {
    dataSdkPromise = null;
  }

  return ready;
}

// Backup: saves the form record in the browser's localStorage.
function saveLocally(record) {
  const storageKey = "dreamCentreFormSubmissions";
  const existingRecords = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
  );

  existingRecords.push(record);

  localStorage.setItem(
    storageKey,
    JSON.stringify(existingRecords)
  );
}

/* =========================================================
   Footer year
========================================================= */

// Puts the current year in the footer so it never goes out of date.
function updateYear() {
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = String(
      new Date().getFullYear()
    );
  }
}


/* =========================================================
   Site search (uses sitemap.xml)
========================================================= */

// Finds the site's root folder from where script.js was loaded,
// so search works from both the home page and the Assets pages.
function getSiteRoot() {
  const script = document.querySelector('script[src*="scripts/script.js"]');
  return script ? script.src.replace(/scripts\/script\.js.*$/, "") : "./";
}

// Built-in copy of every page's text, so search still works when the site
// is opened straight from a folder or the pages can't be loaded.
const SEARCH_FALLBACK = [{"path": "index.html", "title": "Home", "text": "A place to belong. A place to grow. Dream bigger, together. Empowering our community through education, recreation, and support services since 2014. Explore our programmes → Make an enquiry Rooted in community since 2014 What we do Opportunity starts with community. From essential skills and youth recreation to family support and opportunities for older neighbours, our programmes meet people where they are. ✦ Learn & grow Computer literacy, adult education and leadership skills for the next step forward. ◈ Play & create Youth sports, recreation, arts and culture that bring neighbours together. ♡ Find support Family counselling, job-placement assistance and senior citizen programmes. 2014 Established 500+ Families served annually 2,500+ Community members served 20+ Local partner organisations In pictures The spirit of community Illustrative photographs of community support, learning and connection. Select an image for a larger view."}, {"path": "Assets/about.html", "title": "About Us", "text": "Our story About the Dream Centre Established in 2014, The Johannesburg Dream Centre is a community hub serving more than 500 families annually. We bring immediate support and lasting opportunity together under one roof. Our mission To alleviate poverty through immediate support and empowerment, giving people the tools and opportunities to build a stronger future. Our vision A Johannesburg with drastically reduced poverty, where individuals and families can look to the future with hope. The impact we are building 2,500+ Community members served 75% Programme satisfaction rate 20+ Local organisation partnerships Level 1 BEE status Meet our leadership AS Alicia Swanepoel Managing Director and Co-Founder OB Oscar Bashing Director ZN Zakhele Nyandeni Youth Development Director"}, {"path": "Assets/services.html", "title": "Services & Products", "text": "Explore what is possible Services & products Find a programme, discover practical support or add a scarf donation to your cart. Search across all offerings or browse by category. Search programmes and products Sort by"}, {"path": "Assets/enquiry.html", "title": "Enquiry", "text": "Skip to content Start a conversation Enquiry Form Please complete the form below. Loading…"}, {"path": "Assets/contact.html", "title": "Contact", "text": "Get in touch Contact us Visit or reach us 1st Floor Northlands Corner, New Market Road, Hoogland, Gauteng +27 81 402 8576 info@Johannesburgdreamcenter.org Opening hours Monday–Friday 09:00–15:00 Saturday 08:00–14:00 Sunday Closed ⌖ Find our location"}];

let searchIndexPromise = null;

// Reads sitemap.xml, then loads each listed page and keeps its title and text.
// Only runs once; later searches reuse the saved results.
function buildSearchIndex() {
  if (searchIndexPromise) return searchIndexPromise;
  const root = getSiteRoot();

  searchIndexPromise = fetch(root + "sitemap.xml")
    .then((response) => response.text())
    .then((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      // Sitemap links are full web addresses; keep only the page's own path
      // (index.html or Assets/page.html) so the search works wherever the
      // site is hosted — here, on GitHub Pages, or in a folder.
      const paths = [...doc.querySelectorAll("loc")].map((loc) => {
        const url = loc.textContent.trim();
        const match = url.match(/\/site\/(.+)$/);
        if (match) return match[1];
        const parts = new URL(url).pathname.split("/").filter(Boolean);
        const file = parts[parts.length - 1] || "index.html";
        const folder = parts[parts.length - 2];
        return folder === "Assets" ? `Assets/${file}` : file;
      });

      return Promise.all(paths.map((path) =>
        fetch(root + path)
          .then((response) => response.text())
          .then((html) => {
            const page = new DOMParser().parseFromString(html, "text/html");
            page.querySelectorAll("script, style, header, footer, nav, select, button, form, [hidden]").forEach((el) => el.remove());
            const main = page.querySelector("main") || page.body;
            return {
              url: root + path,
              title: (page.title || path).split("|").pop().trim(),
              text: main.textContent.replace(/\s+/g, " ").trim()
            };
          })
          .catch(() => null)
      ));
    })
    .then((pages) => pages.filter(Boolean))
    .catch(() => [])
    // If nothing loaded (e.g. opened from a folder), use the built-in copy.
    .then((pages) => pages.length ? pages : SEARCH_FALLBACK.map((p) => ({
      url: root + p.path, title: p.title, text: p.text
    })));

  return searchIndexPromise;
}

// Returns a short piece of text around the first match, for the results list.
function makeSnippet(text, term) {
  const at = text.toLowerCase().indexOf(term);
  if (at === -1) return text.slice(0, 90) + "...";
  const start = Math.max(0, at - 40);
  return (start > 0 ? "..." : "") + text.slice(start, at + term.length + 50) + "...";
}

// Connects the search symbol: tapping it opens the search box, and the box
// lists the pages that match as the visitor types.
function initSiteSearch() {
  const toggle = document.querySelector(".site-search-toggle");
  const panel = document.querySelector(".site-search-panel");
  if (!toggle || !panel) return;
  const form = panel.querySelector(".site-search-form");
  const input = panel.querySelector(".site-search-input");
  const list = panel.querySelector(".site-search-results");

  // Opens the box, puts the cursor in it and starts loading the pages.
  function openSearch() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
    buildSearchIndex();
  }

  // Hides the box and its results.
  function closeSearch() {
    panel.hidden = true;
    list.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  // The symbol opens and closes the box.
  toggle.addEventListener("click", () => {
    if (panel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });

  async function showResults() {
    const term = input.value.trim().toLowerCase();
    list.innerHTML = "";
    if (term.length < 2) { list.hidden = true; return; }

    const pages = await buildSearchIndex();
    const matches = pages.filter((p) =>
      p.title.toLowerCase().includes(term) || p.text.toLowerCase().includes(term)
    );

    if (matches.length === 0) {
      const li = document.createElement("li");
      li.className = "site-search-empty";
      li.textContent = pages.length ? "No pages found" : "Search is unavailable";
      list.appendChild(li);
    }

    matches.forEach((p) => {
      // Built with textContent (not innerHTML) so page text can't inject code.
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = p.url;
      const strong = document.createElement("strong");
      strong.textContent = p.title;
      const small = document.createElement("span");
      small.textContent = makeSnippet(p.text, term);
      a.append(strong, small);
      li.appendChild(a);
      list.appendChild(li);
    });
    list.hidden = false;
  }

  input.addEventListener("input", showResults);

  // Pressing Enter opens the first result.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = list.querySelector("a");
    if (first) window.location.href = first.href;
  });

  // Escape closes the box and puts the cursor back on the symbol.
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
      toggle.focus();
    }
  });

  // Clicking anywhere outside the box closes it.
  document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) closeSearch();
  });
}

document.addEventListener("DOMContentLoaded", initSiteSearch);

// Sparkle effect: tiny stars appear where the user taps/clicks and while scrolling
(function setupSparkles() {
  // Respect users who prefer less motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const symbols = ["✦", "✧", "★", "·"];
  // Create one small star at x,y that drifts and fades out
  function spawn(x, y) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", (Math.random() * 40 - 20) + "px");
    s.style.setProperty("--dy", (Math.random() * -40 - 10) + "px");
    s.style.fontSize = (8 + Math.random() * 7) + "px";
    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
  // Burst of stars on tap/click
  document.addEventListener("pointerdown", (e) => {
    for (let i = 0; i < 6; i++) spawn(e.clientX, e.clientY);
  }, { passive: true });
  // A few stars at random spots while scrolling (throttled)
  let last = 0;
  window.addEventListener("scroll", () => {
    const now = Date.now();
    if (now - last < 120) return;
    last = now;
    spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
  }, { passive: true });
})();
