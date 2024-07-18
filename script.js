document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('doodleCanvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const saveButton = document.getElementById('saveButton');
    const undoButton = document.getElementById('undoButton');
    const playButton = document.getElementById('playButton');
    const prompt = document.getElementById('prompt');
    const shareButton = document.getElementById('shareButton');
    const colorPicker = document.getElementById('colorPicker');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const ctaSection = document.getElementById('ctaSection');
    const createDoodleButton = document.getElementById('createDoodleButton');
    const toggleGuideButton = document.getElementById('toggleGuideButton');
    const guideContent = document.getElementById('guideContent');
    const socialShareButtons = document.getElementById('socialShareButtons');
    const shareFacebook = document.getElementById('shareFacebook');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareWhatsApp = document.getElementById('shareWhatsApp');

    // Daily prompt generator
    const prompts = [
        'Draw a cat in a hat', 'Draw a smiling sun', 'Draw a tree with fruit',
        'Draw your favorite animal', 'Draw a house', 'Draw a spaceship',
        'Draw an underwater scene', 'Draw a superhero', 'Draw a magical creature',
        'Draw a carnival scene', 'Draw your dream vacation spot', 'Draw a robot',
        'Draw a bustling cityscape', 'Draw a peaceful countryside', 'Draw a fantasy castle',
        'Draw a pirate ship', 'Draw a science experiment', 'Draw your favorite meal',
        'Draw a sports event', 'Draw a musical performance', 'Draw a beach scene',
        'Draw a mountain landscape', 'Draw a futuristic city', 'Draw a fairytale scene',
        'Draw a comic strip', 'Draw a holiday celebration', 'Draw a circus',
        'Draw a historical event', 'Draw a pet doing something funny', 'Draw a garden full of flowers',
        'Draw a scene from your favorite book', 'Draw a famous landmark', 'Draw a scene from your favorite movie',
        'Draw a board game in action', 'Draw a secret hideout', 'Draw a mythical creature',
        'Draw an alien planet', 'Draw a magical forest', 'Draw a character from your favorite game',
        'Draw an adventure story'
    ];
    prompt.textContent = prompts[new Date().getDate() % prompts.length];

    let drawing = false;
    let currentColor = '#000000';
    let bgColor = '#ffffff';
    let frames = [];
    let animating = false;
    const frameInterval = 200;  // Adjust delay between frames (in milliseconds)
    let lastFrameTime = 0;

    // Toggle guide content visibility
    toggleGuideButton.addEventListener('click', () => {
        if (guideContent.classList.contains('hidden')) {
            guideContent.classList.remove('hidden');
            toggleGuideButton.textContent = 'Hide Guide';
        } else {
            guideContent.classList.add('hidden');
            toggleGuideButton.textContent = 'Show Guide';
        }
    });

    // Update drawing color
    colorPicker.addEventListener('input', (event) => {
        currentColor = event.target.value;
    });

    // Update background color
    bgColorPicker.addEventListener('input', (event) => {
        bgColor = event.target.value;
        updateBackground();
    });

    // Save canvas state
    function saveState() {
        frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    // Restore canvas state
    function restoreState() {
        if (frames.length > 0) {
            const lastFrame = frames.pop();
            ctx.putImageData(lastFrame, 0, 0);
        }
    }

    // Update background color
    function updateBackground() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Get mouse position
    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // Get touch position
    function getTouchPos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    // Start drawing
    function startDrawing(event) {
        if (animating) return;
        drawing = true;
        saveState();
        const pos = event.type.includes('mouse') ? getMousePos(event) : getTouchPos(event);
        draw(pos.x, pos.y);
    }

    // Stop drawing
    function stopDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    // Draw on the canvas
    function draw(x, y) {
        if (!drawing) return;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', (event) => {
        if (drawing) {
            const pos = getMousePos(event);
            draw(pos.x, pos.y);
        }
    });

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', (event) => {
        if (drawing) {
            const pos = getTouchPos(event);
            draw(pos.x, pos.y);
        }
    });

    // Clear canvas
    clearButton.addEventListener('click', () => {
        saveState();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateBackground();
        if (animating) stopAnimation();
    });

    // Undo last action
    undoButton.addEventListener('click', () => {
        if (frames.length > 0) {
            restoreState();
        }
        if (animating) stopAnimation();
    });

    // Save drawing as PNG
    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'doodle.png';
        link.click();
    });

    // Play animation
    playButton.addEventListener('click', () => {
        if (frames.length === 0) return;
        animating = true;
        let frameIndex = 0;
        function animate() {
            if (!animating) return;
            ctx.putImageData(frames[frameIndex], 0, 0);
            frameIndex++;
            if (frameIndex < frames.length) {
                setTimeout(animate, frameInterval);
            } else {
                stopAnimation();
            }
        }
        animate();
    });

    // Stop animation
    function stopAnimation() {
        animating = false;
    }

    // Share doodle on social media with image and landing page link
    shareButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        const landingPageURL = window.location.href.split('?')[0];
        socialShareButtons.style.display = 'block';
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(landingPageURL)}}`;
        shareTwitter.href = `https://x.com/intent/tweet?url=${encodeURIComponent(landingPageURL)}}`;
        shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(landingPageURL)}&media=${encodeURIComponent(dataURL)}`;
    });

    // Load shared doodle
    const urlParams = new URLSearchParams(window.location.search);
    const sharedDoodle = urlParams.get('doodle');
    if (sharedDoodle) {
        const img = new Image();
        img.src = decodeURIComponent(sharedDoodle);
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        ctaSection.style.display = 'block';
        document.getElementById('header').style.display = 'none';
        document.querySelector('.action-buttons').style.display = 'none';
        document.getElementById('colorAndAction').style.display = 'none';
        document.getElementById('shareSection').style.display = 'none';
    }

    // CTA button to create a new doodle
    createDoodleButton.addEventListener('click', () => {
        window.location.href = window.location.href.split('?')[0];
    });
});