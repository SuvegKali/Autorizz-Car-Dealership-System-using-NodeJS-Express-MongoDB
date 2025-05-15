/**
 * Enhanced Car Cards Implementation
 * 
 * This file implements:
 * 1. Image slideshow on hover (desktop) or visible cards (mobile)
 * 2. Clickable entire card replacing the Book Now button
 * 3. Collapsible description on mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all car cards
    const carCards = document.querySelectorAll('.car-item');
    const isMobile = window.innerWidth <= 768;
    
    carCards.forEach(card => {
      // === 1. IMAGE SLIDESHOW FUNCTIONALITY ===
      
      // Get the car ID and primary image
      const carId = card.getAttribute('data-id');
      const mainImg = card.querySelector('img');
      const originalSrc = mainImg.getAttribute('src');
      
      // Modify this part for your actual implementation:
      // We're simulating multiple images here - in production, your backend should provide this data
      const imageBasePath = originalSrc.replace(/\.jpg$|\.png$|\.jpeg$/i, '');
      const imageExt = originalSrc.match(/\.jpg$|\.png$|\.jpeg$/i) ? 
                      originalSrc.match(/\.jpg$|\.png$|\.jpeg$/i)[0] : '.jpg';
      
      // Create image array (assuming we have 3 images per car)
      const images = [
        originalSrc,
        `${imageBasePath}_2${imageExt}`, 
        `${imageBasePath}_3${imageExt}`
      ];
      
      // Current image index
      let currentIndex = 0;
      let slideInterval;
      
      // Start slideshow on hover (for desktop)
      if (!isMobile) {
        card.addEventListener('mouseenter', function() {
          // Start cycling through images
          slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            mainImg.src = images[currentIndex];
          }, 1000); // Change image every 1 second
        });
        
        // Stop slideshow when mouse leaves
        card.addEventListener('mouseleave', function() {
          clearInterval(slideInterval);
          mainImg.src = originalSrc; // Reset to original image
          currentIndex = 0;
        });
      }
      
      // === 2. MAKE ENTIRE CARD CLICKABLE ===
      
      // Find the "Book Now" button URL
      const bookNowLink = card.querySelector('.buybutton a');
      const bookNowUrl = bookNowLink ? bookNowLink.getAttribute('href') : null;
      
      if (bookNowLink) {
        // Hide the original book now button
        const bookNowButton = bookNowLink.parentElement;
        bookNowButton.style.display = 'none';
        
        // Add price styling
        const priceDiv = card.querySelector('.buyprice');
        if (priceDiv) {
          priceDiv.style.textAlign = 'center';
          priceDiv.style.width = '100%';
        }
      }
      
      // Make the entire card clickable
      if (bookNowUrl) {
        card.addEventListener('click', function(e) {
          // Don't trigger click if user is interacting with other elements
          if (e.target.closest('.desc-toggle')) {
            return; // Don't navigate if clicked on description toggle
          }
          
          window.location.href = bookNowUrl;
        });
      }
      
      // === 3. COLLAPSIBLE DESCRIPTION FOR MOBILE ===
      
      if (isMobile) {
        const descDiv = card.querySelector('.info-third');
        
        if (descDiv) {
          // Create toggle button
          const toggleButton = document.createElement('div');
          toggleButton.className = 'desc-toggle';
          toggleButton.textContent = 'Read more';
          descDiv.appendChild(toggleButton);
          
          // Add click event
          toggleButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click when toggling description
            
            if (descDiv.classList.contains('expanded')) {
              descDiv.classList.remove('expanded');
              toggleButton.textContent = 'Read more';
            } else {
              descDiv.classList.add('expanded');
              toggleButton.textContent = 'Read less';
            }
          });
        }
      }
      
      // === 4. AUTO SLIDESHOW FOR VISIBLE CARDS ON MOBILE ===
      
      if (isMobile) {
        // Use IntersectionObserver to detect when cards are visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Start slideshow when card is visible
              slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                mainImg.src = images[currentIndex];
              }, 2000); // Change image every 2 seconds
            } else {
              // Stop slideshow when card is not visible
              clearInterval(slideInterval);
              mainImg.src = originalSrc;
              currentIndex = 0;
            }
          });
        }, {
          threshold: 0.6 // Card is considered visible when 60% is in viewport
        });
        
        // Start observing the card
        observer.observe(card);
      }
    });
  });