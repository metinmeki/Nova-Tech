/* ========================================
   FAQ ACCORDION JAVASCRIPT
   ======================================== */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    
    // Get all accordion items
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length === 0) {
      console.log('No accordion items found');
      return;
    }

    console.log('FAQ Accordion initialized with ' + accordionItems.length + ' items');

    // Add click event to each accordion header
    accordionItems.forEach(function(item) {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      
      if (!header || !content) return;

      header.addEventListener('click', function() {
        // Check if this item is already active
        const isActive = item.classList.contains('active');
        
        // Close all accordion items
        accordionItems.forEach(function(otherItem) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        });
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          
          // Smooth scroll to item (with offset for header)
          setTimeout(function() {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const elementPosition = item.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 300);
        }
      });
    });

    // Scroll animation for FAQ items
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all accordion items
    accordionItems.forEach(function(item) {
      observer.observe(item);
    });

    // Keyboard navigation support
    accordionItems.forEach(function(item, index) {
      const header = item.querySelector('.accordion-header');
      
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('tabindex', '0');
      
      header.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextItem = accordionItems[index + 1];
          if (nextItem) {
            nextItem.querySelector('.accordion-header').focus();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevItem = accordionItems[index - 1];
          if (prevItem) {
            prevItem.querySelector('.accordion-header').focus();
          }
        }
      });
    });

    // Update aria-expanded on toggle
    const updateAriaExpanded = function() {
      accordionItems.forEach(function(item) {
        const header = item.querySelector('.accordion-header');
        const isActive = item.classList.contains('active');
        header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      });
    };

    // Observer for active class changes
    const config = { attributes: true, attributeFilter: ['class'] };
    const callback = function(mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateAriaExpanded();
        }
      }
    };

    const mutationObserver = new MutationObserver(callback);
    accordionItems.forEach(function(item) {
      mutationObserver.observe(item, config);
    });

    // 3D tilt effect on hover
    accordionItems.forEach(function(item) {
      const header = item.querySelector('.accordion-header');
      
      header.addEventListener('mousemove', function(e) {
        const rect = header.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        item.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px) scale(1.01)';
      });

      header.addEventListener('mouseleave', function() {
        item.style.transform = '';
      });
    });

    console.log('FAQ Accordion fully loaded and ready!');
  });

})();