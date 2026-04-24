import React, { useState } from 'react';
import './App.css';

const API_URL = '/api';

function App() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [email, setEmail] = useState('');
  const [generatedPage, setGeneratedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const generatePage = (product, audience, features) => {
    const productLower = product.toLowerCase();
    const audienceLower = audience.toLowerCase();
    const featuresList = features ? features.split(',').map(f => f.trim()).filter(f => f) : [];
    
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const headlineTemplates = [
      `${product} — Built for ${audience}`,
      `The ${product} That ${audience} Actually Love`,
      `Stop Struggling. Start Using ${product}.`,
      `${product}: Finally, a Tool Made for ${audience}`,
      `Launch Your ${product} in Minutes, Not Weeks`
    ];
    
    const subheadlineTemplates = [
      `Everything ${audience} need to succeed, in one powerful platform.`,
      `Join thousands of ${audience} who've already made the switch.`,
      `Simple, fast, and designed specifically for ${audience}.`,
      `No coding. No designers. Just results.`
    ];
    
    const ctaTemplates = [
      'Start Free Trial',
      'Get Started Now',
      'Try It Free',
      'Launch Your Page',
      'Get Early Access'
    ];
    
    const benefitTemplates = [
      { icon: '⚡', title: 'Lightning Fast', desc: `Get your ${product} up and running in under 5 minutes.` },
      { icon: '🎯', title: 'Built for You', desc: `Specifically designed for ${audience} like you.` },
      { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security with 99.9% uptime.' },
      { icon: '📈', title: 'Scales With You', desc: 'From first customer to enterprise — we grow together.' },
      { icon: '🎨', title: 'Beautiful Design', desc: 'Professional templates that convert visitors to customers.' },
      { icon: '🤝', title: '24/7 Support', desc: 'Real humans, real help, whenever you need it.' }
    ];
    
    const headline = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)];
    const subheadline = subheadlineTemplates[Math.floor(Math.random() * subheadlineTemplates.length)];
    const cta = ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)];
    
    const customFeatures = featuresList.length > 0 
      ? featuresList.map((f, i) => ({ 
          icon: ['✨', '🚀', '💡', '🔧', '⚙️', '📊'][i % 6], 
          title: f, 
          desc: `Powerful ${f.toLowerCase()} built right into your workflow.` 
        }))
      : [];
    
    const allBenefits = [...customFeatures, ...benefitTemplates].slice(0, 6);
    
    return {
      headline,
      subheadline,
      cta,
      color,
      benefits: allBenefits,
      product,
      audience
    };
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const page = generatePage(product, audience, features);
    setGeneratedPage(page);
    setStep(3);
    setLoading(false);
  };

  const handleCheckout = async (plan) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">PagePilot<span className="badge">AI</span></div>
        <div className="nav-links">
          <button onClick={() => scrollTo('features')}>Features</button>
          <button onClick={() => scrollTo('pricing')}>Pricing</button>
          <button className="btn-login">Login</button>
        </div>
      </header>

      <main>
        {error && <div className="error-banner">{error}</div>}

        {step === 1 && (
          <>
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
                  disabled={!product || !audience || loading}
                >
                  {loading ? 'Generating...' : '🚀 Generate My Landing Page →'}
                </button>
              </div>
            </section>

            <section className="features" id="features">
              <h2>Everything You Need</h2>
              <div className="feature-grid">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <h3>Lightning Fast</h3>
                  <p>Describe your product in 2 sentences. Our AI builds the entire page in under 5 minutes.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <h3>Conversion Optimized</h3>
                  <p>Every page is built with proven CRO patterns: right headlines, CTAs, social proof.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔗</span>
                  <h3>One-Click Deploy</h3>
                  <p>Publish directly to your domain with one click. No coding needed.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <h3>Beautiful Templates</h3>
                  <p>Professionally designed templates that make your product look amazing.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <h3>Mobile Responsive</h3>
                  <p>Every page looks perfect on desktop, tablet, and mobile.</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <h3>Secure & Reliable</h3>
                  <p>Enterprise-grade security with 99.9% uptime guarantee.</p>
                </div>
              </div>
            </section>

            <section className="pricing" id="pricing">
              <h2>Simple, Transparent Pricing</h2>
              <p className="section-subtitle">Start free. Scale when you're ready.</p>
              <div className="pricing-grid">
                <div className="plan">
                  <h3>Starter</h3>
                  <div className="price">$0<span>/mo</span></div>
                  <ul>
                    <li>1 landing page</li>
                    <li>Basic templates</li>
                    <li>Subdomain hosting</li>
                    <li>Email support</li>
                  </ul>
                  <button className="btn-plan" onClick={() => alert('Sign up for free to get started!')}>Get Started</button>
                </div>
                <div className="plan featured">
                  <h3>Growth</h3>
                  <div className="price">$49<span>/mo</span></div>
                  <ul>
                    <li>5 landing pages</li>
                    <li>All templates</li>
                    <li>Custom domain</li>
                    <li>A/B testing</li>
                    <li>Analytics</li>
                    <li>Priority support</li>
                  </ul>
                  <button className="btn-plan btn-plan-primary" onClick={() => document.getElementById('email-section')?.scrollIntoView({ behavior: 'smooth' })}>Start Free Trial</button>
                </div>
                <div className="plan">
                  <h3>Scale</h3>
                  <div className="price">$149<span>/mo</span></div>
                  <ul>
                    <li>Unlimited pages</li>
                    <li>Advanced AI features</li>
                    <li>Multi-domain</li>
                    <li>API access</li>
                    <li>Dedicated manager</li>
                    <li>SLA guarantee</li>
                  </ul>
                  <button className="btn-plan">Contact Sales</button>
                </div>
              </div>
            </section>

            <section className="how-it-works">
              <h2>How It Works</h2>
              <div className="steps">
                <div className="step">
                  <div className="step-num">1</div>
                  <h4>Describe Your Product</h4>
                  <p>Tell us what you offer and who it's for</p>
                </div>
                <div className="step">
                  <div className="step-num">2</div>
                  <h4>AI Builds It</h4>
                  <p>Our AI creates your complete landing page</p>
                </div>
                <div className="step">
                  <div className="step-num">3</div>
                  <h4>Publish & Profit</h4>
                  <p>Deploy and start converting visitors</p>
                </div>
              </div>
            </section>
          </>
        )}

        {loading && step === 1 && (
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
                <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '12px' }}>{generatedPage.headline}</h1>
                <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '24px' }}>{generatedPage.subheadline}</p>
                <button style={{ background: generatedPage.color, color: '#fff', padding: '14px 32px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                  {generatedPage.cta}
                </button>
                
                <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
                  {generatedPage.benefits.map((b, i) => (
                    <div key={i} style={{ padding: '16px' }}>
                      <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>{b.icon}</span>
                      <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{b.title}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '12px' }}>{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">Publish Now →</button>
              <button className="btn-secondary" onClick={() => setStep(1)}>Edit Inputs</button>
              <button className="btn-secondary">A/B Test</button>
            </div>

            <div className="upgrade-prompt" id="email-section">
              <h3>🚀 Unlock Unlimited Pages</h3>
              <p>Get the Growth plan for $49/mo and publish unlimited landing pages</p>
              <div className="email-input">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
                <button 
                  className="btn-primary" 
                  onClick={() => handleCheckout('growth')}
                  disabled={!email || loading}
                >
                  {loading ? 'Processing...' : 'Start Free Trial'}
                </button>
              </div>
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