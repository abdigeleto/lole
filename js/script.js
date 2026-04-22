// --- Church History Video Player ---
function playChurchVideo(wrapper) {
    const videoId = wrapper.dataset.videoid;
    if (!videoId) return;
    // Replace thumbnail/overlay/button with autoplay iframe
    wrapper.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
            title="The Story of Lole Evangelical Church"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>`;
    wrapper.style.cursor = 'default';
}

// Keyboard accessibility: Enter / Space triggers play
document.addEventListener('keydown', (e) => {
    const wrapper = document.getElementById('church-history-player');
    if (wrapper && document.activeElement === wrapper &&
        (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        playChurchVideo(wrapper);
    }
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

(function setupMobileNav() {
    if (!navToggle || !navLinks) return;

    let overlay = null;

    function buildOverlay() {
        // Outer: full-screen semi-transparent backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'mobile-nav-overlay';
        backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.45)';
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) destroyOverlay();
        });

        // Inner: right-side drawer panel
        const drawer = document.createElement('div');
        drawer.style.cssText = [
            'position:absolute', 'top:0', 'right:0',
            'width:78%', 'max-width:320px', 'height:100%',
            'background:#1b4332',
            'display:flex', 'flex-direction:column',
            'overflow-y:auto',
            'box-shadow:-4px 0 20px rgba(0,0,0,0.3)'
        ].join(';');

        // Close (✕) button top-right in drawer
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '\u00d7';
        closeBtn.style.cssText = 'align-self:flex-end;background:none;border:none;color:rgba(255,255,255,0.8);font-size:2.2rem;cursor:pointer;line-height:1;padding:18px 20px 10px';
        closeBtn.addEventListener('click', destroyOverlay);
        drawer.appendChild(closeBtn);

        // Nav link list — handles both normal links and dropdown groups
        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style:none;margin:0;padding:0;width:100%';
        navLinks.querySelectorAll(':scope > li').forEach(origLi => {
            if (origLi.classList.contains('nav-dropdown')) {
                // Section label for Members
                const labelLi = document.createElement('li');
                labelLi.style.cssText = 'border-top:1px solid rgba(255,255,255,0.12)';
                const label = document.createElement('span');
                label.textContent = 'Members';
                label.style.cssText = 'display:block;color:rgba(255,255,255,0.5);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:14px 24px 6px';
                labelLi.appendChild(label);
                ul.appendChild(labelLi);
                // Sub-items
                origLi.querySelectorAll('.nav-dropdown-menu a').forEach(subA => {
                    const subLi = document.createElement('li');
                    subLi.style.cssText = 'border-top:1px solid rgba(255,255,255,0.08)';
                    const a = document.createElement('a');
                    a.href = subA.href;
                    a.textContent = subA.textContent;
                    a.style.cssText = ['display:block', 'color:rgba(255,255,255,0.9)', 'font-size:1rem', 'font-weight:600', 'padding:13px 24px 13px 38px', 'text-decoration:none', 'letter-spacing:0.02em'].join(';');
                    a.addEventListener('click', destroyOverlay);
                    subLi.appendChild(a);
                    ul.appendChild(subLi);
                });
            } else {
                const origA = origLi.querySelector('a');
                if (!origA) return;
                const li = document.createElement('li');
                li.style.cssText = 'border-top:1px solid rgba(255,255,255,0.12)';
                const a = document.createElement('a');
                a.href = origA.href;
                a.textContent = origA.textContent;
                a.style.cssText = ['display:block', 'color:rgba(255,255,255,0.9)', 'font-size:1.05rem', 'font-weight:600', 'padding:16px 24px', 'text-decoration:none', 'letter-spacing:0.02em'].join(';');
                a.addEventListener('click', destroyOverlay);
                li.appendChild(a);
                ul.appendChild(li);
            }
        });
        drawer.appendChild(ul);
        backdrop.appendChild(drawer);
        return backdrop;
    }

    function destroyOverlay() {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        overlay = null;
        navToggle.textContent = '\u2630';
        navToggle.style.color = '';
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        if (overlay) { destroyOverlay(); return; }
        overlay = buildOverlay();
        document.body.appendChild(overlay);
        navToggle.textContent = '\u00d7';
        navToggle.style.color = '#1b4332';
        document.body.style.overflow = 'hidden';
    });
})();




/* --- INFINITE LOOP \"Latest News\" Image Carousel --- */
(function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const nextBtn = document.querySelector('.carousel-button.next');
    const prevBtn = document.querySelector('.carousel-button.prev');

    // Get all real slides
    const realSlides = Array.from(track.children);
    const total = realSlides.length;
    if (total === 0) return;

    // Clone first and last for the seamless wrap illusion
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[total - 1].cloneNode(true);
    firstClone.classList.add('carousel-clone');
    lastClone.classList.add('carousel-clone');
    track.appendChild(firstClone);   // at the end
    track.insertBefore(lastClone, track.firstChild); // at the start

    // Switch the track from scroll-snap to transform-based movement
    track.style.display = 'flex';
    track.style.overflowX = 'visible';
    track.style.overflowY = 'visible';
    track.style.scrollSnapType = 'none';
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // Contain the overflowing track inside the container
    const container = track.closest('.carousel-container') || track.parentElement;
    container.style.overflow = 'hidden';

    let currentIndex = 1; // Start at index 1 (the first REAL slide, after the clone)
    let isTransitioning = false;

    const getSlideWidth = () => track.children[0].getBoundingClientRect().width;

    const goTo = (index, animated = true) => {
        if (!animated) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        track.style.transform = `translateX(-${index * getSlideWidth()}px)`;
        currentIndex = index;
    };

    // Position to first real slide immediately (no animation)
    goTo(1, false);

    // After the animated transition ends, silently jump if on a clone
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === 0) {
            // Was on the last-clone at the beginning → jump to real last slide
            goTo(total, false);
        } else if (currentIndex === total + 1) {
            // Was on the first-clone at the end → jump to real first slide
            goTo(1, false);
        }
    });

    const next = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        goTo(currentIndex + 1);
    };

    const prev = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        goTo(currentIndex - 1);
    };

    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    // Auto-slide every 4 seconds
    let autoTimer;
    const startAuto = () => { autoTimer = setInterval(next, 4000); };
    const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

    startAuto();

    // Pause on hover
    container.addEventListener('mouseenter', () => clearInterval(autoTimer));
    container.addEventListener('mouseleave', startAuto);

    // Recalculate on window resize so slide widths stay accurate
    window.addEventListener('resize', () => goTo(currentIndex, false));
})();


// --- Sticky Header Scroll Effect ---
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// --- Scroll Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// --- PDF Modal Logic ---
const pdfModal = document.getElementById('pdf-modal');
if (pdfModal) {
    const pdfIframe = document.getElementById('pdf-iframe');
    const closeBtn = document.querySelector('.modal-close');
    const documentLinks = document.querySelectorAll('.document-card');

    documentLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Always prevent default navigation completely 
            const pdfUrl = link.getAttribute('data-pdf') || link.getAttribute('href');
            if (pdfUrl && pdfUrl.endsWith('.pdf')) {
                pdfIframe.src = pdfUrl;
                pdfModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    const closeModal = () => {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { pdfIframe.src = ''; }, 400); // Clear memory/iframe after closing
    };

    closeBtn.addEventListener('click', closeModal);
    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) closeModal();
    });
}

// --- Global helper: open video modal by ID (used by home page sermon cards) ---
function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    if (!modal || !iframe || !videoId) return;
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

// --- Video Modal Logic ---
const videoModal = document.getElementById('video-modal');
if (videoModal) {
    const videoIframe = document.getElementById('video-iframe');
    const closeBtn = videoModal.querySelector('.modal-close');
    const sermonRows = document.querySelectorAll('.sermon-row');

    sermonRows.forEach(row => {
        row.addEventListener('click', () => {
            const playBtn = row.querySelector('.play-button');
            if (playBtn) {
                const videoId = playBtn.getAttribute('data-video');
                if (videoId) {
                    // Autoplay enabled with privacy-enhanced mode to bypass browser 'connection dropped' errors
                    videoIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    document.documentElement.style.overflow = 'hidden';
                } else {
                    showComingSoonToast();
                }
            }
        });
    });

    const closeModal = () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setTimeout(() => { videoIframe.src = ''; }, 400);
    };

    closeBtn.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });
}

// --- Nested Accordion Logic (Sermons Page) ---
const setupAccordions = () => {
    const bindAccordion = (btnSelector, panelSelector) => {
        const accordions = document.querySelectorAll(btnSelector);
        accordions.forEach(acc => {
            acc.addEventListener('click', function () {
                // Toggle active class for icon formatting
                this.classList.toggle('active-accordion');

                // Toggle max-height for smooth opening
                let panel = this.nextElementSibling;
                if (panel && panel.classList.contains(panelSelector)) {
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";

                        // If this is a nested level-2 panel, we must also expand the parent level-1 panel 
                        // so it doesn't clip the new height
                        let parentPanel = this.closest('.panel-lvl-1');
                        if (parentPanel && parentPanel.style.maxHeight) {
                            parentPanel.style.maxHeight = (parentPanel.scrollHeight + panel.scrollHeight) + "px";
                        }
                    }
                }
            });
        });
    };

    bindAccordion('.accordion-lvl-1', 'panel-lvl-1');
    bindAccordion('.accordion-lvl-2', 'panel-lvl-2');
};
setupAccordions();

// --- Universal Image Lightbox ---
const setupImageLightbox = () => {
    // Only create one lightbox per page
    if (document.getElementById('img-lightbox')) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'img-lightbox';
    lightbox.className = 'lightbox-overlay';

    const img = document.createElement('img');
    img.className = 'lightbox-image';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close image');

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    // CRITICAL: Append to <html>, not <body>.
    // Elements inside <body> may have CSS transforms which create a new stacking context
    // and cause position:fixed to stop working correctly on iOS Safari.
    document.documentElement.appendChild(lightbox);

    // Block scroll on the overlay itself
    lightbox.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    lightbox.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

    // Attach to images that are prominent/content
    const imagesToExpand = document.querySelectorAll(
        '.card-image-icon, .carousel-slide img, .leader-card img, .hero-image img, .about-hero-image img, .welcome-image img, .content-section img'
    );

    imagesToExpand.forEach(image => {
        image.classList.add('zoomable-image');
        image.addEventListener('click', () => {
            img.src = image.src;

            // Lock both html and body to prevent ANY scrolling
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            // Force exact current viewport pixel size — bypasses ALL CSS unit inconsistencies
            lightbox.style.width = window.innerWidth + 'px';
            lightbox.style.height = window.innerHeight + 'px';

            lightbox.classList.add('active');
        });
    });

    const closeLightBox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            img.src = '';
        }, 350);
    };

    closeBtn.addEventListener('click', closeLightBox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightBox();
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageLightbox);
} else {
    setupImageLightbox();
}

// --- Dynamic Icon Styling Fix ---
document.querySelectorAll('.footer-social-icons img').forEach(img => {
    img.src = img.src.replace('/color/48/', '/ios-filled/50/ffffff/').replace('--v1', '');
});

// --- Mailchimp JSONP Background Submission ---
// Works for both footer and contact page forms.
// Converts the form action from /post to /post-json and submits via JSONP
// so the page never redirects. Shows an inline success/error message.

function mailchimpAjaxSubmit(form) {
    const emailInput = form.querySelector('input[name="EMAIL"]');
    const submitBtn = form.querySelector('[type="submit"]');
    let msgBox = form.querySelector('.mc-response-msg');
    if (!msgBox) {
        msgBox = document.createElement('p');
        msgBox.className = 'mc-response-msg';
        msgBox.style.cssText = 'margin: 10px 0 0; font-size: 0.88rem; font-weight: 600; display:none;';
        form.appendChild(msgBox);
    }

    const showMsg = (text, isSuccess) => {
        msgBox.textContent = text;
        msgBox.style.color = isSuccess ? '#2d7a4f' : '#c0392b';
        msgBox.style.display = 'block';
    };

    if (!emailInput || !emailInput.value.trim()) {
        showMsg('Please enter a valid email address.', false);
        return;
    }

    // Use FormData to capture ALL form fields reliably (EMAIL, FNAME, LNAME, honeypot)
    const formData = new FormData(form);
    const cbName = 'mcCallback_' + Date.now();

    // Build base URL: /post → /post-json
    // Strip f_id — Mailchimp's newer form API (f_id) ignores FNAME/LNAME via JSONP.
    // The classic endpoint (no f_id) fully supports all merge fields.
    const baseUrl = form.action
        .replace('/post?', '/post-json?')
        .replace(/[&?]f_id=[^&]*/g, ''); // remove f_id param entirely

    // Append all form fields as query params
    const params = new URLSearchParams();
    for (const [key, val] of formData.entries()) {
        params.append(key, val);
    }

    // Explicitly ensure FNAME and LNAME are included (override FormData if needed)
    const fnameEl = form.querySelector('[name="FNAME"]');
    const lnameEl = form.querySelector('[name="LNAME"]');
    if (fnameEl && fnameEl.value.trim()) params.set('FNAME', fnameEl.value.trim());
    if (lnameEl && lnameEl.value.trim()) params.set('LNAME', lnameEl.value.trim());

    params.set('c', cbName); // JSONP callback name

    const fullUrl = baseUrl + '&' + params.toString();

    // Debug: open browser DevTools → Console to see this
    console.log('[Mailchimp] Fields captured:');
    for (const [key, val] of formData.entries()) {
        console.log(`  ${key} = "${val}"`);
    }
    console.log('[Mailchimp] Full URL:', fullUrl);

    // Loading state
    const origLabel = submitBtn.textContent.trim();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // JSONP: Mailchimp calls window[cbName](data) with the result
    window[cbName] = (data) => {
        delete window[cbName];
        document.getElementById(cbName + '_script')?.remove();
        submitBtn.textContent = origLabel;
        submitBtn.disabled = false;

        if (data.result === 'success') {
            showMsg('✓ You\'re subscribed! Thank you for joining us.', true);
            form.reset(); // clear all fields
        } else {
            const raw = data.msg || 'Something went wrong. Please try again.';
            const clean = raw.replace(/<[^>]+>/g, '').replace(/^\d+ - /, '');
            showMsg(clean, false);
        }
    };

    const script = document.createElement('script');
    script.id = cbName + '_script';
    script.src = fullUrl;
    document.body.appendChild(script);
}


// --- Dynamic Newsletter Injection for Footer ---
const footerGrid = document.querySelector('.footer-grid');
if (footerGrid && !document.querySelector('.newsletter-col')) {
    const newsletterCol = document.createElement('div');
    newsletterCol.className = 'footer-column newsletter-col';
    newsletterCol.innerHTML = `
        <h3>Church Updates</h3>
        <p>Get sermon notes, announcements, and resources delivered to your inbox.</p>
        <form id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form"
              action="https://gmail.us18.list-manage.com/subscribe/post?u=9df92459c65bb46827396c56f&amp;id=229728f334&amp;f_id=006cb2e6f0"
              method="post" novalidate
              style="display:flex;flex-direction:column;gap:10px;margin-top:15px;">
            <input type="text" name="FNAME" placeholder="First Name" required
                   style="padding:10px 15px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;width:100%;box-sizing:border-box;outline:none;">
            <input type="text" name="LNAME" placeholder="Last Name" required
                   style="padding:10px 15px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;width:100%;box-sizing:border-box;outline:none;">
            <input type="email" name="EMAIL" id="mce-EMAIL" placeholder="Email Address" required
                   style="padding:10px 15px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;width:100%;box-sizing:border-box;outline:none;">
            <div style="position:absolute;left:-5000px;" aria-hidden="true">
                <input type="text" name="b_9df92459c65bb46827396c56f_229728f334" tabindex="-1" value="">
            </div>
            <button type="submit" name="subscribe" id="mc-embedded-subscribe"
                    style="background:var(--accent-color);color:#1b4332;border:none;padding:10px;border-radius:4px;font-weight:bold;cursor:pointer;transition:opacity 0.3s ease;">
                Subscribe
            </button>
        </form>
    `;
    footerGrid.appendChild(newsletterCol);

    // Attach AJAX handler to footer form
    const footerForm = newsletterCol.querySelector('form');
    footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        mailchimpAjaxSubmit(footerForm);
    });
}

// Attach AJAX handler to contact page form (if present)
const contactForm = document.getElementById('contact-subscribe-form');
if (contactForm) {
    contactForm.removeAttribute('target'); // no longer opening a new tab
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        mailchimpAjaxSubmit(contactForm);
    });
}


// --- Custom Toast Setup ---
function showComingSoonToast() {
    let toast = document.getElementById('coming-soon-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'coming-soon-toast';
        toast.className = 'custom-toast';
        toast.textContent = 'Coming Soon! This sermon video has not been released yet.';
        document.body.appendChild(toast);
    }

    toast.classList.add('show');

    if (toast.hideTimeout) clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}