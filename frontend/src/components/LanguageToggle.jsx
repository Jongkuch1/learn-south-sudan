import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n'; // ensure i18n is initialized (adjust path if needed)

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    // document.dir will be handled by i18n.on('languageChanged') in i18n.js
  };

  return (
    <button onClick={toggle} aria-label={t('language')}>
      {i18n.language === 'ar' ? 'EN' : 'AR'}
    </button>
  );
};

export default LanguageToggle;
