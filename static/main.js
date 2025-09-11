// SPA Routing
const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    const target = event.target.closest("a");
    if (!target || !target.href) return;

    const href = target.getAttribute("href");
    window.history.pushState({}, "", href);
    handleLocation();
};

// Define routes
const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/about": "/pages/about.html",
    "/projects": "/pages/projects.html",
    "/contact": "/pages/contact.html"
};

// Handle route changes
const handleLocation = async () => {
    let path = window.location.pathname;
    if (path === "/" || path === "/index.html") path = "/";

    const routePath = routes[path] || routes[404];

    try {
        const res = await fetch(routePath);
        if (!res.ok) throw new Error("Page not found");

        const html = await res.text();
        document.getElementById("main-page").innerHTML = html;

        attachFormHandlerIfNeeded();

        // project slider if on projects page
        if (path === "/projects") initProjectSlider();
    } catch (err) {
        console.error("Failed to load route:", err);
        document.getElementById("main-page").innerHTML = "<h1>Failed to load page</h1>";
    }
};

// Listen to back/forward navigation
window.onpopstate = handleLocation;
window.route = route;

// Run SPA on page load
document.addEventListener("DOMContentLoaded", handleLocation);

// Project slider
function initProjectSlider() {
    const slides = document.querySelectorAll('.coverflow__slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let current = 0;

    function updateSlides() {
        const screenWidth = window.innerWidth;
        slides.forEach(slide => slide.className = 'coverflow__slide');

        const prev1Index = (current - 1 + slides.length) % slides.length;
        const prev2Index = (current - 2 + slides.length) % slides.length;
        const next1Index = (current + 1) % slides.length;
        const next2Index = (current + 2) % slides.length;

        slides[current].classList.add('active');

        if (screenWidth > 770) {
            slides[prev1Index].classList.add('left');
            slides[prev2Index].classList.add('far-left');
            slides[next1Index].classList.add('right');
            slides[next2Index].classList.add('far-right');
        } else {
            slides[prev1Index].classList.add('left');
            slides[next1Index].classList.add('right');
        }
    }

    prevBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        updateSlides();
    });

    nextBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        updateSlides();
    });

    window.addEventListener('resize', updateSlides);
    updateSlides();
}

//////////////////////////////////////
// Contact form
function attachFormHandlerIfNeeded() {
    const form = document.querySelector(".form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.username.value;
        const email = form.email.value;
        const message = form.message.value;
        const statusEl = document.getElementById("form-status");

        statusEl.textContent = "Sending...";

        try {
            const res = await fetch("/submit_contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            const result = await res.json();

            if (result.success) {
                statusEl.textContent = "Message sent successfully!";
                form.reset();
            } else {
                statusEl.textContent = "Failed: " + (result.error || "Unknown error");
            }
        } catch (err) {
            console.error(err);
            statusEl.textContent = "Network error";
        }
    });
}
