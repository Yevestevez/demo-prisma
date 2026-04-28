console.log('Hello, World!');

const apiURL = 'http://localhost:3050/api/users';
const token = localStorage.getItem('token');

const fetchUsers = async () => {
    try {
        const response = await fetch(apiURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        console.log('Users:', users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3050/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('Login successful, token stored.');
    } catch (error) {
        console.error('Error during login:', error);
    }
};

const logout = () => {
    localStorage.removeItem('token');
    console.log('Logged out, token removed.');
}

const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log('Form Data:', data);
    await login(data.email, data.password);
});

const fetchUsersButton = document.getElementById('fetch-users');
fetchUsersButton.addEventListener('click', fetchUsers);

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout); 
