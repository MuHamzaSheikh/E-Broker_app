import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Bid, Load } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle2,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

interface PaymentGatewayModalProps {
  load: Load;
  bid: Bid;
  onSuccess: (paymentDetails: {
    method: string;
    transactionId: string;
    paidAmount: number;
    reference: string;
  }) => void;
  onClose: () => void;
}

type PaymentMethod = 'jazzcash' | 'easypaisa' | 'raast' | 'card' | '1link_bank' | 'wallet';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  load,
  bid,
  onSuccess,
  onClose
}) => {
  const { language, currentUser } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('jazzcash');
  const [step, setStep] = useState<'details' | 'otp' | 'processing' | 'receipt'>('details');
  const [copiedPsid, setCopiedPsid] = useState(false);

  // Form Fields
  const [mobileNumber, setMobileNumber] = useState('0302-8492019');
  const [raastId, setRaastId] = useState('03028492019');
  const [selectedBank, setSelectedBank] = useState('Meezan Bank Limited');
  const [cardNumber, setCardNumber] = useState('4214 •••• •••• 8492');
  const [cardHolder, setCardHolder] = useState(currentUser.name || 'Haji Malik & Sons');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [otpCode, setOtpCode] = useState('749201');

  // Generated references
  const [transactionId] = useState(`TXN-PK-${Math.floor(100000 + Math.random() * 900000)}`);
  const [oneBillPsid] = useState(`100294${Math.floor(100000 + Math.random() * 900000)}`);
  const [receiptDate] = useState(new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }));

  const grossAmount = bid.bidAmount;
  const platformFee = 0; // Free for shipper, carrier pays 5% platform fee on settlement
  const totalPayable = grossAmount + platformFee;

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === '1link_bank') {
      // 1Bill PSID generates instant reference
      setStep('otp');
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('receipt');
    }, 2200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPsid(true);
    setTimeout(() => setCopiedPsid(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {language === 'ur' ? 'ای-بروکر محفوظ ادائیگی و ایسکرو گیٹ وے' : 'E-Broker Escrow Payment Gateway'}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SBP 1LINK SECURED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ur'
                  ? 'رقم اسٹیٹ بینک ایسکرو میں محفوظ رہے گی اور مال پہنچنے پر ہی ٹرانسپورٹر کو منتقل ہو گی'
                  : '100% Escrow Protection: Funds safely locked until consignee verifies delivery POD'}
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* STEP 1: Method Selection & Billing Details */}
        {step === 'details' && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Invoice & Order Summary */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    {language === 'ur' ? 'لوڈ و روٹ' : 'Order Particulars'}
                  </span>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-2 mt-0.5">
                    <span>{load.originCity}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{load.destinationCity}</span>
                    <span className="text-xs font-mono font-normal text-slate-500">({load.loadNumber})</span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-[11px] font-bold text-slate-500">
                    {language === 'ur' ? 'ٹرانسپورٹر' : 'Carrier Fleet'}:
                  </span>
                  <div className="text-xs font-black text-slate-800">{bid.ownerName}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-700">
                    {language === 'ur' ? 'کل واجب الادا رقم (ایسکرو محفوظ)' : 'Total Amount to Lock in Escrow'}:
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    ✓ {language === 'ur' ? 'کوئی اضافی چارجز نہیں (0% سروس فیس)' : 'Zero Shipper Convenience Fees'}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">
                  PKR {totalPayable.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Choose Payment Method Grid */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5">
                {language === 'ur' ? 'ادائیگی کا ذریعہ منتخب کریں *' : 'Select Payment Method *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. JazzCash */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'jazzcash'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-rose-600 tracking-tight">JazzCash</span>
                    <Smartphone className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'جاز کیش والٹ' : 'JazzCash Wallet'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'موبائل اکاؤنٹ سے ادائیگی' : 'Mobile Account / MPIN'}
                    </div>
                  </div>
                </button>

                {/* 2. EasyPaisa */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'easypaisa'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-emerald-600 tracking-tight">easypaisa</span>
                    <Smartphone className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'ایزی پیسہ والٹ' : 'EasyPaisa Wallet'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'فوری ان ایپ اپروول' : 'Instant In-App Approval'}
                    </div>
                  </div>
                </button>

                {/* 3. Raast Instant Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('raast')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'raast'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black text-amber-600">⚡ RAAST</span>
                    <QrCode className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'راست فوری ادائیگی' : 'Raast SBP Instant'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'اسٹیٹ بینک راست ID' : 'Raast ID / QR Code'}
                    </div>
                  </div>
                </button>

                {/* 4. Debit / Credit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-800">VISA / Master / PayPak</span>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'ڈیبٹ / کریڈٹ کارڈ' : 'Debit / Credit Card'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? '3D سیکیور تصدیق' : '3D Secure Verified'}
                    </div>
                  </div>
                </button>

                {/* 5. 1Link Direct Banking / 1Bill */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('1link_bank')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === '1link_bank'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black text-slate-900">1LINK / 1BILL</span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'آن لائن بینکنگ / 1بل' : 'Online Bank / 1Bill'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'کسی بھی پاکستانی بینک سے' : 'All Pakistani Banks'}
                    </div>
                  </div>
                </button>

                {/* 6. Corporate Freight Account */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMethod === 'wallet'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black text-purple-700">💼 E-Broker</span>
                    <Sparkles className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'ur' ? 'کمپنی کریڈٹ والٹ' : 'Corporate Wallet'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {language === 'ur' ? 'پہلے سے موجود بیلنس' : 'Pre-funded Balance'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Dynamic Form Inputs based on Selected Gateway */}
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              {/* JazzCash / EasyPaisa Fields */}
              {(selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>
                      {selectedMethod === 'jazzcash'
                        ? (language === 'ur' ? 'جاز کیش موبائل نمبر درج کریں' : 'Enter JazzCash Mobile Number')
                        : (language === 'ur' ? 'ایزی پیسہ موبائل نمبر درج کریں' : 'Enter EasyPaisa Mobile Number')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {language === 'ur' ? 'موبائل والٹ نمبر (030X-XXXXXXX)' : 'Registered Mobile Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {language === 'ur'
                      ? 'بٹن دبانے پر آپ کے موبائل پر تصدیقی میسج (USSD Prompt) آئے گا، اپنا خفیہ پن (MPIN) درج کریں۔'
                      : 'You will receive an instant push notification / MPIN prompt on your mobile screen to approve.'}
                  </p>
                </div>
              )}

              {/* Raast SBP Fields */}
              {selectedMethod === 'raast' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>{language === 'ur' ? 'اسٹیٹ بینک راست ID یا فون نمبر' : 'Raast Instant Payment ID'}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {language === 'ur' ? 'راست ID (موبائل نمبر یا IBAN)' : 'Raast ID (Phone or IBAN)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={raastId}
                      onChange={(e) => setRaastId(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                    <span>{language === 'ur' ? 'راست ایسکرو ریفرنس:' : 'Raast Escrow Merchant:'}</span>
                    <span className="font-mono font-bold">ebroker.escrow@sbp</span>
                  </div>
                </div>
              )}

              {/* Card Fields */}
              {selectedMethod === 'card' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {language === 'ur' ? 'کارڈ پر درج نام' : 'Cardholder Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {language === 'ur' ? '16 ہندسوں کا کارڈ نمبر' : '16-Digit Card Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {language === 'ur' ? 'میعاد (MM/YY)' : 'Expiry Date'}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {language === 'ur' ? 'خفیہ کوڈ (CVV)' : 'Security Code (CVV)'}
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 1Link / 1Bill Banking Fields */}
              {selectedMethod === '1link_bank' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {language === 'ur' ? 'اپنا بینک منتخب کریں' : 'Select Bank'}
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
                    >
                      <option value="Meezan Bank Limited">Meezan Bank Limited (میزان بینک)</option>
                      <option value="Habib Bank Limited (HBL)">Habib Bank Limited - HBL (حبیب بینک)</option>
                      <option value="United Bank Limited (UBL)">United Bank Limited - UBL (یونائیٹڈ بینک)</option>
                      <option value="Bank Alfalah">Bank Alfalah (بینک الفلاح)</option>
                      <option value="MCB Bank Limited">MCB Bank Limited (ایم سی بی بینک)</option>
                      <option value="Allied Bank Limited (ABL)">Allied Bank Limited - ABL (الائیڈ بینک)</option>
                      <option value="Faysal Bank">Faysal Bank Islamic (فیصل بینک)</option>
                      <option value="Standard Chartered Pakistan">Standard Chartered Pakistan</option>
                    </select>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold">1Bill Consumer / Invoice PSID:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(oneBillPsid)}
                        className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-[11px] cursor-pointer"
                      >
                        {copiedPsid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPsid ? 'Copied' : 'Copy PSID'}</span>
                      </button>
                    </div>
                    <div className="text-base font-black font-mono text-slate-900 tracking-wider">
                      {oneBillPsid}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Bill Category: <b>1Bill Invoices / Vouchers</b> &bull; Direct 1Link Settlement
                    </div>
                  </div>
                </div>
              )}

              {/* Corporate Wallet */}
              {selectedMethod === 'wallet' && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 text-xs text-purple-900">
                  <div className="flex items-center justify-between font-bold">
                    <span>{language === 'ur' ? 'کمپنی کا دستیاب کریڈٹ بیلنس' : 'Available Shipper Corporate Credit'}:</span>
                    <span className="font-mono text-base font-black text-purple-950">PKR 1,500,000</span>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    {language === 'ur'
                      ? 'رقم آپ کے ماہانہ کریڈٹ اکاؤنٹ سے فوری طور پر ایسکرو میں محفوظ کر دی جائے گی۔'
                      : 'Amount will be reserved from your corporate credit line into trip escrow immediately.'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-xs py-2.5 px-4"
                >
                  {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-3 px-6 shadow-primary-glow flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {language === 'ur'
                      ? `PKR ${totalPayable.toLocaleString()} ایسکرو میں محفوظ کریں`
                      : `Lock PKR ${totalPayable.toLocaleString()} in Escrow`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: 2-Factor OTP Verification Simulator */}
        {step === 'otp' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'ur' ? 'سیکیورٹی تصدیق کوڈ (OTP) درج کریں' : 'Two-Factor Payment Authorization'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {language === 'ur'
                  ? `ہم نے 6 ہندسوں کا سیکیورٹی کوڈ آپ کے رجسٹرڈ نمبر (${mobileNumber}) پر بھیج دیا ہے۔`
                  : `A 6-digit one-time authorization PIN has been dispatched to your registered device.`}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-300">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center text-2xl font-black font-mono tracking-widest text-slate-900 bg-transparent focus:outline-hidden"
                />
              </div>

              <div className="text-[11px] text-slate-400">
                Auto-filled for testing: <span className="font-mono font-bold text-slate-700">749201</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="btn-secondary text-xs flex-1 py-2.5"
                >
                  {language === 'ur' ? 'واپس' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs flex-1 py-2.5 shadow-md"
                >
                  {language === 'ur' ? 'تصدیق کریں' : 'Authorize & Pay'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Gateway Processing Simulator */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                {language === 'ur' ? 'بینک ایسکرو سے رابطہ قائم ہو رہا ہے...' : 'Communicating with State Bank Escrow Switch...'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedMethod.toUpperCase()} &bull; 1Link Payment Switch 256-bit SSL Encrypted
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Official Escrow Receipt & Confirmation */}
        {step === 'receipt' && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'ur' ? 'ادائیگی اور ایسکرو گارنٹی کامیاب!' : 'Payment & Escrow Lock Successful!'}
              </h3>
              <p className="text-xs text-emerald-700 font-bold">
                {language === 'ur'
                  ? 'رقم بحفاظت ایسکرو میں محفوظ ہو چکی ہے۔ ٹرانسپورٹر اب فلیٹ سے گاڑی الاٹ کرے گا۔'
                  : 'Funds securely reserved in Escrow. Transporter will now allocate truck and driver.'}
              </p>
            </div>

            {/* Official Printable Receipt Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-400">TRANSACTION RECEIPT</span>
                  <div className="font-bold text-slate-900 text-sm">{transactionId}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-400">DATE & TIME</span>
                  <div className="text-slate-800 text-[11px]">{receiptDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Order / Load:</span>
                  <div className="font-bold text-slate-900">{load.loadNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500">Route:</span>
                  <div className="font-bold text-slate-900">{load.originCity} &rarr; {load.destinationCity}</div>
                </div>
                <div>
                  <span className="text-slate-500">Payment Channel:</span>
                  <div className="font-bold text-slate-900">{selectedMethod.toUpperCase()}</div>
                </div>
                <div>
                  <span className="text-slate-500">Beneficiary Carrier:</span>
                  <div className="font-bold text-slate-900">{bid.ownerName}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">LOCKED ESCROW AMOUNT:</span>
                <span className="font-black text-emerald-800 text-base">PKR {totalPayable.toLocaleString()}</span>
              </div>
            </div>

            {/* Final Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{language === 'ur' ? 'رسید پرنٹ کریں' : 'Print Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSuccess({
                    method: selectedMethod,
                    transactionId,
                    paidAmount: totalPayable,
                    reference: selectedMethod === '1link_bank' ? oneBillPsid : raastId
                  });
                }}
                className="btn-primary text-xs py-3 px-6 shadow-md flex items-center gap-2"
              >
                <span>{language === 'ur' ? 'فلیٹ الاٹمنٹ کی طرف بڑھیں' : 'Proceed to Transporter Allocation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
