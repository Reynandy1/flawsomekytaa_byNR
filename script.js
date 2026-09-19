/* =========================================================
   FLAWSOMEKYTAA_BYNR
   WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Pashmina Latte",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab1.jpeg"
    },

    {
        id: 2,
        name: "Pashmina Sand",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpeg"
    },

    {
        id: 3,
        name: "Square Cream",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab3.jpeg"
    },

    {
        id: 4,
        name: "Square Mocha",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab4.jpeg"
    },

    {
        id: 5,
        name: "Silk Cocoa",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab5.jpeg"
    },

    {
        id: 6,
        name: "Silk Rose",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab6.jpeg"
    }
];


/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "62882002403676";

const CART_STORAGE_KEY =
    "flawsomekytaa_cart";


/* =========================================================
   STATE
========================================================= */

let cart = [];

let toastTimeout;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const navbar =
    document.getElementById("navbar");

const searchToggle =
    document.getElementById("searchToggle");

const searchPanel =
    document.getElementById("searchPanel");

const searchInput =
    document.getElementById("searchInput");

const searchClose =
    document.getElementById("searchClose");

const menuToggle =
    document.getElementById("menuToggle");

const mobileNav =
    document.getElementById("mobileNav");

const cartToggle =
    document.getElementById("cartToggle");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartClose =
    document.getElementById("cartClose");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const noResults =
    document.getElementById("noResults");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const productCards =
    [...document.querySelectorAll(".product-card")];

const filterButtons =
    [...document.querySelectorAll(".filter-btn")];

const quickAddButtons =
    [...document.querySelectorAll(".quick-add")];

const mobileLinks =
    [...document.querySelectorAll(".mobile-nav a")];

const continueShopping =
    document.querySelector(".continue-shopping");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/* =========================================================
   GET PRODUCT
========================================================= */

function getProduct(productId) {

    return products.find(
        product => product.id === Number(productId)
    );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn(
            "Cart tidak dapat disimpan:",
            error
        );

    }

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {
            cart = [];
            return;
        }

        const parsedCart =
            JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            cart = [];
            return;
        }

        cart = parsedCart
            .map(item => {

                const product =
                    getProduct(item.id);

                if (!product) {
                    return null;
                }

                const quantity =
                    Math.max(
                        1,
                        Number(item.quantity) || 1
                    );

                return {
                    id: product.id,
                    quantity
                };

            })
            .filter(Boolean);

    } catch (error) {

        console.warn(
            "Cart sebelumnya tidak dapat dibaca:",
            error
        );

        cart = [];

    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(
            item => item.id === product.id
        );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            quantity: 1
        });

    }

    saveCart();
    renderCart();

    showToast(
        `${product.name} ditambahkan ke bag.`
    );

    openCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {

    const product =
        getProduct(productId);

    cart =
        cart.filter(
            item => item.id !== Number(productId)
        );

    saveCart();
    renderCart();

    if (product) {

        showToast(
            `${product.name} dihapus dari bag.`
        );

    }

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id === Number(productId)
        );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(productId);
        return;

    }

    saveCart();
    renderCart();

}


/* =========================================================
   CART TOTAL
========================================================= */

function calculateTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getProduct(item.id);

            if (!product) {
                return total;
            }

            return total +
                product.price * item.quantity;

        },
        0
    );

}


/* =========================================================
   CART COUNT
========================================================= */

function calculateCartCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    const totalItems =
        calculateCartCount();

    const totalPrice =
        calculateTotal();


    /* CART COUNT */

    cartCount.textContent =
        totalItems > 99
            ? "99+"
            : totalItems;


    /* TOTAL */

    cartTotal.textContent =
        formatPrice(totalPrice);


    /* EMPTY STATE */

    if (cart.length === 0) {

        cartEmpty.classList.add("visible");

        cartItems.style.display = "none";

        checkoutBtn.disabled = true;

        return;

    }


    cartEmpty.classList.remove("visible");

    cartItems.style.display = "block";

    checkoutBtn.disabled = false;


    /* ITEMS */

    cart.forEach(item => {

        const product =
            getProduct(item.id);

        if (!product) {
            return;
        }

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "cart-item";

        itemElement.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="cart-item-info">

                <h4>
                    ${product.name}
                </h4>

                <span>
                    ${formatPrice(product.price)}
                </span>

                <div class="cart-item-controls">

                    <div class="quantity-controls">

                        <button
                            type="button"
                            data-action="decrease"
                            data-product-id="${product.id}"
                            aria-label="Kurangi jumlah ${product.name}"
                        >
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            data-action="increase"
                            data-product-id="${product.id}"
                            aria-label="Tambah jumlah ${product.name}"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-product-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

        cartItems.appendChild(itemElement);

    });

}


/* =========================================================
   CART ITEM EVENTS
========================================================= */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const productId =
            Number(button.dataset.productId);


        if (action === "increase") {

            changeQuantity(
                productId,
                1
            );

        }


        if (action === "decrease") {

            changeQuantity(
                productId,
                -1
            );

        }


        if (action === "remove") {

            removeFromCart(
                productId
            );

        }

    }
);


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    cartSidebar.classList.add("open");

    cartOverlay.classList.add("open");

    cartSidebar.setAttribute(
        "aria-hidden",
        "false"
    );

    cartToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    cartSidebar.classList.remove("open");

    cartOverlay.classList.remove("open");

    cartSidebar.setAttribute(
        "aria-hidden",
        "true"
    );

    cartToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =========================================================
   CART BUTTON
========================================================= */

cartToggle.addEventListener(
    "click",
    () => {

        if (
            cartSidebar.classList.contains("open")
        ) {

            closeCart();

        } else {

            closeSearch();
            closeMobileMenu();

            openCart();

        }

    }
);


cartClose.addEventListener(
    "click",
    closeCart
);


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   QUICK ADD BUTTONS
========================================================= */

quickAddButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const productId =
                    Number(
                        button.dataset.productId
                    );

                addToCart(productId);

            }
        );

    }
);


/* =========================================================
   FILTER
========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    filterButton => {

                        filterButton.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );

                applyFilters();

            }
        );

    }
);


/* =========================================================
   SEARCH + FILTER
========================================================= */

function applyFilters() {

    const activeFilter =
        document.querySelector(
            ".filter-btn.active"
        );

    const category =
        activeFilter?.dataset.category ||
        "all";

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    let visibleCount = 0;


    productCards.forEach(
        card => {

            const cardCategory =
                card.dataset.category
                    .toLowerCase();

            const productName =
                card.dataset.name
                    .toLowerCase();


            const matchesCategory =
                category === "all" ||
                cardCategory === category;


            const matchesSearch =
                searchValue === "" ||
                productName.includes(
                    searchValue
                ) ||
                cardCategory.includes(
                    searchValue
                );


            const shouldShow =
                matchesCategory &&
                matchesSearch;


            card.classList.toggle(
                "is-hidden",
                !shouldShow
            );


            if (shouldShow) {
                visibleCount += 1;
            }

        }
    );


    noResults.hidden =
        visibleCount !== 0;

}


/* =========================================================
   SEARCH OPEN
========================================================= */

function openSearch() {

    closeCart();
    closeMobileMenu();

    searchPanel.classList.add("open");

    searchToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    setTimeout(
        () => {
            searchInput.focus();
        },
        250
    );

}


/* =========================================================
   SEARCH CLOSE
========================================================= */

function closeSearch() {

    searchPanel.classList.remove(
        "open"
    );

    searchToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    searchInput.value = "";

    applyFilters();

}


/* =========================================================
   SEARCH EVENTS
========================================================= */

searchToggle.addEventListener(
    "click",
    () => {

        if (
            searchPanel.classList.contains(
                "open"
            )
        ) {

            closeSearch();

        } else {

            openSearch();

        }

    }
);


searchClose.addEventListener(
    "click",
    closeSearch
);


searchInput.addEventListener(
    "input",
    applyFilters
);


/* =========================================================
   MOBILE MENU
========================================================= */

function openMobileMenu() {

    closeCart();
    closeSearch();

    mobileNav.classList.add("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

}


function closeMobileMenu() {

    mobileNav.classList.remove(
        "open"
    );

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

}


menuToggle.addEventListener(
    "click",
    () => {

        if (
            mobileNav.classList.contains(
                "open"
            )
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);


/* CLOSE MOBILE MENU WHEN LINK CLICKED */

mobileLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    }
);


/* =========================================================
   CONTINUE SHOPPING
========================================================= */

continueShopping.addEventListener(
    "click",
    () => {

        closeCart();

        document
            .getElementById("collection")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================================
   CHECKOUT WHATSAPP
========================================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {
            return;
        }

        const total =
            calculateTotal();


        const orderItems =
            cart.map(
                item => {

                    const product =
                        getProduct(item.id);

                    return `• ${product.name} x${item.quantity} = ${formatPrice(
                        product.price * item.quantity
                    )}`;

                }
            );


        const message = [

            "Halo flawsomekytaa_byNR 👋",

            "",

            "Saya ingin memesan:",

            "",

            ...orderItems,

            "",

            `Total: ${formatPrice(total)}`,

            "",

            "Mohon info ketersediaan dan proses pemesanannya.",

            "Terima kasih 🤍"

        ].join("\n");


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    clearTimeout(toastTimeout);

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function handleNavbarScroll() {

    if (window.scrollY > 30) {

        navbar.classList.add(
            "scrolled"
        );

    } else {

        navbar.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    handleNavbarScroll,
    {
        passive: true
    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeCart();
        closeSearch();
        closeMobileMenu();

    }
);


/* =========================================================
   CLOSE SEARCH / MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    event => {

        const clickedInsideSearch =
            searchPanel.contains(event.target) ||
            searchToggle.contains(event.target);

        const clickedInsideMenu =
            mobileNav.contains(event.target) ||
            menuToggle.contains(event.target);


        if (
            !clickedInsideSearch &&
            searchPanel.classList.contains("open")
        ) {

            closeSearch();

        }


        if (
            !clickedInsideMenu &&
            mobileNav.classList.contains("open")
        ) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadCart();

renderCart();

applyFilters();

handleNavbarScroll();