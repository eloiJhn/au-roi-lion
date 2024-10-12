import {getRequestConfig} from 'next-intl/server';

export const loadMessages = async (locale = 'fr') => {
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
};

export default getRequestConfig(async () => {
  const locale = 'fr';
  return loadMessages(locale);
});
