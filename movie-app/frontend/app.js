document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // 阻止默认提交行为

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            // 跳转到电影管理页面
            window.location.href = 'movies.html';
        } else {
            console.error('Login failed:', response.status);
            document.getElementById('errorMessage').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});