// ──────────────────────────────────────────────────
//  ErrorBoundary — Catches React/Three.js crashes
// ──────────────────────────────────────────────────

import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '20px',
                    }}>
                        <div style={{ fontSize: '32px' }}>⚠️</div>
                        <p style={{ fontSize: '14px', opacity: 0.6, textAlign: 'center', maxWidth: '300px' }}>
                            3D scene failed to load. Check browser console for details.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(128,128,128,0.3)',
                                background: 'rgba(128,128,128,0.1)',
                                cursor: 'pointer',
                                fontSize: '12px',
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
