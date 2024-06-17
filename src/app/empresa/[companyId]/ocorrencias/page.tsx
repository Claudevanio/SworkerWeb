'use client';
import { Suspense } from 'react';
import { OcorrenciasPageComponent } from './components/OcurrencePageComponent';

export default function Ocorrencias() {
  return (
    <Suspense>
      <OcorrenciasPageComponent />
    </Suspense>
  );
}
