import { register, init } from 'svelte-i18n';
import { language } from './config';

register('en', () => import('./lang/en.json'));
register('de', () => import('./lang/de.json'));

init({
  fallbackLocale: 'de',
  initialLocale: language
});
