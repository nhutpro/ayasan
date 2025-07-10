import React from 'react';

const Header: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    return (
        <header
            style={{
                width: '100%',
                padding: '16px 32px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                top: 0,
                left: 0,
                zIndex: 100,
            }}
        >
            <div style={{ fontWeight: 700, fontSize: 20 }}>Ayasan</div>
            <button
                onClick={onLogout}
                style={{
                    padding: '8px 16px',
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                }}
            >
                Logout
            </button>
        </header>
    );
};

export default Header;