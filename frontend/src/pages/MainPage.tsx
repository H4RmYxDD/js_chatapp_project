import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import CloseButton from 'react-bootstrap/CloseButton';

const MainPage = () => {
    const [open, setOpen] = useState(false);
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const close = () => setOpen(false);

    return (
        <>
            <button
                className="menu-button"
                aria-label="Open sidebar"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                …
            </button>
            {open && <div className="overlay" onClick={close} />}

            <aside className={`sidebar ${open ? 'open' : ''}`} aria-hidden={!open}>
                <div className="sidebar-header">React-Bootstrap</div>

                <nav className="sidebar-nav">
                    <Link to="#home" onClick={close}>
                        Home
                    </Link>
                    <Link to="#link" onClick={close}>
                        Link
                    </Link>

                    <details className="sidebar-details">
                        <summary>Dropdown</summary>
                        <div className="details-list">
                            <Link to="#action/3.1" onClick={close}>
                                Action
                            </Link>
                            <Link to="#action/3.2" onClick={close}>
                                Another action
                            </Link>
                            <Link to="#action/3.3" onClick={close}>
                                Something
                            </Link>
                            <hr />
                            <Link to="#action/3.4" onClick={close}>
                                Separated link
                            </Link>
                            <CloseButton />
                        </div>
                    </details>
                </nav>

                <button className="logout-button" onClick={logout}>
                    Logout
                </button>
            </aside>

            <main className="main-content">
                <div style={{ padding: 24, marginLeft: 0 }}>
                    <h1>nyald meg a herem</h1>
                </div>
            </main>
        </>
    );
};

export default MainPage;
