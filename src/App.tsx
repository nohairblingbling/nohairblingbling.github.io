import Nav from './components/Nav';
import Hero from './components/Hero';
import Research from './components/Research';
import Publications from './components/Publications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TargetCursor from './components/reactbits/TargetCursor';

export default function App() {
  return (
    <>
      <TargetCursor />
      <Nav />
      <main>
        <Hero />
        <Research />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
