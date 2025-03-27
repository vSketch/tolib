// Tool data
const tools = [
  {
    id: 1,
    name: "Image Editor",
    description: "A powerful online image editor with filters, cropping, and effects.",
    imageUrl: "https://m.media-amazon.com/images/I/41V5p1rqIOL.png",
    link: "https://example.com/image-editor",
  },
  {
    id: 2,
    name: "PDF Converter",
    description: "Convert documents to and from PDF format with ease.",
    imageUrl: "https://via.placeholder.com/400x200",
    link: "https://example.com/pdf-converter",
  },
  {
    id: 3,
    name: "Code Formatter",
    description: "Format and beautify your code in various programming languages.",
    imageUrl: "https://via.placeholder.com/400x200",
    link: "https://example.com/code-formatter",
  },
  {
    id: 4,
    name: "Color Picker",
    description: "Advanced color picker with hex, RGB, and HSL support.",
    imageUrl: "https://via.placeholder.com/400x200",
    link: "https://example.com/color-picker",
  },
  {
    id: 5,
    name: "Text Translator",
    description: "Translate text between multiple languages instantly.",
    imageUrl: "https://via.placeholder.com/400x200",
    link: "https://example.com/translator",
  },
  {
    id: 6,
    name: "Password Generator",
    description: "Create strong, secure passwords with customizable options.",
    imageUrl: "https://via.placeholder.com/400x200",
    link: "https://example.com/password-generator",
  },
];

// DOM elements
const toolsGrid = document.getElementById('tools-grid');
const animationOverlay = document.getElementById('animation-overlay');
const currentYearElement = document.getElementById('current-year');

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Create tool cards
function createToolCards() {
  tools.forEach(tool => {
    const toolCard = document.createElement('div');
    toolCard.className = 'tool-card';
    toolCard.dataset.link = tool.link;
    
    toolCard.innerHTML = `
      <img src="${tool.imageUrl}" alt="${tool.name}" class="tool-card-image">
      <div class="tool-card-content">
        <h3 class="tool-card-title">${tool.name}</h3>
        <p class="tool-card-description">${tool.description}</p>
      </div>
      <a href="${tool.link}" class="tool-card-link" target="_blank" rel="noopener noreferrer" aria-label="Open ${tool.name} in new tab">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    `;
    
    toolsGrid.appendChild(toolCard);
  });
}

// Initialize the page
function init() {
  createToolCards();
  addEventListeners();
}

// Add event listeners
function addEventListeners() {
  // Get all tool cards
  const toolCards = document.querySelectorAll('.tool-card');
  
  // Add click event to each card
  toolCards.forEach(card => {
    card.addEventListener('click', handleCardClick);
    
    // Prevent the link in the corner from triggering the card click
    const link = card.querySelector('.tool-card-link');
    link.addEventListener('click', e => {
      e.stopPropagation();
    });
  });
}

// Handle card click
function handleCardClick(e) {
  e.preventDefault();
  
  const card = e.currentTarget;
  const link = card.dataset.link;
  
  // Get card's current position and dimensions
  const rect = card.getBoundingClientRect();
  const startX = rect.left;
  const startY = rect.top;
  const startWidth = rect.width;
  const startHeight = rect.height;
  
  // Calculate end position (center of screen)
  const endX = window.innerWidth / 2 - startWidth / 2;
  const endY = window.innerHeight / 2 - startHeight / 2;
  
  // Calculate scale to fill screen
  const scaleX = window.innerWidth / startWidth;
  const scaleY = window.innerHeight / startHeight;
  const scale = Math.max(scaleX, scaleY) * 1.1; // Slightly larger to ensure full coverage
  
  // Clone the card for animation
  const clone = card.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.left = `${startX}px`;
  clone.style.top = `${startY}px`;
  clone.style.width = `${startWidth}px`;
  clone.style.height = `${startHeight}px`;
  clone.style.margin = '0';
  clone.style.zIndex = '101';
  clone.style.willChange = 'transform'; // Optimize for animation
  document.body.appendChild(clone);
  
  // Start animation sequence
  animateCardExpansion(clone, startX, startY, endX, endY, scale, link);
}

// Animate card expansion with multiple steps
function animateCardExpansion(clone, startX, startY, endX, endY, scale, link) {
  // Animation timing constants (in milliseconds)
  const textFadeDelay = 200;       // Delay before text starts fading
  const textFadeDuration = 800;    // How long the text takes to fade out
  const moveToMiddleDelay = 300;   // Delay before card moves to middle
  const moveToMiddleDuration = 800; // How long it takes to move to middle
  const expandDelay = 1000;        // Delay before card expands to fill screen
  const expandDuration = 1200;     // How long it takes to expand
  const redirectDelay = 1400;      // Delay after expansion before redirect
  
  // Total animation time before redirect
  const totalDuration = moveToMiddleDelay + moveToMiddleDuration + expandDelay + expandDuration + redirectDelay;
  
  // Step 1: Fade out the text content
  setTimeout(() => {
    clone.classList.add('fade-content');
    
    // Apply a longer transition to the content elements
    const content = clone.querySelector('.tool-card-content');
    const linkIcon = clone.querySelector('.tool-card-link');
    
    if (content) content.style.transition = `opacity ${textFadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    if (linkIcon) linkIcon.style.transition = `opacity ${textFadeDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  }, textFadeDelay);
  
  // Step 2: Move to center with a slight scale
  setTimeout(() => {
    clone.style.transition = `transform ${moveToMiddleDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    clone.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1)`;
    
    // Step 3: Scale to fill screen with a smooth transition
    setTimeout(() => {
      animationOverlay.classList.add('active');
      animationOverlay.style.transition = `opacity ${expandDuration * 0.8}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      
      clone.style.transition = `transform ${expandDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      clone.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(${scale})`;
      
      // Step 4: Redirect after animation completes
      setTimeout(() => {
        window.location.href = link;
      }, redirectDelay);
    }, expandDelay);
  }, moveToMiddleDelay);
  
  // Log the total animation duration for reference
  console.log(`Total animation duration: ${totalDuration}ms`);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
