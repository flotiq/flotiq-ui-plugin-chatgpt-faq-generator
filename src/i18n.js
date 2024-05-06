import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        ApiKey: 'OpenAI API key',
        GenerateFaq: 'Generate FAQ',
        ConfigurePlugin:
          'Plugin is not configured. Enter API key in configuration.',
        Generated: 'FAQ generated. Remember to save document',
        EmptyOptions: 'None available models found',
        FieldRequired: 'This value should not be blank',
        SaveChanges: 'Save changes',
        SavingError:
          'Something occured while updating plugin settings. Check console for more informations',
      },
    },
    pl: {
      translation: {
        ApiKey: 'Klucz API OpenAI',
        GenerateFaq: 'Generuj FAQ',
        ConfigurePlugin:
          'Wtyczka nie jest skonfigurowana. Wpisz klucz API w konfiguracji.',
        Generated: 'Zawartość FAQ wygenerowana. Pamiętaj aby zapisać.',
        EmptyOptions: 'Nie znaleziono dostępnych modeli',
        FieldRequired: 'Ta wartość nie powinna być pusta',
        SaveChanges: 'Zapisz zamiany',
        SavingError:
          'Coś poszło nie tak podczas zapisywania ustawień wtyczki. Sprawdź konsolę, aby uzyskać więcej informacji',
      },
    },
  },
});

export default i18n;
