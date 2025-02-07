let pageUrls = {
    about: "/index.html?about",
    gallery: "/index.html?gallery",
    contact: "/index.html?contact"
};
function OnStartUp() {
    popStateHandler();
}
OnStartUp();
document.querySelector("#about-link").addEventListener("click", () => {
    let stateObj = { page: "about" };
    document.title = "About";
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});
document.querySelector("#gallery-link").addEventListener("click", () => {
    let stateObj = { page: "gallery" };
    document.title = "Gallery";
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});
document.querySelector("#contact-link").addEventListener("click", () => {
    let stateObj = { page: "contact" };
    document.title = "Contact";
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});
function RenderAboutPage() {
    document.querySelector("main").innerHTML = `
        <h1 class="title">About Me</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
    `;
}
function RenderGalleryPage() {
    document.querySelector("main").innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery-grid" id="gallery-grid"></div>
        <div class="modal" id="image-modal">
            <div class="modal-content">
                <button class="modal-close" id="modal-close">Zamknij</button>
                <img id="modal-image" src="" alt="Full Image">
            </div>
        </div>
    `;
    const galleryGrid = document.getElementById("gallery-grid");
    let images = [];
    for (let i = 1; i <= 9; i++) {
        images.push(`https://picsum.photos/seed/${i}/600/400`);
    }
    images.forEach(src => {
        let img = document.createElement("img");
        img.classList.add("gallery-item");
        img.setAttribute("data-src", src);
        img.src = "";
        galleryGrid.appendChild(img);
    });
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let img = entry.target;
                let dataSrc = img.getAttribute("data-src");
                fetch(dataSrc)
                    .then(response => response.blob())
                    .then(blob => {
                        let objectURL = URL.createObjectURL(blob);
                        img.src = objectURL;
                    });
                obs.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 50px 0px" });
    document.querySelectorAll(".gallery-item").forEach(img => {
        observer.observe(img);
        img.addEventListener("click", () => {
            document.getElementById("modal-image").src = img.src;
            document.getElementById("image-modal").classList.add("active");
        });
    });
    document.getElementById("modal-close").addEventListener("click", () => {
        document.getElementById("image-modal").classList.remove("active");
    });
    document.getElementById("image-modal").addEventListener("click", (e) => {
        if (e.target.id === "image-modal") {
            document.getElementById("image-modal").classList.remove("active");
        }
    });
}
function RenderContactPage() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const captchaAnswer = num1 + num2;
    document.querySelector("main").innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form" class="contact-form">
            <input type="text" id="name" placeholder="Imię" required>
            <input type="email" id="email" placeholder="E-mail" required>
            <textarea id="message" placeholder="Wiadomość" required></textarea>
            <label for="captcha">Ile to jest ${num1} + ${num2}?</label>
            <input type="text" id="captcha" placeholder="Captcha" required>
            <button type="submit">Wyślij</button>
        </form>
    `;
    document.getElementById("contact-form").addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();
        let captcha = document.getElementById("captcha").value.trim();
        if (!name || !email || !message || !captcha) {
            alert("Wszystkie pola są wymagane.");
            return;
        }
        if (parseInt(captcha) !== captchaAnswer) {
            alert("Błędna odpowiedź CAPTCHA.");
            return;
        }
        alert("Formularz został wysłany.");
        document.getElementById("contact-form").reset();
    });
}
function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact) {
        RenderContactPage();
    }
    if (loc === pageUrls.about) {
        RenderAboutPage();
    }
    if (loc === pageUrls.gallery) {
        RenderGalleryPage();
    }
}
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
window.onpopstate = popStateHandler;
