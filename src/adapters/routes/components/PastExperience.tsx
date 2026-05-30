import Image from "next/image";
import { type ExperienceCompany } from "@domain";

export interface PastExperienceProps {
  heading?: string;
  companies: ExperienceCompany[];
}

export const PastExperience: React.FC<PastExperienceProps> = ({
  heading = "Past Experience",
  companies,
}) => {
  const displayHeading = heading;
  if (!companies || companies.length === 0) return null;

  return (
    <section className="container-max py-12 md:py-20 text-center" aria-label={displayHeading}>
      <h2 className="text-2xl md:text-3xl font-extrabold text-accent mb-10">
        {displayHeading}
      </h2>

      <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
        {companies.map((company) => (
          <div
            key={company.name}
            className="w-[75px] h-[75px] rounded-2xl overflow-hidden shadow-sm transition-all duration-500 grayscale hover:grayscale-0"
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
        ))}
      </div>
    </section>
  );
};

PastExperience.displayName = "PastExperience";
