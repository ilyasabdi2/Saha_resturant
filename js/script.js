// Close mobile navbar after clicking a link

const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (navbarCollapse.classList.contains("show")) {

            const bsCollapse =
                bootstrap.Collapse.getInstance(navbarCollapse);

            if (bsCollapse) {
                bsCollapse.hide();
            }
        }

    });

});
