// Admin dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in and has admin privileges
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  // Get API URL
  const API_URL = 'http://localhost:5000/api';
  
  // Fetch user data
  fetch(`${API_URL}/auth/user`, {
    headers: {
      'x-auth-token': token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Not authorized');
    }
    return response.json();
  })
  .then(user => {
    if (user.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    
    // Display admin name
    document.getElementById('admin-name').textContent = user.name;
    
    // Fetch stats for dashboard
    fetchDashboardStats();
    
    // Load initial content (contacts list)
    loadContacts();
  })
  .catch(error => {
    console.error('Auth error:', error);
    window.location.href = '/login.html';
  });
  
  // Set up navigation
  const navLinks = document.querySelectorAll('.admin-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get data-section attribute
      const section = this.getAttribute('data-section');
      
      // Load appropriate content
      switch(section) {
        case 'dashboard':
          loadDashboard();
          break;
        case 'contacts':
          loadContacts();
          break;
        case 'team':
          loadTeam();
          break;
        case 'testimonials':
          loadTestimonials();
          break;
        case 'settings':
          loadSettings();
          break;
        default:
          loadDashboard();
      }
    });
  });
  
  // Fetch dashboard stats
  function fetchDashboardStats() {
    fetch(`${API_URL}/admin/stats`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('total-contacts').textContent = data.contacts;
      document.getElementById('total-team').textContent = data.team;
      document.getElementById('total-testimonials').textContent = data.testimonials;
    })
    .catch(error => console.error('Error fetching stats:', error));
  }
  
  // Load contacts
  function loadContacts() {
    const contentArea = document.getElementById('admin-content');
    contentArea.innerHTML = '<h2>Contact Submissions</h2><div class="loading">Loading...</div>';
    
    fetch(`${API_URL}/admin/contacts`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => response.json())
    .then(contacts => {
      let html = `
        <h2>Contact Submissions</h2>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      contacts.forEach(contact => {
        const date = new Date(contact.date).toLocaleDateString();
        html += `
          <tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>${date}</td>
            <td>
              <button class="btn-view" data-id="${contact._id}">View</button>
              <button class="btn-delete" data-id="${contact._id}">Delete</button>
            </td>
          </tr>
        `;
      });
      
      html += `
          </tbody>
        </table>
      `;
      
      contentArea.innerHTML = html;
      
      // Add event listeners for view buttons
      document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', function() {
          const contactId = this.getAttribute('data-id');
          viewContact(contactId);
        });
      });
      
      // Add event listeners for delete buttons
      document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
          const contactId = this.getAttribute('data-id');
          deleteContact(contactId);
        });
      });
    })
    .catch(error => {
      console.error('Error loading contacts:', error);
      contentArea.innerHTML = '<h2>Contact Submissions</h2><p>Error loading contacts</p>';
    });
  }
  
  // View contact details
  function viewContact(id) {
    fetch(`${API_URL}/admin/contacts/${id}`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => response.json())
    .then(contact => {
      const modal = document.getElementById('modal');
      const modalContent = document.getElementById('modal-content');
      
      const date = new Date(contact.date).toLocaleString();
      
      modalContent.innerHTML = `
        <h3>Contact Details</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Message:</strong></p>
        <div class="message-content">${contact.message}</div>
        <div class="modal-buttons">
          <button id="reply-btn" class="btn">Reply by Email</button>
          <button id="close-modal" class="btn btn-outline">Close</button>
        </div>
      `;
      
      modal.style.display = 'flex';
      
      document.getElementById('close-modal').addEventListener('click', function() {
        modal.style.display = 'none';
      });
      
      document.getElementById('reply-btn').addEventListener('click', function() {
        window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
      });
    })
    .catch(error => console.error('Error viewing contact:', error));
  }
  
  // Delete contact
  function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
      fetch(`${API_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Reload contacts
          loadContacts();
        } else {
          alert('Error deleting contact');
        }
      })
      .catch(error => console.error('Error deleting contact:', error));
    }
  }
  
  // Load team management
  function loadTeam() {
    const contentArea = document.getElementById('admin-content');
    contentArea.innerHTML = '<h2>Team Members</h2><div class="loading">Loading...</div>';
    
    fetch(`${API_URL}/admin/team`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => response.json())
    .then(team => {
      let html = `
        <h2>Team Members</h2>
        <button id="add-team" class="btn">Add New Team Member</button>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      team.forEach(member => {
        html += `
          <tr>
            <td><img src="${member.image}" alt="${member.name}" width="50"></td>
            <td>${member.name}</td>
            <td>${member.position}</td>
            <td>
              <button class="btn-edit" data-id="${member._id}">Edit</button>
              <button class="btn-delete" data-id="${member._id}">Delete</button>
            </td>
          </tr>
        `;
      });
      
      html += `
          </tbody>
        </table>
      `;
      
      contentArea.innerHTML = html;
      
      // Add event listener for add button
      document.getElementById('add-team').addEventListener('click', addTeamMember);
      
      // Add event listeners for edit buttons
      document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', function() {
          const memberId = this.getAttribute('data-id');
          editTeamMember(memberId);
        });
      });
      
      // Add event listeners for delete buttons
      document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
          const memberId = this.getAttribute('data-id');
          deleteTeamMember(memberId);
        });
      });
    })
    .catch(error => {
      console.error('Error loading team:', error);
      contentArea.innerHTML = '<h2>Team Members</h2><p>Error loading team members</p>';
    });
  }
  
  // Function to handle logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });
});