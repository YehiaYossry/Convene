function router() {
  const sections = document.querySelectorAll('main section');
  const rawHash = window.location.hash || '#dashboard';
  const [view, id] = rawHash.slice(1).split('/');

  sections.forEach(section => {
    section.classList.add('hidden');
  });

  if (view === 'dashboard') {
    document.getElementById('view-dashboard').classList.remove('hidden');
    loadDashboard();
  } else if (view === 'events') {
    document.getElementById('view-events').classList.remove('hidden');
    loadEvents();
  } else if (view === 'detail') {
    document.getElementById('view-detail').classList.remove('hidden');
    if (id) loadEventDetail(id);
  } else if (view === 'create') {
    document.getElementById('view-create').classList.remove('hidden');
    loadCreateForm(id);
  }
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    const activeLink = document.getElementById(`nav-${view}`);
    if (activeLink) activeLink.classList.add('active');
}

router();
window.addEventListener('hashchange', router);

async function loadDashboard() {
  const container = document.getElementById('dashboard-content');
  container.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch('http://localhost:5000/api/dashboard');

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const result = await response.json();
    const data = result.data;

    container.innerHTML = `
      <div class="stat-card">
        <h3>${data.totalEvents}</h3>
        <p>Total Events</p>
      </div>
      <div class="stat-card">
        <h3>${data.upcomingEvents}</h3>
        <p>Upcoming Events</p>
      </div>
      <div class="stat-card">
        <h3>${data.totalRegistrations}</h3>
        <p>Total Registrations</p>
      </div>
      <div class="stat-card">
        <h3>${data.mostPopularEvent ? data.mostPopularEvent.title : 'N/A'}</h3>
        <p>Most Popular Event</p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

loadDashboard();

async function loadEvents() {
  const container = document.getElementById('events-list');
  container.innerHTML = '<p>Loading...</p>';

  const search = document.getElementById('search-input').value;
  const category = document.getElementById('category-input').value;
  const location = document.getElementById('location-input').value;
  const date = document.getElementById('date-input').value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (date) params.append('date', date);

  try {
    const response = await fetch(`http://localhost:5000/api/events?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const result = await response.json();
    const events = result.data;

    container.innerHTML = `
      <ul>
        ${events.map(event => `
          <li>
            <div class="event-header">
              <h4>${event.title}</h4>
              <div class="event-actions">
                <a href="#detail/${event._id}" class="view-btn">View</a>
                <button class="edit-btn" data-id="${event._id}">Edit</button>
                <button class="delete-btn" data-id="${event._id}">Delete</button>
              </div>
            </div>
            <h5>Category: ${event.category}</h5>
            <p>Event description: ${event.description}</p>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Meet us at ${event.location}</p>
            <p>Capacity: ${event.capacity}</p>
            <p>Registrations: ${event.registrationsCount}</p>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

let pendingDeleteId = null; 


document.getElementById('events-list').addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('edit-btn')) {
    window.location.hash = `#create/${id}`;
  }

  if (e.target.classList.contains('delete-btn')) {
    pendingDeleteId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
  }
});


document.getElementById('cancel-delete-btn').addEventListener('click', () => {
  pendingDeleteId = null;
  document.getElementById('delete-modal').classList.add('hidden');
});


document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
  if (!pendingDeleteId) return;

  try {
    const res = await fetch(`http://localhost:5000/api/events/${pendingDeleteId}`, { 
      method: 'DELETE' 
    });

    if (!res.ok) throw new Error('Failed to delete event');

    document.getElementById('delete-modal').classList.add('hidden');
    pendingDeleteId = null;
    loadEvents();
    showToast('Event deleted successfully!', 'error');

  } catch (err) {
    showToast(err.message, 'error');
  }
});

document.getElementById('filter-btn').addEventListener('click', loadEvents);

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('category-input').value = '';
  document.getElementById('location-input').value = '';
  document.getElementById('date-input').value = '';
  loadEvents();
});

loadEvents();

async function loadCreateForm(id) {
  const form = document.getElementById('create-event-form');
  const heading = document.querySelector('#view-create h2');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  form.reset(); 

  if (!id) {

    form.dataset.mode = 'create';
    delete form.dataset.editId;
    heading.textContent = 'Create an Event';
    submitBtn.textContent = 'Create Event';
    return;
  }


  form.dataset.mode = 'edit';
  form.dataset.editId = id;
  heading.textContent = 'Edit Event';
  submitBtn.textContent = 'Save Changes';

  try {
    const response = await fetch(`http://localhost:5000/api/events/${id}`);
    if (!response.ok) throw new Error('Failed to load event');

    const result = await response.json();
    const event = result.data;

    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    document.getElementById('location').value = event.location;
    document.getElementById('category').value = event.category;
    document.getElementById('capacity').value = event.capacity;
    document.getElementById('date').value = event.date.slice(0, 16);

  } catch (err) {
    showToast(err.message, 'error');
  }
}

document.getElementById('create-event-form').addEventListener('submit', async (e) => {
  e.preventDefault();
    document.querySelectorAll('.error-msg').forEach(span => span.textContent = '');

  let isValid = true;

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value.trim();
  const location = document.getElementById('location').value.trim();
  const category = document.getElementById('category').value.trim();
  const capacity = Number(document.getElementById('capacity').value);

  if (!title) {
    document.getElementById('title-error').textContent = 'Title is required';
    isValid = false;
  }

  if (!description) {
    document.getElementById('description-error').textContent = 'Description is required';
    isValid = false;
  }

  if (!date) {
    document.getElementById('date-error').textContent = 'Date is required';
    isValid = false;
  }

  if (!location) {
    document.getElementById('location-error').textContent = 'Location is required';
    isValid = false;
  }

  if (!category) {
    document.getElementById('category-error').textContent = 'Category is required';
    isValid = false;
  }

  if (!capacity || capacity <= 0) {
    document.getElementById('capacity-error').textContent = 'Capacity must be greater than 0';
    isValid = false;
  }

  if (!isValid) return;

  const form = e.target;
  const mode = form.dataset.mode; 
  const editId = form.dataset.editId;

  const payload = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value,
    location: document.getElementById('location').value,
    category: document.getElementById('category').value,
    capacity: Number(document.getElementById('capacity').value)
  };

  const url = mode === 'edit' 
    ? `http://localhost:5000/api/events/${editId}` 
    : 'http://localhost:5000/api/events';
    
  const method = mode === 'edit' ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to ${mode} event`);
    }
    
    window.location.hash = '#events';
    showToast(`Event ${mode === 'edit' ? 'updated' : 'created'} successfully!`, 'success');

  } catch (err) {
    showToast(err.message, 'error');
  }
});

async function loadEventDetail(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/events/${id}`);
    if (!res.ok) throw new Error('Failed to load event details');
    
    const result = await res.json();
    const event = result.data;

    document.getElementById('detail-title').textContent = event.title;
    document.getElementById('detail-description').textContent = event.description;
    document.getElementById('detail-category').textContent = event.category;
    document.getElementById('detail-location').textContent = event.location;
    document.getElementById('detail-date').textContent = new Date(event.date).toLocaleDateString();
    document.getElementById('detail-capacity').textContent = event.capacity;

    const remaining = event.capacity - (event.registrationsCount || 0);
    document.getElementById('detail-spots').textContent = remaining;

    const regForm = document.getElementById('register-form');
    const soldOutMsg = document.getElementById('sold-out-msg');

    if (remaining <= 0) {
      regForm.classList.add('hidden');
      soldOutMsg.classList.remove('hidden');
    } else {
      regForm.classList.remove('hidden');
      soldOutMsg.classList.add('hidden');
    }

    regForm.dataset.eventId = id;
    loadAttendees(id);

  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadAttendees(eventId) {
  const list = document.getElementById('attendees-list');
  try {
    const res = await fetch(`http://localhost:5000/api/events/${eventId}/attendees`);
    if (!res.ok) throw new Error('Failed to load attendees');
    
    const result = await res.json();
    const attendees = result.data || [];

    if (attendees.length === 0) {
      list.innerHTML = '<li>No attendees yet.</li>';
      return;
    }

    list.innerHTML = attendees.map(a => `
      <li>
        ${a.name} (${a.email})
        <button class="cancel-reg-btn" data-id="${a._id}" data-event-id="${eventId}">Cancel</button>
      </li>
    `).join('');

  } catch (err) {
    list.innerHTML = `<li>${err.message}</li>`;
  }
}


document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const eventId = form.dataset.eventId;

  const payload = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value
  };

  try {
    const res = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to register');
    }

    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';

    loadEventDetail(eventId);
    showToast('Registered successfully!', 'success');

  } catch (err) {
    showToast(err.message, 'error');
  }
});


document.getElementById('attendees-list').addEventListener('click', async (e) => {
  if (!e.target.classList.contains('cancel-reg-btn')) return;

  const registrationId = e.target.dataset.id;
  const eventId = e.target.dataset.eventId;

  try {
    const res = await fetch(`http://localhost:5000/api/events/${eventId}/registrations/${registrationId}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Failed to cancel registration');

    loadEventDetail(eventId);
    showToast('Registration cancelled!', 'error');

  } catch (err) {
    showToast(err.message, 'error');
  }
});

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}