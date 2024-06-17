'use client';
import { Suspense } from 'react';
import { EsqueciSenhaPageComponent } from './components/pageComponent';
export default function EsqueciSenha() {
  return (
    <Suspense>
      <EsqueciSenhaPageComponent />
    </Suspense>
  );
}
