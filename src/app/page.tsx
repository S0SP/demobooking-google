import { headers } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ValueProps } from "@/components/ValueProps";
import { TrustedBy } from "@/components/TrustedBy";
import { SelectionCriteria } from "@/components/SelectionCriteria";
import { ComparisonChecklist } from "@/components/ComparisonChecklist";
import { SlimBanner } from "@/components/SlimBanner";
import { ProgramsOffered } from "@/components/ProgramsOffered";
import { MentorshipShowcase } from "@/components/MentorshipShowcase";
import { SuccessStories } from "@/components/SuccessStories";
import { CtaAndFooter } from "@/components/CtaAndFooter";
import { FloatingCTA } from "@/components/FloatingCTA";
import { DemoBookingPopup } from "@/components/DemoBookingPopup";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { TeacherTimeline } from "@/components/TeacherTimeline";
import { ComparisonGrid } from "@/components/ComparisonGrid";

export default async function Home() {
  const headersList = await headers();

  // These will be populated on Vercel production
  const serverCountryISO = headersList.get("x-vercel-ip-country");
  const serverTimezone = headersList.get("x-vercel-ip-timezone");

  return (
    <main className="min-h-screen bg-[var(--bg-base)] transition-colors duration-300">
      <Navbar />

      <HeroSection
        serverIso={serverCountryISO}
        serverTimezone={serverTimezone}
      />
      <ValueProps />
      <FeaturesSection />
      <ExperienceSection />
      <SelectionCriteria />
      <TrustedBy />
      <ComparisonChecklist />
      <SlimBanner />
      <ComparisonGrid />
      <TeacherTimeline />
      <ProgramsOffered />
      <MentorshipShowcase />
      <SuccessStories />
      <CtaAndFooter />
      <FloatingCTA />
      
      <DemoBookingPopup 
        serverIso={serverCountryISO}
        serverTimezone={serverTimezone}
      />
    </main>
  );
}
