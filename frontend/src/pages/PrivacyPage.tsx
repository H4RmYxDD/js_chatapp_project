import React, { useState } from 'react';

const PrivacyPage: React.FC = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [shareProfile, setShareProfile] = useState(false);

    return (
        <main className="main-content">
            <div className="app-container">
                <h2>Privacy</h2>
                <div style={{ maxWidth: 640 }}>
                    <label
                        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}
                    >
                        <input
                            type="checkbox"
                            checked={showEmail}
                            onChange={(e) => setShowEmail(e.target.checked)}
                        />
                        Show email on profile
                    </label>

                    <label
                        style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}
                    >
                        <input
                            type="checkbox"
                            checked={shareProfile}
                            onChange={(e) => setShareProfile(e.target.checked)}
                        />
                        Allow profile to be discoverable
                    </label>

                    <p className="small" style={{ marginTop: 12 }}>
                        These settings are local placeholders. To persist them, integrate with your
                        backend or a user-preferences storage.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPage;
