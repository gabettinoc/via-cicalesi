import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { Scenarios } from '@/components/Scenarios';
import { TechSpecs } from '@/components/TechSpecs';
import { VideoTour } from '@/components/VideoTour';
import { HowItWorks } from '@/components/HowItWorks';
import { BookingSection } from '@/components/BookingSection';
import { Footer } from '@/components/Footer';
import { MobileCta } from '@/components/MobileCta';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Scenarios />
        <TechSpecs />
        <VideoTour />
        <HowItWorks />
        <BookingSection />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
