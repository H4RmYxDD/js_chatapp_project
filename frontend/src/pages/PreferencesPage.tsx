import React, { useEffect, useState } from 'react';

const PKEY_DARK = 'prefs_darkMode';
const PKEY_TS = 'prefs_showTimestamps';

const applyDark = (on: boolean) => {
    try {
        if (on) document.documentElement.classList.add('dark-mode');
        else document.documentElement.classList.remove('dark-mode');
    } catch (e) {
    }
};

const PreferencesPage: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        try {
            return localStorage.getItem(PKEY_DARK) === '1';
        } catch (e) {
            return false;
        }
    });
    const [showTimestamps, setShowTimestamps] = useState<boolean>(() => {
        try {
            const v = localStorage.getItem(PKEY_TS);
            return v == null ? true : v === '1';
        } catch (e) {
            return true;
        }
    });

    useEffect(() => {
        applyDark(darkMode);
        try {
            localStorage.setItem(PKEY_DARK, darkMode ? '1' : '0');
        } catch (e) {}
        try {
            window.dispatchEvent(new Event('storage'));
        } catch (e) {}
    }, [darkMode]);

    useEffect(() => {
        try {
            localStorage.setItem(PKEY_TS, showTimestamps ? '1' : '0');
        } catch (e) {}
        try {
            window.dispatchEvent(new Event('storage'));
        } catch (e) {}
    }, [showTimestamps]);

    return (
        <main className="main-content">
            <div className="app-container">
                <h2>Preferences</h2>
                <div style={{ maxWidth: 640 }}>
                    <label
                        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}
                    >
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                        />
                        Dark mode
                    </label>

                    <label
                        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}
                    >
                        <input
                            type="checkbox"
                            checked={showTimestamps}
                            onChange={(e) => setShowTimestamps(e.target.checked)}
                        />
                        Show timestamps on messages
                    </label>

                    <p className="small" style={{ marginTop: 12, color: 'purple' }}>
                        Preferences are stored locally in your browser. They affect how the UI
                        renders on this device.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default PreferencesPage;
