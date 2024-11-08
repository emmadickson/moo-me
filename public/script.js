
// Constants for images
const TOTAL_IMAGES = 6;  // We have 6 images numbered 1-6
const IMAGE_FORMAT = 'png';

// Generate random pastel color for background
function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 90%)`;
}

// Set initial background color
document.body.style.backgroundColor = getRandomPastelColor();

const addButton = document.getElementById('addButton');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const photoContainer = document.getElementById('photo-container');

class FloatingPhoto {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'floating-photo';

        // Create random position and movement
        this.x = Math.random() * (window.innerWidth - 220);
        this.y = Math.random() * (window.innerHeight - 170);
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5;

        // Add random image from our local collection
        const img = document.createElement('img');
        const imageNumber = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
        img.src = `images/${imageNumber}.${IMAGE_FORMAT}`;

        // Add loading error handling
        img.onerror = () => {
            console.error(`Failed to load image ${imageNumber}.${IMAGE_FORMAT}`);
            this.element.remove();
        };

        this.element.appendChild(img);

        // Set initial position
        this.updatePosition();

        // Add double-click listener to remove photo
        this.element.addEventListener('dblclick', () => {
            this.element.remove();
            // Remove from floating photos array
            floatingPhotos = floatingPhotos.filter(photo => photo !== this);
        });

        photoContainer.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }

    move() {
        const speed = speedSlider.value / 50; // Convert slider value to speed multiplier

        // Update position
        this.x += this.dx * speed;
        this.y += this.dy * speed;
        this.rotation += this.rotationSpeed * speed;

        // Bounce off edges with some padding
        if (this.x <= 0 || this.x >= window.innerWidth - 220) {
            this.dx *= -1;
            // Keep within bounds
            this.x = Math.max(0, Math.min(this.x, window.innerWidth - 220));
        }
        if (this.y <= 0 || this.y >= window.innerHeight - 170) {
            this.dy *= -1;
            // Keep within bounds
            this.y = Math.max(0, Math.min(this.y, window.innerHeight - 170));
        }

        this.updatePosition();
    }
}

let floatingPhotos = [];

// Animation loop
function animate() {
    floatingPhotos.forEach(photo => photo.move());
    requestAnimationFrame(animate);
}
animate();

// Add new photo when button is clicked
addButton.addEventListener('click', () => {
    const photo = new FloatingPhoto();
    floatingPhotos.push(photo);
});

// Update speed value display
speedSlider.addEventListener('input', () => {
    speedValue.textContent = speedSlider.value;
});

// Change background color every 30 seconds
setInterval(() => {
    document.body.style.backgroundColor = getRandomPastelColor();
}, 30000);

// Handle window resize
window.addEventListener('resize', () => {
    floatingPhotos.forEach(photo => {
        photo.x = Math.min(photo.x, window.innerWidth - 220);
        photo.y = Math.min(photo.y, window.innerHeight - 170);
    });
});
