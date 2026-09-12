'use client';

import {useRef} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {useTranslations} from 'next-intl';

interface QRGeneratorProps {
  url: string;
  productName: string;
}

export default function QRGenerator({url, productName}: QRGeneratorProps) {
  const t = useTranslations('QR');
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-${productName}.png`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <QRCodeSVG
          ref={svgRef}
          value={url}
          size={256}
          level="H"
          includeMargin
        />
      </div>
      <p className="text-gray-600 text-center text-sm">{t('scanInstruction')}</p>
      <p className="text-xs text-gray-400 break-all max-w-xs text-center">{url}</p>
      <button
        onClick={handleDownload}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition"
      >
        {t('download')}
      </button>
    </div>
  );
}
