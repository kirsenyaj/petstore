import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught error:', error)
    console.error(info)
    this.setState({ info })
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, Roboto, Arial, sans-serif', color: '#111' }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>{String(this.state.error)}</pre>
          {this.state.info && this.state.info.componentStack && (
            <details style={{ marginTop: 12 }}>
              <summary>Component stack</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.info.componentStack}</pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
