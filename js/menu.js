document.addEventListener("DOMContentLoaded", function () {

    /* ===== CATEGORY FILTER ===== */

    const catButtons = document.querySelectorAll(".cat-btn");
    const menuItems = document.querySelectorAll(".menu-item");

    catButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {

            catButtons.forEach(function (b) {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            menuItems.forEach(function (item) {
                const category = item.getAttribute("data-category");

                if (filter === "all" || filter === category) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });

        });
    });


    /* ===== ADD TO ORDER (temporary front-end cart) ===== */
    /* This will be replaced/synced with the Flask backend
       once order.html + the database are connected. */

    let cartCount = 0;
    const cartBadge = document.getElementById("cartBadge");

    const orderToastEl = document.getElementById("orderToast");
    const orderToastBody = document.getElementById("orderToastBody");
    const orderToast = orderToastEl
        ? new bootstrap.Toast(orderToastEl, { delay: 1800 })
        : null;

    document.querySelectorAll(".add-to-order").forEach(function (btn) {
        btn.addEventListener("click", function () {

            const name = btn.getAttribute("data-name");
            const price = btn.getAttribute("data-price");

            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
            }

            if (orderToastBody) {
                orderToastBody.textContent = name + " ($" + price + ") was added to your order!";
            }

            if (orderToast) {
                orderToast.show();
            }

        });
    });

});