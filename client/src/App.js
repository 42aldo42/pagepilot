import React, { useState } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [generatedPage, setGeneratedPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000));
    setGeneratedPage({
      headline: product ? `Launch ${product} Faster Than Ever` : 'Build Something Amazing',
      cta: 'Get Started Free',
      color: '#6366f1'
    });
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">PagePilot<span className="badge">AI</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="btn-login">Login</button>
        </div>
      </header>

      <main>
        {step === 1 && (
          <section className="hero-section">
            <h1>Describe Your Product.<br />Get a Landing Page in Minutes.</h1>
            <p className="subtitle">AI-powered landing page builder. No design skills needed.</p>
            
            <div className="onboarding-card">
              <h2>What are you building?</h2>
              <input
                type="text"
                placeholder="e.g., AI writing assistant, E-commerce store, SaaS tool..."
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="input-field"
              />
              
              <h2>Who is it for?</h2>
              <input
                type="text"
                placeholder="e.g., Small businesses, Developers, Content creators..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="input-field"
              />

              <h2>Key features (optional)</h2>
              <textarea
                placeholder="e.g., Real-time collaboration, AI suggestions, Export to PDF..."
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="input-field textarea"
              />

              <button 
                className="btn-primary" 
                onClick={handleGenerate}
                disabled={!product || !audience}
              >
                🚀 Generate My Landing Page →
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="loading-section">
            <div className="loader"></div>
            <h2>AI is building your page...</h2>
            <p>Analyzing your product, crafting headlines, designing sections...</p>
          </section>
        )}

        {step === 3 && generatedPage && (
          <section className="preview-section">
            <div className="preview-header">
              <h2>✨ Your Landing Page is Ready!</h2>
              <p>Preview and publish with one click</p>
            </div>
            
            <div className="page-preview" style={{ borderColor: generatedPage.color }}>
              <div className="preview-badge" style={{ background: generatedPage.color }}>
                LIVE PREVIEW
              </div>
              <div className="preview-content" style={{ background: '#0a0a0f' }}>
                <h1 style={{ color: '#fff' }}>{generatedPage.headline}</h1>
                <button style={{ background: generatedPage.color, color: '#fff', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '20px' }}>
                  {generatedPage.cta}
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">Publish Now →</button>
              <button className="btn-secondary">Edit Design</button>
              <button className="btn-secondary">A/B Test</button>
            </div>

            <div className="upgrade-prompt">
              <h3>🚀 Unlock Unlimited Pages</h3>
              <p>Get the Growth plan for $49/mo and publish unlimited landing pages</p>
              <button className="btn-primary">Start Free Trial</button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 PagePilot AI — Built by machines, for humans.</p>
      </footer>
    </div>
  );
}

export default App;