document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Modal Functionality
    const modal = document.getElementById('detectionModal');
    const getStartedBtns = document.querySelectorAll('#getStartedBtn, #ctaGetStarted');
    const closeModal = document.querySelector('.close-modal');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const sensitivitySlider = document.getElementById('sensitivity');

    // Open modal
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close when clicking outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // File upload functionality
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('highlight');
    }

    function unhighlight() {
        uploadArea.classList.remove('highlight');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        if (files.length) {
            const file = files[0];
            fileInfo.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
            fileInfo.style.display = 'block';
            analyzeBtn.disabled = false;
            
            // Update upload area appearance
            uploadArea.querySelector('h3').textContent = 'File Ready for Analysis';
            uploadArea.querySelector('p').textContent = 'Click "Analyze Media" to begin detection';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Sensitivity slider
    sensitivitySlider.addEventListener('input', () => {
        const value = sensitivitySlider.value;
        let sensitivityText;
        
        if (value < 30) {
            sensitivityText = `Low (${value})`;
        } else if (value < 70) {
            sensitivityText = `Medium (${value})`;
        } else {
            sensitivityText = `High (${value})`;
        }
        
        document.querySelector('.slider-labels span:first-child').textContent = sensitivityText;
    });

    // Animate stats counting
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.includes('%') ? '%' : '';
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            
            let current = start;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats();
                }
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-stats, .feature-card, .tech-step, .analytics-card').forEach(el => {
        observer.observe(el);
    });

    // Floating nodes animation
    const visualNodes = document.querySelectorAll('.visual-node');
    visualNodes.forEach((node, index) => {
        node.style.animation = `float ${4 + index}s ease-in-out infinite`;
    });
});