document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('my-form');
  const msgDiv = document.querySelector('.msg');

  // ... (your existing form submission code) ...

  // Function to fetch and display users
  function fetchAndDisplayUsers() {
    fetch('/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const usersList = document.querySelector('.users-list');
        usersList.innerHTML = ''; // Clear previous user data

        data.forEach((user) => {
          const userDiv = document.createElement('div');
          userDiv.classList.add('user');
          userDiv.textContent = `Name: ${user.name}, Email: ${user.email}, Phone: ${user.phone}`;
          
          // Create a delete button
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-btn');
          deleteButton.textContent = 'Delete';
          deleteButton.setAttribute('data-user-id', user.id);

          // Add a click event listener to the delete button
          deleteButton.addEventListener('click', () => {
            deleteUser(user.id);
          });

          // Append the delete button to the user's data
          userDiv.appendChild(deleteButton);

          // Append the user's data to the users list
          usersList.appendChild(userDiv);
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }

  // Call the function to fetch and display users when the page loads
  fetchAndDisplayUsers();

  // Function to delete a user by ID
  function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error deleting user.');
        }
        return response.json();
      })
      .then((data) => {
        // User deleted successfully, you can update the UI as needed
        console.log(data.message);
        // Refresh the user list after deletion
        fetchAndDisplayUsers();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }
});
