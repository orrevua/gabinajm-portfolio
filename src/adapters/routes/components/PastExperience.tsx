import type { FC } from "react";
import Image from "next/image";
import { type ExperienceCompany } from "@domain";

export interface PastExperienceProps {
  heading?: string;
  companies: ExperienceCompany[];
}

export const PastExperience: FC<PastExperienceProps> = ({
  heading = "Past Experience",
  companies,
}) => {
  const displayHeading = heading;
  if (!companies || companies.length === 0) return null;

  return (
    <section className="container-max py-12 md:py-20 text-center" aria-label={displayHeading}>
      <h2 className="text-[36px] font-bold bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent mb-10">
        {displayHeading}
      </h2>

      <div className="grid grid-cols-2 md:flex md:items-center md:justify-center gap-6 md:gap-8 max-w-[180px] md:max-w-none mx-auto">
        {companies.map((company) => {
          const logoContent = (
            <div
              className="w-[56px] h-[56px] md:w-[75px] md:h-[75px] rounded-2xl overflow-hidden shadow-sm transition-all duration-500 grayscale hover:grayscale-0 mx-auto"
              title={company.name}
            >
              <Image
                src={company.logo.url}
                alt={company.logo.alt || company.name}
                width={75}
                height={75}
                className="object-cover w-full h-full"
              />
            </div>
          );

          return company.url ? (
            <a key={company.name} href={company.url} target="_blank" rel="noopener noreferrer">
              {logoContent}
            </a>
          ) : (
            <div key={company.name}>{logoContent}</div>
          );
        })}
      </div>
    </section>
  );
};
