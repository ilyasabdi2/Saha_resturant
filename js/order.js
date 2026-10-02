// ============================================================
// SAHAN RESTAURANT - ORDER.JS
// ============================================================

// ------------------------------------------------------------
// RESTAURANT SETTINGS
// ------------------------------------------------------------

const RESTAURANT_WHATSAPP = "254757220386";
const ORDER_NUMBER_KEY = "sahanOrderNumber";


// ------------------------------------------------------------
// CART
// ------------------------------------------------------------

let cart = {};


// ------------------------------------------------------------
// EMOJIS
// Using Unicode escapes to prevent WhatsApp character issues
// ------------------------------------------------------------

const EMOJI = {
    restaurant: "\u{1F37D}\uFE0F",
    number: "\u{1F522}",
    calendar: "\u{1F4C5}",
    clock: "\u{1F551}",
    items: "\u{1F6D2}",
    customer: "\u{1F464}",
    phone: "\u{1F4F1}",
    delivery: "\u{1F69A}",
    pickup: "\u{1F3E0}",
    location: "\u{1F4CD}",
    notes: "\u{1F4DD}",
    check: "\u{2705}",
    pray: "\u{1F64F}"
};


// ------------------------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------------------------

const orderForm = document.getElementById("orderForm");
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const cartBadge = document.getElementById("cartBadge");
const emptyCartMsg = document.getElementById("emptyCartMsg");

const orderType = document.getElementById("orderType");
const addressField = document.getElementById("addressField");
const custAddress = document.getElementById("custAddress");


// ------------------------------------------------------------
// INITIALIZE CART FROM MENU
// ------------------------------------------------------------

function initializeCart() {

    const menuItems = document.querySelectorAll(".order-item");

    menuItems.forEach(item => {

        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price) || 0;

        if (!cart[name]) {
            cart[name] = {
                name: name,
                price: price,
                qty: 0
            };
        }
    });
}


// ------------------------------------------------------------
// UPDATE CART UI
// ------------------------------------------------------------

function updateCartUI() {

    if (!summaryItems) return;

    summaryItems.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    Object.values(cart).forEach(item => {

        if (item.qty <= 0) return;

        const itemTotal = item.price * item.qty;

        totalItems += item.qty;
        totalPrice += itemTotal;

        const row = document.createElement("div");

        row.className = "summary-item";

        row.innerHTML = `
            <div>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${item.qty} × $${item.price.toFixed(2)}</small>
            </div>

            <strong>$${itemTotal.toFixed(2)}</strong>
        `;

        summaryItems.appendChild(row);
    });


    // --------------------------------------------------------
    // TOTAL
    // --------------------------------------------------------

    if (summaryTotal) {
        summaryTotal.textContent = `$${totalPrice.toFixed(2)}`;
    }


    // --------------------------------------------------------
    // CART BADGE
    // --------------------------------------------------------

    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }


    // --------------------------------------------------------
    // EMPTY CART MESSAGE
    // --------------------------------------------------------

    if (emptyCartMsg) {

        if (totalItems === 0) {
            emptyCartMsg.style.display = "block";
        } else {
            emptyCartMsg.style.display = "none";
        }
    }


    // --------------------------------------------------------
    // UPDATE QUANTITY NUMBERS ON MENU
    // --------------------------------------------------------

    document.querySelectorAll(".order-item").forEach(item => {

        const name = item.dataset.name;

        if (!cart[name]) return;

        const qtyElement = item.querySelector(".qty-value");

        if (qtyElement) {
            qtyElement.textContent = cart[name].qty;
        }
    });
}


// ------------------------------------------------------------
// CHANGE QUANTITY
// ------------------------------------------------------------

function changeQuantity(itemElement, change) {

    const name = itemElement.dataset.name;

    if (!cart[name]) {
        cart[name] = {
            name: name,
            price: parseFloat(itemElement.dataset.price) || 0,
            qty: 0
        };
    }

    cart[name].qty += change;

    // Never allow quantity below zero
    if (cart[name].qty < 0) {
        cart[name].qty = 0;
    }

    updateCartUI();
}


// ------------------------------------------------------------
// QUANTITY BUTTONS
// ------------------------------------------------------------

document.querySelectorAll(".order-item").forEach(item => {

    const minusButton = item.querySelector(".qty-minus");
    const plusButton = item.querySelector(".qty-plus");

    if (minusButton) {

        minusButton.addEventListener("click", function () {
            changeQuantity(item, -1);
        });

    }

    if (plusButton) {

        plusButton.addEventListener("click", function () {
            changeQuantity(item, 1);
        });

    }
});


// ------------------------------------------------------------
// DELIVERY / PICKUP TOGGLE
// ------------------------------------------------------------

if (orderType) {

    function updateOrderType() {

        if (!addressField) return;

        if (orderType.value === "Delivery") {

            addressField.style.display = "block";

            if (custAddress) {
                custAddress.required = true;
            }

        } else {

            addressField.style.display = "none";

            if (custAddress) {
                custAddress.required = false;
                custAddress.value = "";
            }
        }
    }


    orderType.addEventListener("change", updateOrderType);

    // Run once when page loads
    updateOrderType();
}


// ------------------------------------------------------------
// CATEGORY FILTER
// ------------------------------------------------------------

const categoryButtons = document.querySelectorAll(".cat-btn");
const orderItems = document.querySelectorAll(".order-item");

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Remove active state
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active state
        this.classList.add("active");

        const category = this.dataset.category;

        orderItems.forEach(item => {

            const itemCategory = item.dataset.category;

            if (
                category === "all" ||
                category === itemCategory
            ) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    });
});


// ------------------------------------------------------------
// GENERATE ORDER NUMBER
// ------------------------------------------------------------
//
// Example:
// SAH-20260912-001
//
// The number increases on this customer's device.
// Later, when we connect the database, we can make the
// order number globally unique across all customers.
// ------------------------------------------------------------

function generateOrderNumber() {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const datePart = `${year}${month}${day}`;

    let storedNumber = localStorage.getItem(ORDER_NUMBER_KEY);

    let nextNumber = 1;

    if (storedNumber) {

        const parts = storedNumber.split("-");

        if (parts.length === 3) {

            const storedDate = parts[1];
            const storedSequence = parseInt(parts[2], 10);

            if (
                storedDate === datePart &&
                !isNaN(storedSequence)
            ) {
                nextNumber = storedSequence + 1;
            }
        }
    }

    const sequence = String(nextNumber).padStart(3, "0");

    const orderNumber = `SAH-${datePart}-${sequence}`;

    localStorage.setItem(
        ORDER_NUMBER_KEY,
        orderNumber
    );

    return orderNumber;
}


// ------------------------------------------------------------
// RESTAURANT DATE
// Nairobi / Kenya time
// ------------------------------------------------------------

function getRestaurantDate() {

    const date = new Date();

    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Nairobi",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}


// ------------------------------------------------------------
// RESTAURANT TIME
// Nairobi / Kenya time
// ------------------------------------------------------------

function getRestaurantTime() {

    const date = new Date();

    return new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Nairobi",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);
}


// ------------------------------------------------------------
// GET CART TOTAL
// ------------------------------------------------------------

function getCartTotal() {

    let total = 0;

    Object.values(cart).forEach(item => {

        if (item.qty > 0) {
            total += item.price * item.qty;
        }

    });

    return total;
}


// ------------------------------------------------------------
// GET TOTAL ITEM COUNT
// ------------------------------------------------------------

function getCartItemCount() {

    let count = 0;

    Object.values(cart).forEach(item => {

        if (item.qty > 0) {
            count += item.qty;
        }

    });

    return count;
}


// ------------------------------------------------------------
// BUILD WHATSAPP ORDER MESSAGE
// ------------------------------------------------------------

function buildWhatsAppMessage() {

    const orderNumber = generateOrderNumber();

    const orderDate = getRestaurantDate();
    const orderTime = getRestaurantTime();

    const customerName =
        document.getElementById("custName")?.value.trim() || "";

    const customerPhone =
        document.getElementById("custPhone")?.value.trim() || "";

    const selectedOrderType =
        orderType?.value || "Delivery";

    const address =
        custAddress?.value.trim() || "";

    const notes =
        document.getElementById("custNotes")?.value.trim() || "";

    let total = 0;

    let itemsText = "";

    let itemNumber = 1;


    // --------------------------------------------------------
    // ORDER ITEMS
    // --------------------------------------------------------

    Object.values(cart).forEach(item => {

        if (item.qty <= 0) return;

        const itemTotal = item.price * item.qty;

        total += itemTotal;

        itemsText +=
            `${itemNumber}. ${item.qty}x ${item.name} - $${itemTotal.toFixed(2)}\n`;

        itemNumber++;
    });


    // --------------------------------------------------------
    // ORDER TYPE ICON
    // --------------------------------------------------------

    const orderTypeIcon =
        selectedOrderType.toLowerCase() === "pickup"
            ? EMOJI.pickup
            : EMOJI.delivery;


    // --------------------------------------------------------
    // BUILD MESSAGE
    // --------------------------------------------------------

    let message = "";

    message += `${EMOJI.restaurant} *NEW ORDER - SAHAN RESTAURANT*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `${EMOJI.number} *Order No:* ${orderNumber}\n`;
    message += `${EMOJI.calendar} *Date:* ${orderDate}\n`;
    message += `${EMOJI.clock} *Time:* ${orderTime}\n\n`;

    message += `${EMOJI.items} *ORDER ITEMS:*\n`;
    message += `${itemsText}\n`;

    message += `*TOTAL: $${total.toFixed(2)}*\n\n`;

    message += `${EMOJI.customer} *CUSTOMER DETAILS:*\n`;
    message += `Name: ${customerName}\n`;
    message += `${EMOJI.phone} Phone: ${customerPhone}\n`;
    message += `${orderTypeIcon} Order Type: ${selectedOrderType}\n`;

    if (
        selectedOrderType.toLowerCase() === "delivery" &&
        address
    ) {
        message += `${EMOJI.location} Address: ${address}\n`;
    }

    if (notes) {
        message += `${EMOJI.notes} Notes: ${notes}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${EMOJI.pray} *Please confirm this order.*`;


    return {
        message: message,
        orderNumber: orderNumber,
        total: total
    };
}


// ------------------------------------------------------------
// CLEAR CART
// ------------------------------------------------------------

function clearCart() {

    Object.values(cart).forEach(item => {
        item.qty = 0;
    });


    // Reset quantity numbers on page
    document.querySelectorAll(".order-item").forEach(item => {

        const qtyElement =
            item.querySelector(".qty-value");

        if (qtyElement) {
            qtyElement.textContent = "0";
        }
    });


    // Reset form
    if (orderForm) {
        orderForm.reset();
    }


    // Show delivery address again
    if (addressField) {
        addressField.style.display = "block";
    }

    if (custAddress) {
        custAddress.required = true;
    }


    updateCartUI();
}


// ------------------------------------------------------------
// SUCCESS MESSAGE
// ------------------------------------------------------------

function showSuccessMessage(orderNumber) {

    // Remove an existing message
    const existing =
        document.getElementById("orderSuccessMessage");

    if (existing) {
        existing.remove();
    }


    const successMessage =
        document.createElement("div");

    successMessage.id = "orderSuccessMessage";

    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: min(90%, 500px);
        background: #198754;
        color: white;
        padding: 18px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        text-align: center;
        font-size: 16px;
        line-height: 1.5;
    `;

    successMessage.innerHTML = `
        <strong>${EMOJI.check} Order #${escapeHtml(orderNumber)} is ready!</strong>
        <br>
        WhatsApp has been opened with your order.
        <br>
        <small>Please press <strong>Send</strong> in WhatsApp to complete your order.</small>
    `;


    document.body.appendChild(successMessage);


    // Automatically remove after 7 seconds
    setTimeout(() => {

        if (successMessage) {
            successMessage.remove();
        }

    }, 7000);
}


// ------------------------------------------------------------
// ESCAPE HTML
// ------------------------------------------------------------

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ------------------------------------------------------------
// FORM SUBMISSION
// ------------------------------------------------------------

if (orderForm) {

    orderForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // ----------------------------------------------------
        // CHECK CART
        // ----------------------------------------------------

        const itemCount = getCartItemCount();

        if (itemCount === 0) {

            alert(
                "Your cart is empty. Please add at least one item before placing your order."
            );

            return;
        }


        // ----------------------------------------------------
        // CHECK FORM
        // ----------------------------------------------------

        if (!orderForm.checkValidity()) {

            orderForm.reportValidity();

            return;
        }


        // ----------------------------------------------------
        // BUILD ORDER
        // ----------------------------------------------------

        const orderData =
            buildWhatsAppMessage();


        // ----------------------------------------------------
        // ENCODE MESSAGE
        // ----------------------------------------------------

        const encodedMessage =
            encodeURIComponent(orderData.message);


        // ----------------------------------------------------
        // WHATSAPP URL
        // ----------------------------------------------------

        const whatsappUrl =
            "https://wa.me/" +
            RESTAURANT_WHATSAPP +
            "?text=" +
            encodedMessage;


        // ----------------------------------------------------
        // OPEN WHATSAPP
        // ----------------------------------------------------

        const whatsappWindow =
            window.open(
                whatsappUrl,
                "_blank"
            );


        // ----------------------------------------------------
        // CHECK POPUP
        // ----------------------------------------------------

        if (!whatsappWindow) {

            alert(
                "WhatsApp could not be opened. Please allow pop-ups for this website and try again."
            );

            return;
        }


        // ----------------------------------------------------
        // CLEAR CART
        // ----------------------------------------------------

        clearCart();


        // ----------------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------------

        showSuccessMessage(
            orderData.orderNumber
        );

    });
}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

initializeCart();

updateCartUI();