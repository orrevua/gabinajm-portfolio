import type { Section } from "@/src/domain/models/Section";
import { AboutSection } from "./AboutSection";
import { PastExperience } from "./PastExperience";
import { ContactSection } from "./ContactSection";
import { ValuesSection } from "./ValuesSection";
import { SectionBlock } from "./SectionBlock";
import { ScrollReveal } from "./ScrollReveal";
import type { ExperienceCompany } from "@/src/domain/types";

interface SectionRouterProps {
  section: Section;
  showMoreLabel?: string;
  resumeLabel?: string;
}

export function SectionRouter({ section, showMoreLabel, resumeLabel }: SectionRouterProps) {
  switch (section.sectionType) {
    case "about-preview": {
      const block = section.contentBlocks.find((b) => b._type === "aboutPreviewBlock");
      return (
        <ScrollReveal>
          <AboutSection
            heading={section.title}
            body={block?.body}
            showResume={block?.showResume}
            showSkills={block?.showSkills}
            showMoreLabel={showMoreLabel}
            resumeLabel={resumeLabel}
            resumeUrl={block?.resumeUrl}
            technologies={block?.skills}
          />
        </ScrollReveal>
      );
    }
    case "past-experience": {
      const block = section.contentBlocks.find((b) => b._type === "companyLogos");
      const companies: ExperienceCompany[] = (block?.companies || []).map((c) => ({
        name: c.name,
        url: c.url || null,
        logo: c.logo,
      }));
      if (companies.length === 0) return null;
      return (
        <ScrollReveal>
          <PastExperience companies={companies} heading={section.title} />
        </ScrollReveal>
      );
    }
    case "contact": {
      const block = section.contentBlocks.find((b) => b._type === "socialLinksBlock");
      const socialLinks = block?.links || [];
      const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");
      return (
        <ScrollReveal>
          <ContactSection
            heading={section.title}
            subtitle={section.subtitle || undefined}
            email={email}
            socialLinks={socialLinks.filter((l) => l.platform !== "email")}
            availabilityText={block?.availabilityText}
          />
        </ScrollReveal>
      );
    }
    case "values": {
      const block = section.contentBlocks.find((b) => b._type === "valueCards");
      return (
        <ScrollReveal>
          <ValuesSection
            heading={block?.heading || section.title}
            values={block?.items}
          />
        </ScrollReveal>
      );
    }
    default:
      return (
        <ScrollReveal>
          <SectionBlock section={section} />
        </ScrollReveal>
      );
  }
}
