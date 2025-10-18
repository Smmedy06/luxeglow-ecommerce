import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import FeatureHighlights from '@/components/FeatureHighlights';
import FeaturedProducts from '@/components/FeaturedProducts';
import PhilosophySection from '@/components/PhilosophySection';
import CallToAction from '@/components/CallToAction';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <FeatureHighlights />
        <FeaturedProducts />
        <PhilosophySection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
