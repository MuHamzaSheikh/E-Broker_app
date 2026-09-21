import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { EBilty } from '../types';
import { Printer, X, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EBiltyModalProps {
  ebilty: EBilty | null;
  onClose: () => void;
}

export const EBiltyModal: React.FC<EBiltyModalProps> = ({ ebilty, onClose }) => {
  const { language } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!ebilty) return null;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official E-Bilty - ${ebilty.biltyNumber}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 0;
              margin: 0;
              font-size: 11px;
              line-height: 1.4;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .bilty-wrapper {
              border: 2px solid #0f172a;
              padding: 16px;
              border-radius: 8px;
              box-sizing: border-box;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .grid-3 {
              display: table;
              width: 100%;
              margin-bottom: 12px;
              border-collapse: separate;
              border-spacing: 8px 0;
            }
            .col-3 {
              display: table-cell;
              width: 33.33%;
              vertical-align: top;
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 8px 10px;
              border-radius: 6px;
              box-sizing: border-box;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              font-size: 11px;
            }
            .data-table th {
              background: #f1f5f9;
              border: 1px solid #94a3b8;
              padding: 6px 8px;
              font-weight: 800;
              text-align: left;
            }
            .data-table td {
              border: 1px solid #cbd5e1;
              padding: 6px 8px;
            }
            .terms-box {
              background: #f8fafc;
              border: 1px dashed #94a3b8;
              padding: 8px 10px;
              border-radius: 6px;
              font-size: 9px;
              color: #475569;
              margin-bottom: 12px;
            }
            .footer-table {
              width: 100%;
              border-top: 2px solid #0f172a;
              padding-top: 10px;
              margin-top: 8px;
            }
            .signature-line {
              border-top: 1px solid #0f172a;
              width: 140px;
              margin-top: 30px;
              padding-top: 4px;
              font-weight: bold;
              text-align: center;
              font-size: 10px;
            }
            .badge-verified {
              background: #ecfdf5;
              color: #065f46;
              border: 1px solid #10b981;
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="bilty-wrapper">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                {language === 'ur' ? 'سرکاری قومی ای-بلٹی نوٹ' : 'National Electronic Goods Bilty'}
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black border border-emerald-500/40">
                  VERIFIED
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Bilty #{ebilty.biltyNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ur' ? 'مکمل پی ڈی ایف پرنٹ کریں' : 'Print / Save Full PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document View */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 font-sans select-text overflow-y-auto flex-1">
          <div ref={printRef} className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-3 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-emerald-900">E-BROKER</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-white font-black rounded uppercase">
                    GOVERNMENT RECOGNIZED FREIGHT
                  </span>
                </div>
                <h2 className="text-xs font-bold text-slate-700 mt-0.5">
                  National Electronic Consignment Note & Goods Receipt (بلٹی نوٹ)
                </h2>
                <p className="text-[10px] text-slate-500">
                  Issued under Carriage of Goods by Road Act & Pakistan Motor Vehicles Rules
                </p>
              </div>

              <div className="sm:text-right text-xs">
                <div className="font-mono font-black text-slate-900 text-sm">BILTY: {ebilty.biltyNumber}</div>
                <div className="text-slate-600 font-mono">Trip Reference: <b>{ebilty.tripNumber}</b></div>
                <div className="text-slate-600">Issue Date: <b>{new Date(ebilty.issueDate).toLocaleDateString('en-GB')}</b></div>
                <div className="text-emerald-800 font-black mt-0.5 text-[11px]">
                  STATUS: ESCROW VERIFIED & SETTLED
                </div>
              </div>
            </div>

            {/* 3 Parties Information Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-300 text-xs">
              {/* Consignor */}
              <div className="space-y-0.5 sm:border-r border-slate-200 pr-2">
                <div className="font-black uppercase text-slate-500 text-[10px] tracking-wider mb-1">
                  1. Consignor (مالکِ مال / بھیجنے والا)
                </div>
                <div className="font-black text-slate-900">{ebilty.shipper.company || ebilty.shipper.name}</div>
                <div className="text-slate-600">{ebilty.shipper.pickupAddress}</div>
                <div className="text-slate-800 font-bold">{ebilty.shipper.city}, Pakistan</div>
                <div className="text-slate-600 font-mono mt-1">Phone: {ebilty.shipper.phone}</div>
              </div>

              {/* Carrier & Vehicle */}
              <div className="space-y-0.5 sm:border-r border-slate-200 pr-2 sm:pl-2">
                <div className="font-black uppercase text-slate-500 text-[10px] tracking-wider mb-1">
                  2. Carrier (ٹرانسپورٹر و گاڑی)
                </div>
                <div className="font-black text-slate-900">{ebilty.carrier.company || ebilty.carrier.ownerName}</div>
                <div className="text-slate-900 font-mono font-black mt-0.5 bg-slate-200/80 px-2 py-0.5 rounded inline-block">
                  {ebilty.carrier.vehicleReg}
                </div>
                <div className="text-slate-700">Type: <b>{ebilty.carrier.vehicleType}</b></div>
                <div className="text-slate-700">Driver: <b>{ebilty.carrier.driverName}</b></div>
              </div>

              {/* Consignee */}
              <div className="space-y-0.5 sm:pl-2">
                <div className="font-black uppercase text-slate-500 text-[10px] tracking-wider mb-1">
                  3. Consignee (وصول کنندہ)
                </div>
                <div className="font-black text-slate-900">{ebilty.consignee.company || ebilty.consignee.name}</div>
                <div className="text-slate-600">{ebilty.consignee.deliveryAddress}</div>
                <div className="text-slate-800 font-bold">{ebilty.consignee.city}, Pakistan</div>
                <div className="text-slate-600 font-mono mt-1">Phone: {ebilty.consignee.phone}</div>
              </div>
            </div>

            {/* Cargo Particulars Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Cargo Description & Marks</th>
                    <th className="p-2 border-r border-slate-300 text-center">Packages</th>
                    <th className="p-2 border-r border-slate-300 text-center">Packaging</th>
                    <th className="p-2 border-r border-slate-300 text-right">Weight (Tons)</th>
                    <th className="p-2 text-right">Declared Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                      {ebilty.cargo.description}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                      {ebilty.cargo.packagesCount}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      {ebilty.cargo.packagingType}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-right font-mono font-black text-slate-900">
                      {ebilty.cargo.weightTons} T
                    </td>
                    <td className="p-2 text-right font-mono font-black text-emerald-800">
                      PKR {ebilty.cargo.declaredValuePkr.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Freight & Payment Terms */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold">Agreed Total Freight: </span>
                <span className="font-black font-mono text-sm text-slate-900">PKR {ebilty.financials.freightAmount.toLocaleString()}</span>
                <span className="text-slate-500 ml-2">({ebilty.financials.paymentMode})</span>
              </div>
              <div className="text-slate-600 font-mono">
                Platform Escrow: <b>PKR {ebilty.financials.freightAmount.toLocaleString()}</b> &bull; Status: <b className="text-emerald-700">{ebilty.financials.isPaid ? 'PAID & VERIFIED' : 'HELD IN ESCROW'}</b>
              </div>
            </div>

            {/* Legal Terms of Carriage */}
            <div className="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-[9px] text-slate-500 leading-tight">
              <b>CONDITIONS OF CARRIAGE:</b> Goods received in apparent good order and condition. Carrier is responsible for safe delivery subject to force majeure, highway road conditions, and certified weighing scales. Consignment is verified via digital SHA-256 tokens and protected under E-Broker Escrow Guarantee.
            </div>

            {/* Verification QR Code & Authorized Signatures */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t-2 border-slate-900 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white border border-slate-400 rounded-md shrink-0">
                  <QRCodeSVG value={ebilty.qrCodeData} size={72} level="M" />
                </div>
                <div className="text-xs">
                  <div className="font-black text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Police & Customs Roadside Token
                  </div>
                  <p className="text-slate-500 text-[10px]">Scan QR code to verify digital authority on national highways.</p>
                  <p className="font-mono text-slate-800 text-[10px] font-bold mt-0.5">Token: {ebilty.verificationCode}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-6 text-center text-xs">
                <div>
                  <div className="w-28 border-t border-slate-900 pt-1 font-bold text-[10px]">Consignor Signature</div>
                  <div className="text-[9px] text-slate-400 font-mono">{ebilty.shipper.city}</div>
                </div>
                <div>
                  <div className="w-28 border-t border-slate-900 pt-1 font-bold text-[10px]">Carrier Stamp</div>
                  <div className="text-[9px] text-emerald-700 font-bold">DIGITALLY STAMPED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
