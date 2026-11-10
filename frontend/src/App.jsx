
import { useState } from 'react';

import Login from './pages/login';
import Register from './pages/register';
import Notes from './pages/notes';

function App() {
    // Restore the user if they were previously logged in
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');

        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Decide which authentication screen to display
    const [page, setPage] = useState(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        return savedUser && token ? 'notes' : 'login';
    });

    // Called after successful login or registration
    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setPage('notes');
    };

    // Logout the user
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setPage('login');
    };

    return (
        <div className="app">

            {page === 'login' && (
                <Login
                    onLogin={handleLogin}
                    onRegisterClick={() => setPage('register')}
                />
            )}

            {page === 'register' && (
                <Register
                    onRegister={handleLogin}
                />
            )}

            {page === 'notes' && user && (
                <div className="dashboard">
                    <header>
                        <h1>My Notes</h1>

                        <div>
                            <span>{user.email}</span>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </header>

                    <main>
                      <Notes />
                    </main>
                </div>
            )}

        </div>
    );
}

export default App;
