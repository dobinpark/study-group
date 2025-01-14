'use client';

import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../lib/createEmotionCache';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { validateEnv } from '../lib/env';

validateEnv();

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ErrorBoundary>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ErrorBoundary>
    </CacheProvider>
  );
}
