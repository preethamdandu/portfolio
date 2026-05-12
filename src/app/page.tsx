import LenisProvider from "@/components/global/LenisProvider";
import Navbar from "@/components/global/Navbar";
import MagneticCursor from "@/components/global/MagneticCursor";
import HeroSection from "@/components/hero/HeroSection";
import CapabilitiesSection from "@/components/capabilities/CapabilitiesSection";
import CaseFilesReel from "@/components/work/CaseFilesReel";
import ThesisSection from "@/components/thesis/ThesisSection";
import TimelineSection from "@/components/timeline/TimelineSection";
import NumbersSection from "@/components/numbers/NumbersSection";
import Footer from "@/components/global/Footer";

export default function Home() {
  return (
    <LenisProvider>
      <Navbar />
      <MagneticCursor />
      <main className="w-full">
        <HeroSection />
        <CapabilitiesSection />
        <CaseFilesReel />
        <ThesisSection />
        <TimelineSection />
        <NumbersSection />
        <Footer />
      </main>
    </LenisProvider>
  );
}
