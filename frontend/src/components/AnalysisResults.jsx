import React from 'react';

export default function AnalysisResults({ results, onReset }) {
  const { score, frequency_recommendation, harmful_ingredients, good_ingredients, other_ingredients, reasoning } = results;

  // Determine color based on score
  let scoreColor = '#ef4444'; // Red
  if (score >= 75) scoreColor = '#10b981'; // Green
  else if (score >= 40) scoreColor = '#f59e0b'; // Yellow

  return (
    <div className="glass-panel results-container">
      <div className="score-header">
        <div 
          className="score-ring" 
          style={{ 
            '--score-pct': `${score}%`,
            '--score-color': scoreColor
          }}
        >
          <div className="score-value">{score}</div>
        </div>
        
        <div className="recommendation-card">
          <h3>Recommendation</h3>
          <p>{frequency_recommendation}</p>
          <div style={{marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4}}>
            {reasoning}
          </div>
        </div>
      </div>

      <div className="lists-container">
        {harmful_ingredients && harmful_ingredients.length > 0 && (
          <div className="ingredient-category">
            <h3 className="category-title danger">⚠️ Harmful Ingredients</h3>
            <ul className="ingredient-list">
              {harmful_ingredients.map((item, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">{item.name}</span>
                  <p className="ingredient-explanation">{item.simple_explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {good_ingredients && good_ingredients.length > 0 && (
          <div className="ingredient-category">
            <h3 className="category-title success">✅ Good Ingredients</h3>
            <ul className="ingredient-list">
              {good_ingredients.map((item, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">{item.name}</span>
                  <p className="ingredient-explanation">{item.simple_explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {other_ingredients && other_ingredients.length > 0 && (
          <div className="ingredient-category">
            <h3 className="category-title neutral">ℹ️ Other Ingredients</h3>
            <ul className="ingredient-list">
              {other_ingredients.map((item, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">{item.name}</span>
                  <p className="ingredient-explanation">{item.simple_explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="back-button" onClick={onReset}>
        Analyze Another Label
      </button>
    </div>
  );
}
