import { pdf } from '@react-pdf/renderer';
import React from 'react';

// Generate PDF Blob from a React-PDF document
export const generatePdfBlob = async (doc: React.ReactElement): Promise<Blob> => {
  const asPdf = pdf();
  asPdf.updateContainer(doc);
  return await asPdf.toBlob();
};

// Download known PDF
export const downloadPdf = async (
  doc: React.ReactElement,
  fileName = 'document.pdf'
) => {
  const blob = await generatePdfBlob(doc);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};

// Print known PDF
export const printPdf = async (doc: React.ReactElement) => {
  const blob = await generatePdfBlob(doc);
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  };
};