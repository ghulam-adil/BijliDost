import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { getTranslation, TranslationKey } from '@/i18n';
import { isRtlLanguage } from '@/i18n/rtl';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Convenient hook to get the active translation function and RTL direction.
 * `t` only accepts keys that exist in the locale schema.
 */
export function useTranslation() {
  const language = useAppSelector((state) => state.preferences.language);
  const isRtl = isRtlLanguage(language);

  const t = (key: TranslationKey) => getTranslation(language, key);

  return { t, language, isRtl };
}
