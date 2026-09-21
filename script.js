/* =========================================================
   FLAWSOME KYTAA BY.NR
   JAVASCRIPT - FINAL VERSION
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
        description: "Pashmina dengan warna latte yang lembut dan hangat untuk memberikan tampilan clean, feminine, dan effortless."
    },
    {
        id: 2,
        name: "Pashmina Sand",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpeg",
        description: "Pashmina dengan warna sand yang soft dan versatile, mudah dipadukan dengan berbagai warna outfit."
    },
    {
        id: 3,
        name: "Pashmina Cream",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 55000,
        image: "images/hijab3.jpeg",
        description: "Pashmina dengan warna cream yang memberikan kesan lembut, minimalis, dan timeless."
    },
    {
        id: 4,
        name: "Pashmina Mocha",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 55000,
        image: "images/hijab4.jpeg",
        description: "Pashmina dengan warna mocha yang hangat dan elegan untuk tampilan sederhana namun tetap stylish."
    },
    {
        id: 5,
        name: "Pashmina Cocoa",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 89000,
        image: "images/hijab5.jpeg",
        description: "Pashmina dengan warna cocoa yang rich dan sophisticated untuk tampilan elegan di berbagai kesempatan."
    },
    {
        id: 6,
        name: "Pashmina Rose",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 89000,
        image: "images/hijab6.jpeg",
        description: "Pashmina dengan warna rose yang feminine dan soft untuk memberikan sentuhan manis pada penampilan."
    },
    {
        id: 7,
        name: "Pashmina Dusty Lilac",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 65000,
        image: "images/hijab7.jpeg",
        description: "Pashmina dengan warna dusty lilac yang lembut untuk memberikan sentuhan warna yang subtle."
    },
    {
        id: 8,
        name: "Pashmina Espresso",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 65000,
        image: "images/hijab8.jpeg",
        description: "Pashmina dengan warna espresso yang dalam dan elegan, mudah dipadukan dengan berbagai outfit."
    },
    {
        id: 9,
        name: "Pashmina Nude",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 89000,
        image: "images/hijab9.jpeg",
        description: "Pashmina dengan warna nude yang versatile untuk tampilan clean, soft, dan timeless."
    }
];

const WHATSAPP_NUMBER = "62882002403676";
const CART_STORAGE_KEY = "flawsomekytaa_cart";

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

const navbar = document.getElementById("navbar");
const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const noResults = document.getElementById("noResults");

const cartToggle = document.getElementById("cartToggle");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const continueShopping = document.getElementById("continueShopping");
const checkoutBtn = document.getElementById("checkoutBtn");

const productModalOverlay = document.getElementById("productModalOverlay");
const modalClose = document.getElementById("modalClose");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductCategory = document.getElementById("modalProductCategory");
const modalProductName = document.getElementById("modalProductName");
const modalProductPrice = document.getElementById("modalProductPrice");
const modalProductDescription = document.getElementById("modalProductDescription");
const colorOptions = document.getElementById("colorOptions");
const selectedColorName = document.getElementById("selectedColorName");
const modalQuantityElement = document.getElementById("modalQuantity");
const modalQuantityMinus = document.getElementById("modalQuantityMinus");
const modalQuantityPlus = document.getElementById("modalQuantityPlus");
const modalAddToBag = document.getElementById("modalAddToBag");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);
}

function getProduct(productId) {
    return products.find(product => product.id === Number(productId));
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   CART STORAGE
========================================================= */

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

        if (!Array.isArray(savedCart)) {
            cart = [];
            return;
        }

        cart = savedCart
            .map(item => ({
                productId: Number(item.productId),
                color: item.color || "",
                quantity: Math.max(
                    1,
                    Number(item.quantity) || 1
                )
            }))
            .filter(item => getProduct(item.productId));

    } catch (error) {
        cart = [];
        console.error(
            "Gagal membaca shopping bag:",
            error
        );
    }
}

/* =========================================================
   CART ACTIONS
========================================================= */

function addToCart(
    productId,
    color = "",
    quantity = 1
) {
    const product = getProduct(productId);

    if (!product) return;

    const safeQuantity = Math.max(
        1,
        Number(quantity) || 1
    );

    const existingItem = cart.find(
        item =>
            item.productId === product.id &&
            item.color === color
    );

    if (existingItem) {
        existingItem.quantity += safeQuantity;
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
        `${product.name} ditambahkan ke shopping bag.`
    );
}

function changeCartQuantity(index, change) {
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
}

function removeCartItem(index) {
    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    renderCart();
}

function calculateCartCount() {
    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}

function calculateCartTotal() {
    return cart.reduce(
        (total, item) => {
            const product = getProduct(
                item.productId
            );

            return (
                total +
                (
                    product
                        ? product.price *
                          item.quantity
                        : 0
                )
            );
        },
        0
    );
}

function renderCart() {
    if (!cartItems || !cartEmpty) return;

    if (cart.length === 0) {

        cartItems.innerHTML = "";

        cartEmpty.classList.add("show");

    } else {

        cartEmpty.classList.remove("show");

        cartItems.innerHTML = cart
            .map((item, index) => {

                const product =
                    getProduct(item.productId);

                if (!product) return "";

                return `
                    <div class="cart-item">

                        <div class="cart-item-image">
                            <img
                                src="${escapeHTML(
                                    product.image
                                )}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                            >
                        </div>

                        <div class="cart-item-info">

                            <p class="cart-item-category">
                                ${escapeHTML(
                                    product.categoryName
                                )}
                            </p>

                            <h3 class="cart-item-name">
                                ${escapeHTML(
                                    product.name
                                )}
                            </h3>

                            <p class="cart-item-color">
                                Warna:
                                ${escapeHTML(
                                    item.color ||
                                    "Belum dipilih"
                                )}
                            </p>

                            <div class="cart-item-bottom">

                                <strong class="cart-item-price">
                                    ${formatPrice(
                                        product.price *
                                        item.quantity
                                    )}
                                </strong>

                                <div class="cart-quantity">

                                    <button
                                        type="button"
                                        data-action="decrease"
                                        data-index="${index}"
                                        aria-label="Kurangi jumlah"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        data-action="increase"
                                        data-index="${index}"
                                        aria-label="Tambah jumlah"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <button
                                class="cart-remove"
                                type="button"
                                data-action="remove"
                                data-index="${index}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>
                `;
            })
            .join("");
    }

    cartCount.textContent =
        calculateCartCount();

    cartTotal.textContent =
        formatPrice(
            calculateCartTotal()
        );
}

/* =========================================================
   CART EVENTS
========================================================= */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) return;

        const index =
            Number(button.dataset.index);

        const action =
            button.dataset.action;

        if (action === "increase") {

            changeCartQuantity(
                index,
                1
            );

        } else if (
            action === "decrease"
        ) {

            changeCartQuantity(
                index,
                -1
            );

        } else if (
            action === "remove"
        ) {

            removeCartItem(index);
        }
    }
);

/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {

    cartSidebar.classList.add(
        "open"
    );

    cartOverlay.classList.add(
        "open"
    );

    document.body.classList.add(
        "no-scroll"
    );
}

function closeCart() {

    cartSidebar.classList.remove(
        "open"
    );

    cartOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}

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

document
    .querySelectorAll(".quick-add")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const productId =
                    Number(
                        button.dataset.productId
                    );

                addToCart(
                    productId,
                    "",
                    1
                );
            }
        );
    });

/* =========================================================
   FILTER + SEARCH
========================================================= */

function applyFilters() {

    let visibleCount = 0;

    productCards.forEach(card => {

        const category =
            card.dataset.category ||
            "";

        const name =
            (
                card.dataset.name ||
                ""
            ).toLowerCase();

        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;

        const matchesSearch =
            !currentSearch ||
            name.includes(currentSearch);

        const shouldShow =
            matchesFilter &&
            matchesSearch;

        card.style.display =
            shouldShow
                ? "block"
                : "none";

        if (shouldShow) {
            visibleCount++;
        }
    });

    noResults.classList.toggle(
        "show",
        visibleCount === 0
    );
}

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                btn =>
                    btn.classList.remove(
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
            searchInput.focus();
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
            event.target.value
                .trim()
                .toLowerCase();

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

document
    .querySelectorAll(".mobile-nav a")
    .forEach(link => {

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
   PRODUCT DETAIL
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
                Number(
                    card.dataset.id
                );

            openProductModal(
                productId
            );
        }
    );
});

function openProductModal(
    productId
) {

    const product =
        getProduct(productId);

    if (!product) return;

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
        formatPrice(
            product.price
        );

    modalProductDescription.textContent =
        product.description;

    document
        .querySelectorAll(
            ".color-swatch"
        )
        .forEach(swatch => {

            swatch.classList.remove(
                "active"
            );
        });

    selectedColorName.textContent =
        "Belum dipilih";

    modalQuantityElement.textContent =
        selectedProductQuantity;

    productModalOverlay.classList.add(
        "open"
    );

    document.body.classList.add(
        "no-scroll"
    );
}

function closeProductModal() {

    productModalOverlay.classList.remove(
        "open"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}

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

        if (!swatch) return;

        document
            .querySelectorAll(
                ".color-swatch"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );
            });

        swatch.classList.add(
            "active"
        );

        selectedProductColor =
            swatch.dataset.color ||
            "";

        selectedColorName.textContent =
            selectedProductColor;
    }
);

/* =========================================================
   QUANTITY
========================================================= */

modalQuantityMinus.addEventListener(
    "click",
    () => {

        selectedProductQuantity =
            Math.max(
                1,
                selectedProductQuantity - 1
            );

        modalQuantityElement.textContent =
            selectedProductQuantity;
    }
);

modalQuantityPlus.addEventListener(
    "click",
    () => {

        selectedProductQuantity =
            Math.min(
                99,
                selectedProductQuantity + 1
            );

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

        if (!selectedProductId) return;

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
            () => {
                openCart();
            },
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
            "Halo Flawsome Kyta by.NR, saya ingin memesan:\n\n";

        cart.forEach(
            (item, index) => {

                const product =
                    getProduct(
                        item.productId
                    );

                if (!product) return;

                const subtotal =
                    product.price *
                    item.quantity;

                message +=
                    `${index + 1}. ${product.name}\n`;

                message +=
                    `Warna: ${
                        item.color ||
                        "Belum dipilih"
                    }\n`;

                message +=
                    `Qty: ${
                        item.quantity
                    }\n`;

                message +=
                    `Subtotal: ${
                        formatPrice(
                            subtotal
                        )
                    }\n\n`;
            }
        );

        message +=
            `Total: ${
                formatPrice(
                    calculateCartTotal()
                )
            }\n\n`;

        message +=
            "Mohon info ketersediaan dan proses selanjutnya. Terima kasih.";

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                message
            )}`;

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
            2800
        );
}

/* =========================================================
   NAVBAR SCROLL
========================================================= */

function handleNavbarScroll() {

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 10
    );
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

        if (
            productModalOverlay.classList.contains(
                "open"
            )
        ) {
            closeProductModal();
        }

        if (
            cartSidebar.classList.contains(
                "open"
            )
        ) {
            closeCart();
        }

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

        if (
            !searchPanel.classList.contains(
                "open"
            )
        ) {
            return;
        }

        if (
            !searchPanel.contains(
                event.target
            ) &&
            !searchToggle.contains(
                event.target
            )
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