import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelected = async (file) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Using localhost:8000 where our FastAPI will run
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">LabelLens AI</h1>
        <p className="app-subtitle">Instantly analyze food labels for a healthier you</p>
      </header>

      <main>
        {!loading && !results && (
          <ImageUploader onImageSelected={handleImageSelected} />
        )}

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Extracting and analyzing ingredients...
            </div>
          </div>
        )}

        {error && (
          <div className="glass-panel" style={{ textAlign: 'center', borderColor: 'var(--danger-color)' }}>
            <div style={{ color: 'var(--danger-color)', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Error: {error}
            </div>
            <button className="back-button" onClick={handleReset}>Try Again</button>
          </div>
        )}

        {results && !loading && (
          <AnalysisResults results={results} onReset={handleReset} />
        )}
      </main>
    </>
  );
}

export default App;
