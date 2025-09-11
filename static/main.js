// This file handles the single-page application (SPA) routing
// and project page slider

const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    const target = event.target.closest("a");
    if (!target || !target.href) return;

    const href = target.getAttribute("href");
    window.history.pushState({}, "", href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/about": "/pages/about.html",
    "/projects": "/pages/projects.html",
    "/contact": "/pages/contact.html"
};

const handleLocation = async () => {
    let path = window.location.pathname;

    if (path === "/" || path === "/index.html") {
        path = "/";
    }

    const routePath = routes[path] || routes[404];

    try {
        const res = await fetch(routePath);
        if (!res.ok) throw new Error("Page not found");
        const html = await res.text();
        document.getElementById("main-page").innerHTML = html;

        // Re-attach event listeners after injecting new HTML
        attachFormHandlerIfNeeded();

        // Call the slider if we are in project page
        if (path === "/projects") {
            initProjectSlider();
        }

    } catch (err) {
        console.error("Failed to load route:", err);
        document.getElementById("main-page").innerHTML = "<h1>Failed to load page</h1>";
    }
};

window.onpopstate = handleLocation;
window.route = route;

// This function contains responsive slider logic
function initProjectSlider() {
    const slides = document.querySelectorAll('.coverflow__slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    // Check if elements exist before trying to add event listeners
    if (!slides.length || !prevBtn || !nextBtn) {
        console.warn('Slider elements not found. Skipping initialization.');
        return;
    }

    let current = 0;

    function updateSlides() {
        const screenWidth = window.innerWidth;
        
        slides.forEach((slide) => {
            slide.className = 'coverflow__slide'; 
        });

        // Use modular arithmetic to get the indices for a circular loop
        const prev1Index = (current - 1 + slides.length) % slides.length;
        const prev2Index = (current - 2 + slides.length) % slides.length;
        const next1Index = (current + 1) % slides.length;
        const next2Index = (current + 2) % slides.length;

        // Apply classes based on screen width
        slides[current].classList.add('active');
        
        // For larger screens, show the full coverflow effect
        if (screenWidth > 770) {
            slides[prev1Index].classList.add('left');
            slides[prev2Index].classList.add('far-left');
            slides[next1Index].classList.add('right');
            slides[next2Index].classList.add('far-right');
        } 
        // For smaller screens, only show the active card and its immediate neighbors
        else {
            slides[prev1Index].classList.add('left');
            slides[next1Index].classList.add('right');
        }
    }

    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        updateSlides();
    });

    nextBtn.addEventListener('click', () => {
        current = (current + 1) % slides.length;
        updateSlides();
    });

    // Re-run the update when the window is resized to handle layout changes
    window.addEventListener('resize', updateSlides);

    // Initial setup to place cards in their correct starting positions
    updateSlides();
}

// Ensure correct initial rendering of the page content
document.addEventListener("DOMContentLoaded", handleLocation);

// This function contain contact form working 
function attachFormHandlerIfNeeded() {
    const form = document.querySelector(".form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = form.username.value;
            const email = form.email.value;
            const message = form.message.value;

            try {
                const res = await fetch("/submit_contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await res.json();
                if (result.success) {
                    alert("Message sent successfully!");
                    form.reset();
                } else {
                    alert("Something went wrong. Please try again.");
                }
            } catch (err) {
                console.error("Error submitting form:", err);
                alert("Failed to send message.");
            }
        });
    }
}