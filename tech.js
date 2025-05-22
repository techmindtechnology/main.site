
       // ========== Mobile Navigation ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ========== Chat Widget ==========
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
const notificationBadge = document.getElementById('notification-badge');

// Show automatic notification after 15 seconds
setTimeout(() => {
    notificationBadge.style.display = 'flex';
    chatButton.classList.add('bounce');
}, 15000);

// Toggle chat window
chatButton.addEventListener('click', () => {
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
        notificationBadge.style.display = 'none';
        chatButton.classList.remove('bounce');
        chatInput.focus();
    }
});

// Close chat window
chatClose.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    if (message !== '') {
        addMessage(message, 'user');
        chatInput.value = '';

        setTimeout(() => {
            let response;

            if (message.toLowerCase().includes('pricing') || message.toLowerCase().includes('cost')) {
                response = "Our pricing depends on your specific project requirements. Would you like to schedule a free consultation to discuss your needs?";
            } else if (message.toLowerCase().includes('contact') || message.toLowerCase().includes('talk')) {
                response = "You can reach our team at youngmindtech@gmail.com or call us at +233(0) 533 980 571. Alternatively, you can fill out the contact form on our website.";
            } else if (message.toLowerCase().includes('service')) {
                response = "We offer various services including web development, mobile app development, cybersecurity, data analytics, software solutions, and cloud solutions. Which one are you interested in?";
            }else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')  || message.toLowerCase().includes('hey') ) {
                response = "Hello! How can I assist you today?";
            }
            else if (message.toLowerCase().includes('thank you') || message.toLowerCase().includes('thanks')) {
                response = "You're welcome! If you have any more questions, feel free to ask.";
            } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('support')) {
                response = "Sure! What do you need help with? Please provide more details.";
            } else if (message.toLowerCase().includes('bye') || message.toLowerCase().includes('goodbye')) {
                response = "Goodbye! Have a great day!"; }
                else if (message.toLowerCase().includes('job') || message.toLowerCase().includes('career')) {
                response = "We are always looking for talented individuals to join our team. Please send your resume to +233(0) 533 980 571 or email us at atomnharnhar97@gmail.com.";
            }
            else if (message.toLowerCase().includes('website') || message.toLowerCase().includes('link')) {
                response = "You can visit our website at www.youngmindtech.com for more information about our services.";
            } else if (message.toLowerCase().includes('feedback') || message.toLowerCase().includes('review')) {
                response = "We appreciate your feedback! Please let us know how we can improve our services.";
            } else if (message.toLowerCase().includes('location') || message.toLowerCase().includes('address')) {
                response = "We are located in Accra, Ghana. You can find us at Young Mind Tech, Accra, Ghana.";
            }
            else if (message.toLowerCase().includes('working hours') || message.toLowerCase().includes('working hours')) {
                response = "Our working hours are Monday to Friday, 9 AM to 6 PM GMT. We are closed on weekends and public holidays.";
            } else if (message.toLowerCase().includes('emergency') || message.toLowerCase().includes('urgent')) {
                response = "If you have an urgent issue, please call us at +233(0) 533 980 571 for immediate assistance.";
            } else if (message.toLowerCase().includes('thank') || message.toLowerCase().includes('appreciate')) {
                response = "You're welcome! If you have any more questions, feel free to ask.";
            } else if (message.toLowerCase().includes('bye') || message.toLowerCase().includes('goodbye')) {
                response = "Goodbye! Have a great day!";
            }
            else {
                response = "Thank you for your message! One of our team members will get back to you shortly. If you need immediate assistance, please call us at +233(0) 533 980 571.";
            }

            addMessage(response, 'support');
        }, 1000);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('support-message');
    }

    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message on button click
chatSend.addEventListener('click', sendMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Show notification after 60 seconds if chat not opened
setTimeout(() => {
    if (chatWindow.style.display !== 'flex') {
        notificationBadge.style.display = 'flex';
        notificationBadge.textContent = '1';
        chatButton.classList.add('bounce');
    }
}, 60000);

// ========== Testimonial Slider ==========
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonials[index].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
});

nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
});

// ========== Scroll Animation ==========
const fadeElements = document.querySelectorAll('.fade-in');

function checkFade() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkFade);
window.addEventListener('load', checkFade);

// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// ========== Form Validation ==========
const contactForm = document.getElementById('contactForm'); 
contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();
    if (name === '' || email === '' || subject === '' || message === '') {
        alert('Please fill in all fields.');
        return;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    // If all validations pass, submit the form
    contactForm.submit();
});
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

  const darkModeToggle = document.getElementById('darkModeToggle');

  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');

    // Optional: save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // Load theme from localStorage
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }
  });
// ========== Back to Top Button ==========<script>
  const backToTop = document.getElementById('backToTop');

  // Show button when scroll past 300px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });

  // Scroll to top on click
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
                  //footer newsletter subscription
                document.getElementById('newsletter-submit').addEventListener('click', function() {
                    const email = document.getElementById('newsletter-email').value;
                    if (email) {
                        alert('Thank you for subscribing to our newsletter!');
                        document.getElementById('newsletter-email').value = '';
                    } else {
                        alert('Please enter a valid email address.');
                    }
                });
  



