import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Research from './components/Research';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        <section id="publications" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
        <section id="contact" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28" />
      </main>
      <Footer />
    </>
  );
}
