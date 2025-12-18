document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .step-item, .badge, .tech, .chip-sm');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    initTelemetry();

    // Chip Hover Telemetry (Track interest in soft skills)
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('mouseenter', () => {
            // Optional: You could log this to the telemetry stats if desired
            // console.log("Hovering chip:", chip.textContent);
        });
    });
});

// Core Telemetry Initialization
function initTelemetry() {
    const sessionIdDisplay = document.getElementById('session-id');
    const engagementDisplay = document.getElementById('engagement-time');
    const vectorDisplay = document.getElementById('feature-vector');
    const archetypeDisplay = document.getElementById('archetype-val');

    // Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuXxYZ3vIeRilqnwlg72jUn_Pb9zuJTTLT-0EqF4D90Sn1zDxh5VsAxcockohQTUUC/exec';

    // Generate simulated Session ID
    const sessionId = 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    sessionIdDisplay.textContent = sessionId;

    let startTime = Date.now();
    let scrollSpeed = 0;

    // Feature Vector Data
    let stats = {
        speed: 0,
        depth: 0,
        clicks: 0,
        reversals: 0,
        timeOnProjects: 0
    };

    let lastScrollTop = 0;
    let lastScrollTime = Date.now();
    let currentSection = 'ABOUT';
    let scrollDirection = 1; // 1 down, -1 up

    // Cloud Sync State
    // Heartbeat state

    // Update Engagement Time
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        engagementDisplay.textContent = `${h}:${m}:${s}`;

        // Track time specifically on projects
        if (currentSection === 'PROJECTS') {
            stats.timeOnProjects += 1;
        }

        updateAnalysis();

        // Auto-save data every 15 seconds (Heartbeat)
        if (elapsed % 15 === 0 && elapsed > 0 && GOOGLE_SCRIPT_URL) {
            sendTelemetry();
        }
    }, 1000);

    // Event Listeners
    window.addEventListener('click', () => {
        stats.clicks++;
        updateAnalysis();
    });

    // Send data on page unload (Beacon)
    window.addEventListener('beforeunload', () => {
        if (GOOGLE_SCRIPT_URL) {
            const data = JSON.stringify(getPayload());
            const blob = new Blob([data], { type: 'text/plain' });
            navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob);
        }
    });

    function getPayload() {
        return {
            sessionId: sessionId,
            archetype: archetypeDisplay.textContent,
            speed: stats.speed.toFixed(2),
            depth: stats.depth.toFixed(2),
            clicks: stats.clicks,
            timeOnProjects: stats.timeOnProjects
        };
    }

    function sendTelemetry() {
        if (!GOOGLE_SCRIPT_URL) return;

        const payload = getPayload();

        // Use fetch with no-cors mode and text/plain to avoid Preflight
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        }).then(() => {
            console.log("Telemetry Heartbeat sent.");
            // UI Update: Status Line
            const statusEl = document.getElementById('telemetry-status');
            if (statusEl) {
                statusEl.textContent = "CLOUD_SYNCED [ACTIVE]";
                statusEl.style.color = "#00ff00";
            }
        }).catch(err => {
            console.error("Telemetry Error:", err);
            const statusEl = document.getElementById('telemetry-status');
            if (statusEl) statusEl.textContent = "SYNC_FAILED";
        });
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const now = Date.now();
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPct = scrollTop / docHeight;

        if (scrollPct > stats.depth) stats.depth = scrollPct;

        const timeDiff = now - lastScrollTime;
        if (timeDiff > 50) {
            const diff = scrollTop - lastScrollTop;
            const newDirection = diff > 0 ? 1 : -1;

            // Detect Reversal (Scrolled down, then went back up -> Interest)
            if (newDirection !== scrollDirection && Math.abs(diff) > 10) {
                stats.reversals++;
                scrollDirection = newDirection;
            }

            stats.speed = Math.abs(diff) / timeDiff; // px/ms
            lastScrollTop = scrollTop;
            lastScrollTime = now;
        }

        detectSection();
        updateAnalysis();
    });

    // Unsupervised Classification Logic (Heuristic Clustering)
    function updateAnalysis() {
        // Feature Vector: [AvgSpeed, MaxDepth, Clicks, Reversals, ProjectTime]
        const vector = [
            stats.speed.toFixed(2),
            stats.depth.toFixed(2),
            stats.clicks,
            stats.reversals,
            stats.timeOnProjects
        ];

        vectorDisplay.textContent = `[${vector.join(', ')}]`;

        // Classification Heuristics
        let archetype = "ANALYZING...";

        if (stats.speed > 1.5 && stats.timeOnProjects < 5) {
            archetype = "RAPID_SKIMMER";
        }
        else if (stats.timeOnProjects > 10 || (stats.reversals > 5 && stats.depth > 0.3)) {
            archetype = "TECHNICAL_AUDITOR";
        }
        else if (stats.speed < 0.5 && stats.speed > 0 && stats.depth > 0.1) {
            archetype = "CAREFUL_READER";
        }
        else if (stats.clicks > 2 && stats.depth > 0.8) {
            archetype = "ENGAGED_RECRUITER";
        }
        else {
            archetype = "GENERAL_VISITOR";
        }

        archetypeDisplay.textContent = archetype;
    }

    function detectSection() {
        const sections = ['about', 'projects', 'experience', 'education', 'contact'];
        let maxVisibleSection = 'ABOUT';
        let maxVisibleArea = 0;

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                if (visibleHeight > maxVisibleArea) {
                    maxVisibleArea = visibleHeight;
                    maxVisibleSection = id.toUpperCase();
                }
            }
        });
        currentSection = maxVisibleSection;
    }
}
