document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // --- Header Hide on Scroll (Optimized) ---
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                header.style.top = (scrollTop > lastScrollTop) ? "-80px" : "0";
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                header.style.boxShadow = (window.scrollY > 50) ? '0 10px 30px -10px rgba(0,0,0,0.7)' : 'none';
                ticking = false;
            });
            ticking = true;
        }
    });

    // --- Typing Effect ---
    const typingElement = document.getElementById('typing-effect');
    const textArray = ["I build things for the web and beyond.", "I turn ideas into reality.", "I love to solve complex problems."];
    let textArrayIndex = 0, charIndex = 0;
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typingElement.textContent += textArray[textArrayIndex].charAt(charIndex++);
            setTimeout(type, 70);
        } else {
            setTimeout(erase, 2000);
        }
    }
    function erase() {
        if (charIndex > 0) {
            typingElement.textContent = textArray[textArrayIndex].substring(0, --charIndex);
            setTimeout(erase, 40);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, 500);
        }
    }
    type();

    // --- Project Card Hover Glow Effect (Optimized) ---
    document.querySelectorAll('.project-card').forEach(card => {
        let ticking = false;
        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    ticking = false;
                });
                ticking = true;
            }
        });
    });

    // --- Case Study Modal Logic ---
    const caseStudyModal = document.getElementById('case-study-modal');
    const caseStudyContent = document.getElementById('case-study-content');
    const closeModalBtn = document.querySelector('#case-study-modal .modal-close-btn');

    const caseStudies = {
        'radiance-ai': {
            title: 'Case Study: RadianceAI Forecasting Engine',
            role: 'AI Engineer',
            process: `
                <p>This project's goal was to create a system that could not only forecast solar irradiance but also provide contextual insights by leveraging Large Language Models (LLMs).</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why Retrieval-Augmented Generation (RAG)?</strong> - A simple forecast is useful, but a forecast contextualized with domain-specific knowledge is powerful. I implemented a RAG pipeline using Llama-2 to query thousands of indexed documents, allowing the model to explain its predictions based on relevant reports.</li>
                    <li><strong>Why FAISS & Chroma?</strong> - For the vector database component of RAG, I tested both FAISS for raw speed and Chroma for ease of use. This dual-testing ensured the final system had a highly optimized retrieval mechanism, achieving 30% faster lookups.</li>
                </ul>
            `,
            outcome: '<p>Optimized photovoltaic (PV) system efficiency by <strong>15%</strong> and reduced manual analysis time by <strong>40%</strong> through an interactive Streamlit dashboard.</p>'
        },
        'photonimbus': {
            title: 'Case Study: Photonimbus Photo Sharing App',
            role: 'Cloud & Backend Developer',
            process: `
                <p>The challenge was to build a fully cloud-native application that was both highly scalable and secure, using modern CI/CD practices for deployment.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why Google Cloud Run & Docker?</strong> - Containerizing the Django backend with Docker provided a portable and consistent environment. Deploying on Cloud Run allowed for serverless, auto-scaling infrastructure, minimizing costs and operational overhead.</li>
                    <li><strong>Why JWT Authentication?</strong> - For a secure and stateless authentication mechanism suitable for REST APIs, JSON Web Tokens (JWT) were the ideal choice. This decoupled the Angular frontend from the backend, improving security and flexibility.</li>
                </ul>
            `,
            outcome: '<p>Improved API performance by <strong>30%</strong> using indexed queries and connection pooling, deployed on a scalable, serverless cloud architecture.</p>'
        },
        'covid-dashboard': {
            title: 'Case Study: COVID Tracking Dashboard',
            role: 'Full-Stack Developer',
            process: `
                <p>The primary technical hurdle was to visualize a massive, constantly updating dataset of COVID-19 cases on a map with near-instantaneous filtering capabilities.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why Spring Boot & PostGIS?</strong> - Spring Boot provided a robust, high-performance Java backend. Integrating PostGIS with PostgreSQL enabled powerful and efficient spatial queries, which were essential for mapping the geographic data.</li>
                    <li><strong>Why Materialized Views?</strong> - To ensure filter latency remained under 100ms, I implemented materialized views in the database. This pre-calculated complex aggregations, allowing the API to serve data to the Angular frontend almost instantly.</li>
                </ul>
            `,
            outcome: '<p>Delivered a real-time analytics dashboard with <strong>&lt;100ms filter latency</strong> and <strong>99% uptime</strong>, capable of visualizing large-scale spatial data.</p>'
        },
        'citation-prediction': {
            title: 'Case Study: Citation Prediction Count',
            role: 'Lead Developer & ML Engineer',
            process: `
                <p>The project began with extensive data collection, gathering a dataset of 277 AI papers. The core challenge was to engineer features that could accurately represent a paper's potential for impact.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why a Neural Network & k-NN?</strong> - I chose a hybrid approach. The neural network could capture complex, non-linear relationships in the data, while k-NN provided a robust, instance-based comparison, improving overall prediction accuracy.</li>
                    <li><strong>Why a Distributed Pipeline?</strong> - To handle the data preprocessing and model training efficiently, I designed an object-oriented, distributed pipeline. This allowed for scalable execution and made the system robust enough for larger datasets in the future.</li>
                </ul>
            `,
            outcome: '<p>Achieved <strong>93% accuracy</strong> in predicting citation counts, providing a valuable tool for academic research analysis.</p>'
        },
        'plant-disease': {
            title: 'Case Study: Plant Disease Detection',
            role: 'Full-Stack Developer',
            process: `
                <p>The primary goal was to create a user-friendly application that could be used by farmers with limited technical expertise. The backend needed to be powerful enough to handle image processing and ML inference quickly.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why Django?</strong> - Django's "batteries-included" framework was ideal for rapid development. Its robust ORM and security features provided a solid foundation for the application.</li>
                    <li><strong>Why a Distributed System?</strong> - For scalability, I designed a distributed architecture to handle concurrent image uploads and processing requests. This ensured the app remained responsive even under heavy load. An ML model for weather prediction was also integrated to provide holistic farmer assistance.</li>
                </ul>
            `,
            outcome: '<p>Delivered a deep learning application with <strong>83% accuracy</strong> in disease detection, empowering farmers to make timely decisions.</p>'
        },
        'recall-manager': {
            title: 'Case Study: RECALL - Secure Manager',
            role: 'Cloud & Backend Developer',
            process: `
                <p>The project focused on two main pillars: security and performance. Users needed to trust the app with sensitive information, and they expected fast, seamless access across all their devices.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why AWS (EC2, RDS, Route53)?</strong> - Leveraging AWS provided a scalable, reliable, and secure infrastructure. EC2 offered flexible compute, RDS managed the database with automated backups, and Route53 ensured reliable domain routing.</li>
                    <li><strong>Why PHP & MySQL?</strong> - This classic stack was chosen for its stability and the vast amount of community support, which accelerated development. The focus was on writing clean, optimized queries to achieve our performance goals.</li>
                </ul>
            `,
            outcome: '<p>Launched a secure, cloud-native application with <strong>30% faster data retrieval</strong> compared to initial benchmarks.</p>'
        },
        'tunegenie': {
            title: 'Case Study: TuneGenie — AI‑Powered Music Recommender',
            role: 'Full‑Stack AI Engineer',
            process: `
                <p>The goal was instant, on‑theme playlists from natural prompts (mood, activity, language). I combined collaborative filtering (SVD) for reliable personalization with an LLM refinement layer to align tracks to context. A multi‑agent workflow coordinates Spotify data retrieval, candidate generation, and AI enhancement with graceful fallbacks when APIs aren't available.</p>
                <p>I built a streamlined Streamlit UI and an offline evaluation harness to compare raw CF vs LLM‑refined lists on cohesion and target alignment. Large scenario suites ("playlist", "ultimate", "ultra‑deep") stress the system and prevent regressions.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why Streamlit?</strong> – Rapid iteration, quick product loops, simple deployment.</li>
                    <li><strong>Why Hybrid CF + LLM?</strong> – CF for stable personalization; LLM to keep playlists "on‑brief."</li>
                    <li><strong>Why Multi‑agent & Fallbacks?</strong> – Reliability under API failures and clearer observability.</li>
                    <li><strong>Why Offline Evaluation?</strong> – Deterministic comparisons and scalable scenario testing.</li>
                </ul>
            `,
            outcome: '<p>Delivered an AI playlist engine with <strong>97.73% success</strong> (44‑scenario suite), <strong>94.46%</strong> across 6,355 "ultimate" scenarios, and <strong>89.69%</strong> across 5,080 ultra‑deep scenarios.</p>'
        },
        'smartnotes': {
            title: 'Case Study: SmartNotes - Cross-Device Universal iOS App',
            role: 'iOS Developer / Software Engineer',
            process: `
                <p>The goal was to build a secure, high-performance note-taking app that seamlessly syncs across iPhone and iPad devices while maintaining data privacy and delivering smooth 60fps performance even with large note collections.</p>
                <h4>Key Decisions:</h4>
                <ul>
                    <li><strong>Why MVVM with Combine Framework?</strong> - MVVM architecture with Combine framework provides reactive bindings that keep the UI layer isolated from business logic. This separation enables testability and maintainability while allowing real-time updates across the app through reactive data streams.</li>
                    <li><strong>Why Protocol-Oriented Programming?</strong> - Protocol-oriented design enabled testability and maintainability by defining clear contracts between components. This approach made it easier to mock dependencies, write unit tests, and swap implementations without affecting other parts of the system.</li>
                    <li><strong>Why Lazy Loading with Prefetching?</strong> - Implemented lazy loading with prefetching for memory efficiency, reducing base memory to ~15MB and maintaining smooth 60fps scrolling with 1000+ notes. Dynamic cell sizing adapts to content without layout issues, ensuring optimal performance even with large datasets.</li>
                    <li><strong>Why Progressive Biometric Authentication Fallback?</strong> - Integrated biometric authentication (Face ID/Touch ID) with a fallback to passcode, storing keys in Keychain. Added AES-256 encryption for sensitive notes to protect user data, ensuring maximum security while maintaining user convenience.</li>
                    <li><strong>Why Background Sync with Exponential Backoff?</strong> - Reduced sync latency by 60% through intelligent background sync with exponential backoff retry logic. This ensures reliable cross-device synchronization even under poor network conditions, providing a seamless user experience across devices.</li>
                </ul>
            `,
            outcome: '<p>Delivered a high-performance universal iOS app: <strong>Reduced memory footprint by 70%</strong> (from ~50MB to ~15MB base) through optimized lazy loading; <strong>Achieved consistent 60fps scrolling</strong> performance with 1000+ notes; <strong>Implemented comprehensive test coverage</strong> (72 unit tests) covering CRUD operations, edge cases, and security; <strong>Built universal app</strong> supporting both iPhone and iPad with adaptive layouts and drag-and-drop gestures; <strong>Reduced sync latency by 60%</strong> through intelligent background sync; <strong>Enhanced security</strong> with biometric authentication and end-to-end encryption (AES-256).</p>'
        }
    };

    function openModal(projectId) {
        const data = caseStudies[projectId];
        if (!data) return;

        caseStudyContent.innerHTML = `
            <h3>${data.title}</h3>
            <h4>My Role</h4>
            <p>${data.role}</p>
            <h4>The Process & Key Decisions</h4>
            ${data.process}
            <div class="outcome">
                <h4>The Outcome</h4>
                ${data.outcome}
            </div>
        `;

        // Prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';

        caseStudyModal.classList.add('visible');
    }

    function closeModal() {
        caseStudyModal.classList.remove('visible');

        // Restore layout
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }, 300);
    }

    caseStudyModal.addEventListener('click', (e) => {
        if (e.target === caseStudyModal) {
            closeModal();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    // Use event delegation for case study clicks (whole card)
    document.addEventListener('click', (e) => {
        const projectCard = e.target.closest('.project-card');
        if (projectCard) {
            const projectId = projectCard.dataset.projectId;
            openModal(projectId);
        }
    });

    // --- Skill Radar Chart ---
    const ctx = document.getElementById('skillRadar').getContext('2d');

    let skillRadarChart;

    function createGradient(ctx, colorStart, colorEnd) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    }

    function initChart(isLight) {
        const textColor = isLight ? '#111827' : '#EAEAEA';
        const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
        const accentColor = '#6366f1'; // Indigo stays the same
        const bgGradient = createGradient(ctx, 'rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 0.05)');

        if (skillRadarChart) {
            skillRadarChart.destroy();
        }

        skillRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['AI & ML', 'Backend', 'Frontend', 'Cloud/DevOps', 'Security', 'System Design'],
                datasets: [{
                    label: 'Skill Level',
                    data: [95, 90, 75, 85, 80, 85],
                    backgroundColor: bgGradient,
                    borderColor: accentColor,
                    borderWidth: 3,
                    pointBackgroundColor: accentColor,
                    pointBorderColor: isLight ? '#fff' : '#111',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: accentColor,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: {
                            color: textColor,
                            font: {
                                family: "'Outfit', sans-serif",
                                size: 14,
                                weight: '600'
                            },
                            backdropPadding: 10
                        },
                        ticks: { display: false, maxTicksLimit: 5 },
                        suggestedMin: 20,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(28, 28, 28, 0.95)',
                        titleColor: isLight ? '#111' : '#fff',
                        bodyColor: isLight ? '#444' : '#ccc',
                        borderColor: accentColor,
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                const skillTechs = {
                                    'AI & ML': 'Python, PyTorch, TensorFlow, RAG',
                                    'Backend': 'Django, Node.js, PostgreSQL, Redis',
                                    'Frontend': 'React, Angular, Tailwind, TypeScript',
                                    'Cloud/DevOps': 'AWS, Docker, Kubernetes, CI/CD',
                                    'Security': 'OAuth, JWT, Penetration Testing',
                                    'System Design': 'Microservices, Distributed Systems'
                                };
                                return skillTechs[context.label] || '';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Initialize with current theme
    initChart(document.body.classList.contains('light-theme'));

    // --- Dark to Light Theme Transition ---
    const aboutSection = document.querySelector('#about');
    const body = document.body;

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                body.classList.add('light-theme');
                initChart(true); // Switch chart to Light Mode
            }
            else {
                if (window.scrollY < aboutSection.offsetTop / 2) {
                    body.classList.remove('light-theme');
                    initChart(false); // Switch chart to Dark Mode
                }
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: "-100px 0px -100px 0px"
    });

    themeObserver.observe(aboutSection);

    // --- Vanilla Tilt & Scroll Observers ---
    VanillaTilt.init(document.querySelectorAll(".project-card"), { max: 5, speed: 400, glare: true, "max-glare": 0.2 });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('reveal-on-scroll');
        scrollObserver.observe(section);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-on-scroll { opacity: 0; transform: translateY(50px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
});

// --- Expandable Details Logic ---
function toggleDetails(btn) {
    const detailsDiv = btn.nextElementSibling;
    detailsDiv.classList.toggle('open');
    btn.classList.toggle('open');

    // Update button text
    if (detailsDiv.classList.contains('open')) {
        btn.innerHTML = 'Hide Details <i class="fas fa-chevron-up"></i>';
    } else {
        btn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
    }
}
