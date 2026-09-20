/* =========================================================
   FLAWSOME KYTAA BY.NR
   JAVASCRIPT
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
        image: "images/hijab1.jpeg",
        description:
            "Pashmina dengan nuansa latte yang lembut untuk menciptakan tampilan clean, feminine, dan effortless."
    },

    {
        id: 2,
        name: "Pashmina Sand",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpeg",
        description:
            "Pashmina bernuansa sand yang versatile dan mudah dipadukan dengan berbagai gaya outfit."
    },

    {
        id: 3,
        name: "Square Cream",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab3.jpeg",
        description:
            "Square hijab dengan nuansa cream yang memberikan kesan soft, minimal, dan timeless."
    },

    {
        id: 4,
        name: "Square Mocha",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab4.jpeg",
        description:
            "Square hijab dengan karakter warna mocha yang hangat untuk tampilan yang sederhana namun elegan."
    },

    {
        id: 5,
        name: "Silk Cocoa",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab5.jpeg",
        description:
            "Koleksi premium bernuansa cocoa untuk kamu yang menyukai tampilan lebih sophisticated dan timeless."
    },

    {
        id: 6,
        name: "Silk Rose",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab6.jpeg",
        description:
            "Koleksi premium bernuansa rose dengan karakter feminine dan elegan untuk berbagai kesempatan."
    },

    {
        id: 7,
        name: "Pashmina Dusty Lilac",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 65000,
        image: "images/hijab7.jpeg",
        description:
            "Nuansa dusty lilac yang lembut untuk memberikan sentuhan warna yang subtle."
    },

    {
        id: 8,
        name: "Square Espresso",
        category: "square",
        categoryName: "Square Collection",
        price: 65000,
        image: "images/hijab8.jpeg",
        description:
            "Nuansa espresso yang dalam dan elegan, mudah dipadukan dengan berbagai outfit."
    },

    {
        id: 9,
        name: "Silk Nude",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab9.jpeg",
        description:
            "Nuansa nude yang versatile untuk tampilan clean, soft, dan timeless."
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

let toastTimeout = null;

let currentFilter = "all";

let currentSearch = "";

let selectedProductId = null;

let selectedProductColor = "";

let selectedProductQuantity = 1;


/* =========================================================
   DOM REFERENCES
========================================================= */


/* NAVBAR */

const navbar =
    document.getElementById("navbar");

const searchToggle =
    document.getElementById("searchToggle");

const searchPanel =
    document.getElementById("searchPanel");

const searchClose =
    document.getElementById("searchClose");

const searchInput =
    document.getElementById("searchInput");

const menuToggle =
    document.getElementById("menuToggle");

const mobileNav =
    document.getElementById("mobileNav");


/* COLLECTION */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");

const noResults =
    document.getElementById("noResults");


/* CART */

const cartToggle =
    document.getElementById("cartToggle");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartClose =
    document.getElementById("cartClose");

const cartItemsContainer =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const continueShopping =
    document.getElementById("continueShopping");


/* PRODUCT MODAL */

const productModalOverlay =
    document.getElementById("productModalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalProductCategory =
    document.getElementById("modalProductCategory");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const modalProductDescription =
    document.getElementById("modalProductDescription");

const colorOptions =
    document.getElementById("colorOptions");

const selectedColorName =
    document.getElementById("selectedColorName");

const modalQuantityMinus =
    document.getElementById("modalQuantityMinus");

const modalQuantityPlus =
    document.getElementById("modalQuantityPlus");

const modalQuantityElement =
    document.getElementById("modalQuantity");

const modalAddToBag =
    document.getElementById("modalAddToBag");


/* TOAST */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
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
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

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
                    getProduct(item.productId);

                if (!product) {

                    return null;

                }

                return {

                    productId: product.id,

                    color: item.color || "",

                    quantity: Math.max(
                        1,
                        Number(item.quantity) || 1
                    )

                };

            })
            .filter(Boolean);

    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );

        cart = [];

    }

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    productId,
    color = "",
    quantity = 1
) {

    const product =
        getProduct(productId);

    if (!product) {

        return;

    }

    const safeQuantity =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existingItem =
        cart.find(item =>
            item.productId === product.id &&
            item.color === color
        );


    if (existingItem) {

        existingItem.quantity +=
            safeQuantity;

    } else {

        cart.push({

            productId: product.id,

            color: color,

            quantity: safeQuantity

        });

    }


    saveCart();

    renderCart();

    showToast(
        `${product.name} berhasil ditambahkan ke bag.`
    );

}


/* =========================================================
   CHANGE CART QUANTITY
========================================================= */

function changeCartQuantity(
    productId,
    color,
    change
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.productId === Number(productId) &&
                cartItem.color === color
        );


    if (!item) {

        return;

    }


    item.quantity += Number(change);


    if (item.quantity <= 0) {

        cart = cart.filter(
            cartItem =>
                !(
                    cartItem.productId === Number(productId) &&
                    cartItem.color === color
                )
        );

    }


    saveCart();

    renderCart();

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeCartItem(
    productId,
    color
) {

    cart = cart.filter(
        item =>
            !(
                item.productId === Number(productId) &&
                item.color === color
            )
    );

    saveCart();

    renderCart();

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
   CART TOTAL
========================================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getProduct(item.productId);

            if (!product) {

                return total;

            }

            return total +
                (
                    product.price *
                    item.quantity
                );

        },
        0
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const count =
        calculateCartCount();

    const total =
        calculateCartTotal();


    cartCount.textContent =
        count;

    cartTotal.textContent =
        formatPrice(total);


    if (cart.length === 0) {

        cartItemsContainer.innerHTML = "";

        cartItemsContainer.style.display =
            "none";

        cartEmpty.classList.add("show");

        return;

    }


    cartItemsContainer.style.display =
        "block";

    cartEmpty.classList.remove("show");


    cartItemsContainer.innerHTML =
        cart.map(item => {

            const product =
                getProduct(item.productId);

            if (!product) {

                return "";

            }


            const subtotal =
                product.price *
                item.quantity;


            return `

                <div
                    class="cart-item"
                    data-product-id="${product.id}"
                    data-color="${escapeHTML(item.color)}"
                >

                    <div class="cart-item-image">

                        <img
                            src="${product.image}"
                            alt="${escapeHTML(product.name)}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <span class="cart-item-category">
                            ${escapeHTML(product.categoryName)}
                        </span>

                        <h3 class="cart-item-name">
                            ${escapeHTML(product.name)}
                        </h3>

                        <p class="cart-item-color">
                            Warna:
                            ${escapeHTML(
                                item.color ||
                                "Belum dipilih"
                            )}
                        </p>


                        <div class="cart-item-bottom">

                            <div>

                                <span class="cart-item-price">
                                    ${formatPrice(subtotal)}
                                </span>

                                <br>

                                <button
                                    class="cart-remove"
                                    type="button"
                                    data-action="remove"
                                    data-product-id="${product.id}"
                                    data-color="${escapeHTML(item.color)}"
                                >
                                    Remove
                                </button>

                            </div>


                            <div class="cart-quantity">

                                <button
                                    type="button"
                                    data-action="decrease"
                                    data-product-id="${product.id}"
                                    data-color="${escapeHTML(item.color)}"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    data-action="increase"
                                    data-product-id="${product.id}"
                                    data-color="${escapeHTML(item.color)}"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   CART EVENT DELEGATION
========================================================= */

cartItemsContainer.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {

            return;

        }


        const action =
            button.dataset.action;

        const productId =
            Number(
                button.dataset.productId
            );

        const color =
            button.dataset.color || "";


        if (action === "increase") {

            changeCartQuantity(
                productId,
                color,
                1
            );

        }


        if (action === "decrease") {

            changeCartQuantity(
                productId,
                color,
                -1
            );

        }


        if (action === "remove") {

            removeCartItem(
                productId,
                color
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

    document.body.classList.add("no-scroll");

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    cartSidebar.classList.remove("open");

    cartOverlay.classList.remove("open");

    document.body.classList.remove("no-scroll");

}


/* =========================================================
   CART EVENTS
========================================================= */

cartToggle.addEventListener(
    "click",
    openCart
);

cartClose.addEventListener(
    "click",
    closeCart
);

cartOverlay.addEventListener(
    "click",
    closeCart
);

continueShopping.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   QUICK ADD
========================================================= */

document.querySelectorAll(".quick-add")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const productId =
                    Number(
                        button.dataset.productId
                    );


                /*
                 * Quick Add tidak memilih warna.
                 * Warna akan muncul sebagai
                 * "Belum dipilih".
                 */

                addToCart(
                    productId,
                    "",
                    1
                );

            }
        );

    });


/* =========================================================
   FILTER
========================================================= */

function applyFilters() {

    let visibleCount = 0;


    productCards.forEach(card => {

        const category =
            card.dataset.category;

        const name =
            card.dataset.name.toLowerCase();


        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;


        const matchesSearch =
            !currentSearch ||
            name.includes(
                currentSearch.toLowerCase()
            );


        const shouldShow =
            matchesFilter &&
            matchesSearch;


        card.style.display =
            shouldShow ? "" : "none";


        if (shouldShow) {

            visibleCount++;

        }

    });


    if (visibleCount === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}


/* =========================================================
   FILTER BUTTON
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            applyFilters();

        }
    );

});


/* =========================================================
   SEARCH
========================================================= */

searchToggle.addEventListener(
    "click",
    () => {

        searchPanel.classList.toggle(
            "open"
        );


        if (
            searchPanel.classList.contains(
                "open"
            )
        ) {

            setTimeout(
                () => searchInput.focus(),
                100
            );

        }

    }
);


searchClose.addEventListener(
    "click",
    () => {

        searchPanel.classList.remove(
            "open"
        );

    }
);


searchInput.addEventListener(
    "input",
    event => {

        currentSearch =
            event.target.value.trim();

        applyFilters();

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

menuToggle.addEventListener(
    "click",
    () => {

        mobileNav.classList.toggle(
            "open"
        );

    }
);


document.querySelectorAll(
    ".mobile-nav a"
).forEach(link => {

    link.addEventListener(
        "click",
        () => {

            mobileNav.classList.remove(
                "open"
            );

        }
    );

});


/* =========================================================
   PRODUCT CARD DETAIL
========================================================= */

productCards.forEach(card => {

    card.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".quick-add"
                )
            ) {

                return;

            }


            const productId =
                Number(card.dataset.id);


            openProductModal(
                productId
            );

        }
    );

});


/* =========================================================
   OPEN PRODUCT MODAL
========================================================= */

function openProductModal(productId) {

    const product =
        getProduct(productId);


    if (!product) {

        return;

    }


    selectedProductId =
        product.id;

    selectedProductColor =
        "";

    selectedProductQuantity =
        1;


    modalProductImage.src =
        product.image;

    modalProductImage.alt =
        product.name;


    modalProductCategory.textContent =
        product.categoryName;


    modalProductName.textContent =
        product.name;


    modalProductPrice.textContent =
        formatPrice(product.price);


    modalProductDescription.textContent =
        product.description;


    selectedColorName.textContent =
        "Belum dipilih";


    modalQuantityElement.textContent =
        "1";


    document.querySelectorAll(
        ".color-swatch"
    ).forEach(swatch => {

        swatch.classList.remove(
            "active"
        );

    });


    productModalOverlay.classList.add(
        "open"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    productModalOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =========================================================
   MODAL EVENTS
========================================================= */

modalClose.addEventListener(
    "click",
    closeProductModal
);


productModalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModalOverlay
        ) {

            closeProductModal();

        }

    }
);


/* =========================================================
   COLOR SELECTION
========================================================= */

colorOptions.addEventListener(
    "click",
    event => {

        const swatch =
            event.target.closest(
                ".color-swatch"
            );


        if (!swatch) {

            return;

        }


        selectedProductColor =
            swatch.dataset.color;


        selectedColorName.textContent =
            selectedProductColor;


        document.querySelectorAll(
            ".color-swatch"
        ).forEach(item => {

            item.classList.remove(
                "active"
            );

        });


        swatch.classList.add(
            "active"
        );

    }
);


/* =========================================================
   QUANTITY
========================================================= */

modalQuantityMinus.addEventListener(
    "click",
    () => {

        if (
            selectedProductQuantity >
            1
        ) {

            selectedProductQuantity--;

        }


        modalQuantityElement.textContent =
            selectedProductQuantity;

    }
);


modalQuantityPlus.addEventListener(
    "click",
    () => {

        if (
            selectedProductQuantity <
            99
        ) {

            selectedProductQuantity++;

        }


        modalQuantityElement.textContent =
            selectedProductQuantity;

    }
);


/* =========================================================
   MODAL ADD TO BAG
========================================================= */

modalAddToBag.addEventListener(
    "click",
    () => {

        if (!selectedProductId) {

            return;

        }


        if (!selectedProductColor) {

            showToast(
                "Silakan pilih warna terlebih dahulu."
            );

            return;

        }


        addToCart(
            selectedProductId,
            selectedProductColor,
            selectedProductQuantity
        );


        closeProductModal();


        setTimeout(
            () => openCart(),
            250
        );

    }
);


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Shopping bag masih kosong."
            );

            return;

        }


        let message =
            "Halo Flawsome Kyta by.NR!%0A%0A";

        message +=
            "Saya ingin melakukan pemesanan:%0A%0A";


        cart.forEach(
            (item, index) => {

                const product =
                    getProduct(item.productId);


                if (!product) {

                    return;

                }


                const subtotal =
                    product.price *
                    item.quantity;


                message +=
                    `${index + 1}. ${product.name}%0A`;

                message +=
                    `Warna: ${
                        item.color ||
                        "Belum dipilih"
                    }%0A`;

                message +=
                    `Qty: ${
                        item.quantity
                    }%0A`;

                message +=
                    `Subtotal: ${
                        formatPrice(subtotal)
                    }%0A%0A`;

            }
        );


        message +=
            `Total: ${formatPrice(
                calculateCartTotal()
            )}%0A%0A`;


        message +=
            "Mohon informasi mengenai ketersediaan produk dan proses pemesanannya. Terima kasih.";


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                decodeURIComponent(message)
            )}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   NAVBAR SCROLL
========================================================= */

function handleNavbarScroll() {

    if (window.scrollY > 20) {

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
    handleNavbarScroll
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


        closeProductModal();

        closeCart();

        searchPanel.classList.remove(
            "open"
        );

        mobileNav.classList.remove(
            "open"
        );

    }
);


/* =========================================================
   CLICK OUTSIDE SEARCH
========================================================= */

document.addEventListener(
    "click",
    event => {

        const clickedInsideSearch =
            event.target.closest(
                ".search-panel"
            );


        const clickedSearchButton =
            event.target.closest(
                "#searchToggle"
            );


        if (
            !clickedInsideSearch &&
            !clickedSearchButton
        ) {

            searchPanel.classList.remove(
                "open"
            );

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