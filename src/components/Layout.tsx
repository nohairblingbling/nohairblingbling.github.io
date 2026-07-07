import type { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Noise from './reactbits/Noise';
import TargetCursor from './reactbits/TargetCursor';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Noise />
      <TargetCursor />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
