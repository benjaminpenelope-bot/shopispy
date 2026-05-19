import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ScanAnimation } from "@/components/landing/ScanAnimation";
import { DemoMockup } from "@/components/landing/DemoMockup";
import { WhyItWorks } from "@/components/landing/WhyItWorks";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ScanAnimation />
        <DemoMockup />
        <WhyItWorks />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
