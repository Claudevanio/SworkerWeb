'use client'
import { Logo } from '@/components/Logo';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';

export default function NotFound(){
  const isMobile = useMediaQuery('(max-width:768px)');

  return ( 
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 !absolute z-10 w-screen inset-0">
    <Logo width={isMobile ? '50%' : '300px'} height={isMobile ? 'unset' : '184px'} className="relative z-[1] mb-4" />
    <div className="max-w-md w-full text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        Ops! A página que você está procurando não foi encontrada.
      </p>
      <Link href="/"
        legacyBehavior
      >
        <a className="inline-block px-6 py-3 bg-blue-600 text-white font-medium text-lg rounded-full shadow-md hover:bg-blue-700 transition duration-300">
          Página inicial
        </a>
      </Link>
    </div>
  </div>
  );
}