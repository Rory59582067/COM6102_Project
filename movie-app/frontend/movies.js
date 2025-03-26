document.addEventListener('DOMContentLoaded', () => {
    const movieTable = document.getElementById('movieTable').querySelector('tbody');
    const addMovieForm = document.getElementById('addMovieForm');

    // Fetch and display movies
    async function fetchMovies() {
        try {
            const response = await fetch('http://localhost:3000/movies');
            const movies = await response.json();
            movieTable.innerHTML = ''; // Clear table
            movies.forEach(movie => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${movie.id}</td>
                    <td>${movie.title}</td>
                    <td>${movie.director}</td>
                    <td>${movie.year}</td>
                    <td>
                        <button onclick="deleteMovie(${movie.id})">Delete</button>
                        <button onclick="updateMovie(${movie.id})">Update</button>
                    </td>
                `;
                movieTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    // Add movie
    addMovieForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const director = document.getElementById('director').value;
        const year = document.getElementById('year').value;

        try {
            const response = await fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, director, year }),
            });

            if (response.ok) {
                alert('Movie added successfully!');
                fetchMovies(); // Refresh movie list
            } else {
                alert('Failed to add movie.');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    });

    // Delete movie
    window.deleteMovie = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/movies/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Movie deleted successfully!');
                fetchMovies(); // Refresh movie list
            } else {
                alert('Failed to delete movie.');
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    // Update movie (placeholder function)
    window.updateMovie = (id) => {
        alert(`Update functionality for movie ID ${id} is not implemented yet.`);
    };

    // Initial fetch
    fetchMovies();
});