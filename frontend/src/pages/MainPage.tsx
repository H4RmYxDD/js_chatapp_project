const MainPage = () => {
    return (
        <>
            <h1>nyald meg a herem</h1>
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}
            >
                Logout
            </button>
        </>
    );
};

export default MainPage;
