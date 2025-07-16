document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // --- Header Hide on Scroll ---
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        header.style.top = (scrollTop > lastScrollTop) ? "-80px" : "0";
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        header.style.boxShadow = (window.scrollY > 50) ? '0 10px 30px -10px rgba(0,0,0,0.7)' : 'none';
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
    
    // --- Case Study Modal Logic ---
    const caseStudyModal = document.getElementById('case-study-modal');
    const caseStudyContent = document.getElementById('case-study-content');
    const caseStudyButtons = document.querySelectorAll('.case-study-btn');
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
        caseStudyModal.classList.add('visible');
    }

    caseStudyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const projectId = e.currentTarget.closest('.project-card').dataset.projectId;
            openModal(projectId);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        caseStudyModal.classList.remove('visible');
    });

    caseStudyModal.addEventListener('click', (e) => {
        if (e.target === caseStudyModal) {
            caseStudyModal.classList.remove('visible');
        }
    });

    // --- Dark to Light Theme Transition ---
    const aboutSection = document.querySelector('#about');
    const body = document.body;

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When the 'About' section is intersecting (scrolling down into it)
            if (entry.isIntersecting) {
                body.classList.add('light-theme');
            } 
            // When it's NOT intersecting
            else {
                // Check if we are scrolling back up into the hero section
                if (window.scrollY < aboutSection.offsetTop / 2) {
                   body.classList.remove('light-theme');
                }
            }
        });
    }, { 
        threshold: 0.01, // Trigger as soon as a tiny part is visible
        rootMargin: "-100px 0px -100px 0px" // Adjust trigger area
    });

    themeObserver.observe(aboutSection);
    
    // --- Vanilla Tilt & Scroll Observers ---
    VanillaTilt.init(document.querySelectorAll(".project-card"), { max: 5, speed: 400, glare: true, "max-glare": 0.2 });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // For skill bars
                if (entry.target.id === 'skills') {
                    entry.target.querySelectorAll('.skill-level').forEach(skill => {
                        skill.style.width = skill.dataset.level + '%';
                    });
                }
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
