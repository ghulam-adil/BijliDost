import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { getTranslation } from '@/i18n';
import { isRtlLanguage } from '@/i18n/rtl';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Convenient hook to get the active translation function and RTL direction
 */
export function useTranslation() {
  const language = useAppSelector((state) => state.preferences.language);
  const isRtl = isRtlLanguage(language);

  const t = (path: string) => getTranslation(language, path);

  return { t, language, isRtl };
}

