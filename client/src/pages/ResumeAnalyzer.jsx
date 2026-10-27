import React, { useState } from 'react';
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { analyzeResumeApi } from '../services/api';

export default function ResumeAnalyzer({ profile, onProfileUpdate }) {
  const [activeInputTab, setActiveInputTab] = useState('upload'); // 'upload' | 'paste'
  const [resumeText, setResumeText] = useState(profile.resume?.text || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(profile.resume?.analysis || null);
  const [copied, setCopied] = useState(false);

  const targetRole = profile.targetRole || 'Full Stack Developer';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let result;
      if (activeInputTab === 'upload' && selectedFile) {
        result = await analyzeResumeApi({
          file: selectedFile,
          text: resumeText,
          targetRole
        });
      } else {
        if (!resumeText.trim()) {
          throw new Error('Please paste your resume text or upload a PDF/DOCX file.');
        }
        result = await analyzeResumeApi({
          file: null,
          text: resumeText,
          targetRole
        });
      }

      setAnalysisResult(result.data);
      if (result.extractedText) {
        setResumeText(result.extractedText);
      }

      // Save to profile
      const updated = {
        ...profile,
        resume: {
          fileName: selectedFile ? selectedFile.name : (profile.resume?.fileName || 'Pasted_Resume.txt'),
          text: result.extractedText || resumeText,
          parsedAt: new Date().toISOString(),
          analysis: result.data
        }
      };
      onProfileUpdate(updated);
    } catch (err) {
      setErrorMessage(err.message || 'Analysis failed. Please try pasting your resume text.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyExtractedText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Resume Quality & ATS Readability Analyzer
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evaluate role keyword density, structural readability, and missing evidence links against <strong>{targetRole}</strong> expectations.
        </p>
      </div>

      {/* Main Dual Grid: Input panel & Analysis Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }} className="resume-grid">
        {/* Left Column: Input Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Resume Source Input</span>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveInputTab('upload')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeInputTab === 'upload' ? '#FFFFFF' : 'transparent',
                  color: activeInputTab === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeInputTab === 'upload' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveInputTab('paste')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeInputTab === 'paste' ? '#FFFFFF' : 'transparent',
                  color: activeInputTab === 'paste' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: activeInputTab === 'paste' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Paste Text
              </button>
            </div>
          </div>

          {/* Upload Method */}
          {activeInputTab === 'upload' && (
            <div>
              <label
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: '12px',
                  padding: '28px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-secondary)',
                  textAlign: 'center',
                  gap: '8px'
                }}
              >
                <Upload size={28} color="var(--primary)" />
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedFile ? selectedFile.name : 'Choose PDF or DOCX resume'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Files are processed safely in-memory. Max 5MB.
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>

              {selectedFile && (
                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Ready to parse: {selectedFile.name}
                </div>
              )}
            </div>
          )}

          {/* Paste or Extracted Textarea */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                {activeInputTab === 'upload' ? 'Extracted / Editable Text' : 'Paste Resume Text'}
              </label>
              {resumeText && (
                <button
                  type="button"
                  onClick={copyExtractedText}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={activeInputTab === 'upload' ? 8 : 14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw text from your resume here (Summary, Education, Experience, Projects, Skills)..."
              className="form-textarea"
              style={{ fontSize: '0.8125rem', fontFamily: 'monospace', lineHeight: 1.4 }}
            />
          </div>

          {errorMessage && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--error-soft)', border: '1px solid rgba(220, 83, 83, 0.2)', color: 'var(--error)', fontSize: '0.8125rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!selectedFile && !resumeText.trim())}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Analyzing Resume Structure...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Analyze Resume Quality</span>
              </>
            )}
          </button>

          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            * Disclaimer: This parser analyzes structural keyword alignment, action verbs, and evidence links. It does not simulate proprietary employer ATS black-boxes.
          </div>
        </div>

        {/* Right Column: Detailed Findings & Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {analysisResult ? (
            <>
              {/* Score Summary Card */}
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Resume Quality Indicator</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                      {analysisResult.overallScore}
                    </span>
                    <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>/ 100</span>
                    <span className="badge badge-success" style={{ marginLeft: '8px' }}>
                      {analysisResult.qualityGrade}
                    </span>
                  </div>
                </div>

                {/* Subcategory Scores */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', minWidth: '240px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Role Keywords</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{analysisResult.categoryScores?.keywordScore}%</div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>ATS Structure</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{analysisResult.categoryScores?.formattingScore}%</div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Impact Verbs</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{analysisResult.categoryScores?.impactScore}%</div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Evidence & Links</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{analysisResult.categoryScores?.evidenceScore}%</div>
                  </div>
                </div>
              </div>

              {/* Contact & Links Detected */}
              <div className="card">
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
                  Contact Information & Evidence Detection
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8125rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Email Address</div>
                    <div style={{ fontWeight: 600, color: analysisResult.contactInfo?.email ? 'var(--text-primary)' : 'var(--error)' }}>
                      {analysisResult.contactInfo?.email || 'Not found'}
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8125rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Phone Number</div>
                    <div style={{ fontWeight: 600, color: analysisResult.contactInfo?.phone ? 'var(--text-primary)' : 'var(--error)' }}>
                      {analysisResult.contactInfo?.phone || 'Not found'}
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8125rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>GitHub Link</div>
                    <div style={{ fontWeight: 600, color: analysisResult.contactInfo?.github ? 'var(--success)' : 'var(--warning)' }}>
                      {analysisResult.contactInfo?.github ? 'Detected ✓' : 'Missing link'}
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', fontSize: '0.8125rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Portfolio Link</div>
                    <div style={{ fontWeight: 600, color: analysisResult.contactInfo?.portfolio ? 'var(--success)' : 'var(--warning)' }}>
                      {analysisResult.contactInfo?.portfolio ? 'Detected ✓' : 'Missing link'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Keywords Matched vs Missing */}
              <div className="card">
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '12px' }}>
                  Competency Alignment for {targetRole}
                </h3>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginBottom: '6px' }}>
                    ✓ Matched Keywords ({analysisResult.matchedKeywords?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(analysisResult.matchedKeywords || []).map(kw => (
                      <span key={kw} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '6px' }}>
                      ⚠ Recommended Keywords for {targetRole}:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {analysisResult.missingKeywords.slice(0, 8).map(kw => (
                        <span key={kw} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="card">
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '14px' }}>
                  Actionable Resume Enhancements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analysisResult.recommendations?.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.84375rem', color: 'var(--text-primary)' }}>
                          {rec.title}
                        </span>
                        <span className="badge badge-neutral">{rec.category}</span>
                      </div>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <strong>Detected:</strong> {rec.issue}
                      </div>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--primary)', fontWeight: 500 }}>
                        <strong>Improvement:</strong> {rec.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={40} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>Ready to Analyze Your Resume</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                Upload your file or paste your resume text on the left to inspect keyword density, action verbs, and ATS formatting structure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
