import React from 'react';
import { FileText, Download } from 'lucide-react';
import api from '../services/api';

const DocumentPreview = ({ documentName }) => {
  if (!documentName) return null;

  const handleDownload = async () => {
    try {
      const response = await api.get(`/document/${documentName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download document');
    }
  };

  return (
    <div className="doc-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FileText size={24} color="var(--success-color)" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{documentName}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Word Document (.docx)</div>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleDownload}>
        <Download size={16} />
        Download
      </button>
    </div>
  );
};

export default DocumentPreview;
