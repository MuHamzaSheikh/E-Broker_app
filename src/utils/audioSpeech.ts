/**
 * Audio speech helper for illiterate/low-literacy users
 * Speaks announcements in Urdu or English using the Web Speech API
 */

let isMutedState = false;

export function isAudioMuted(): boolean {
  return isMutedState;
}

export function setAudioMuted(muted: boolean): void {
  isMutedState = muted;
  if (muted && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, lang: 'ur' | 'en' = 'ur') {
  if (isMutedState) {
    return;
  }

  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any active utterance

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try to find an Urdu voice, or fallback to Hindi / generic multilingual voice
  const voices = window.speechSynthesis.getVoices();
  if (lang === 'ur') {
    const urduVoice = voices.find((v) => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
    if (urduVoice) {
      utterance.voice = urduVoice;
      utterance.lang = urduVoice.lang;
    } else {
      utterance.lang = 'hi-IN'; // Closest phonetic acoustic match for Urdu
    }
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
}

