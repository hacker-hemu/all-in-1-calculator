function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  alert(`Login attempted for ${username}`);
}

function signup() {
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const Mobile = document.getElementById('signupmob').value;
  alert(`Signup attempted for ${username}`);
}

function submitContact() {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  alert(`Contact message from ${name}: ${message}`);
}

// search logic
function searchCalculators() {
  const input = document.getElementById('searchBar').value.toLowerCase();
  const listItems = document.querySelectorAll('.calculator-item');

  let hasResults = false;

  listItems.forEach(item => {
    const itemName = item.textContent.toLowerCase();

    if (itemName.includes(input) && input.trim() !== "") {
      item.style.display = 'block';
      hasResults = true;
    } else {
      item.style.display = 'none';
    }
  });

  const calculatorList = document.getElementById('calculatorList');
  calculatorList.style.display = hasResults ? 'block' : 'none';
}



async function loadUser() {
  try {
    const response = await fetch('/api/user'); // Fetch user information
    const data = await response.json();

    if (data && data.username) {
      // User is logged in
      document.getElementById('username').textContent = data.username;
      document.getElementById('username').classList.remove('d-none');
      document.getElementById('logout-button').classList.remove('d-none');
      document.getElementById('login-buttons').classList.add('d-none');
      document.getElementById('signup-buttons').classList.add('d-none');
    } else {
      // User is not logged in 
      document.getElementById('username').classList.add('d-none');
      document.getElementById('profiles-div').classList.add('d-none');
      document.getElementById('logout-button').classList.add('d-none');
      document.getElementById('login-buttons').classList.remove('d-none');
      document.getElementById('signup-buttons').classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Load user data on page load
document.addEventListener('DOMContentLoaded', loadUser);

