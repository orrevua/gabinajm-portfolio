/**
 * Shared domain types and enums
 */

export type SocialPlatform = "github" | "linkedin" | "twitter" | "email" | "instagram";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ImageHotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface SanityImageAsset {
  id?: string;
  url: string;
  alt: string;
  lqip: string;
}

export interface ProfileAvatar {
  asset: SanityImageAsset;
  alt: string;
}

export interface SkillTag {
  name: string;
  iconUrl?: string;
  color?: string;
}

export interface ExperienceCompany {
  name: string;
  logo: SanityImageAsset;
  url: string | null;
}

export interface PortableTextMarkDefinition {
  _key: string;
  _type: string;
  href?: string;
}

export interface PortableTextSpan {
  _key: string;
  _type: "span";
  text: string;
  marks: string[];
}

export interface PortableTextBlock {
  _key: string;
  _type: "block";
  style?: string;
  children: PortableTextSpan[];
  markDefs?: PortableTextMarkDefinition[];
}

export interface ProjectImage {
  asset: SanityImageAsset;
  alt: string;
  lqip: string;
  assetRef?: string;
  crop?: ImageCrop;
  hotspot?: ImageHotspot;
}

export interface Technology {
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Other";
  iconUrl?: string;
  color?: string;
}

export interface ContentSectionImage {
  asset?: { url: string; lqip?: string; dimensions?: { width: number; height: number } };
  alt?: string;
  span?: number;
}

export interface ContentSectionCard {
  metric: string;
  label: string;
}

export type RichTextBody = PortableTextBlock[] | string;

const HEX_RE = /^#?([0-9a-fA-F]{3,8})$/;

export function resolveColor(value: string | undefined): { className?: string; style?: { backgroundColor: string } } {
  if (!value) return {};
  const v = value.trim();
  const m = HEX_RE.exec(v);
  if (m) return { style: { backgroundColor: `#${m[1]}` } };
  return { className: v };
}

export function toPlainText(body: RichTextBody | undefined): string {
  if (!body) return "";
  if (typeof body === "string") return body;
  return body
    .filter((b) => b._type === "block")
    .map((b) => b.children.map((c) => c.text).join(""))
    .join("\n");
}

export interface TextColumnItem {
  iconUrl?: string;
  heading?: string;
  body?: RichTextBody;
  useCard?: boolean;
  bgColor?: string;
  textColor?: string;
}

export interface ContentSection {
  _type: string;
  _key: string;
  sectionLabel?: string;
  heading?: string;
  body?: RichTextBody;
  bullets?: string[];
  bgColor?: string;
  textColor?: string;
  subtitle?: RichTextBody;
  caption?: string;
  columns?: number;
  imageAspectRatio?: "auto" | "214/100" | "3/4" | "1/1" | "16/9" | "4/1";
  imageFit?: "cover" | "contain";
  alt?: string;
  image?: ContentSectionImage;
  images?: ContentSectionImage[];
  cards?: ContentSectionCard[];
  videoUrl?: string;
  externalUrl?: string;
  poster?: ContentSectionImage;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  useCard?: boolean;
  noPadding?: boolean;
  textColumns?: TextColumnItem[];
}

export interface SectionChip {
  label: string;
  color?: string;
}

export interface SectionValueItem {
  title: string;
  description: string;
}

export interface SectionCompany {
  name: string;
  url?: string;
  logo: SanityImageAsset;
}

export interface SectionSocialLink {
  platform: string;
  url: string;
}

export interface SectionContentBlock {
  _type: string;
  _key: string;
  heading?: string;
  body?: string;
  chips?: SectionChip[];
  ctaLabel?: string;
  ctaHref?: string;
  items?: SectionValueItem[];
  companies?: SectionCompany[];
  links?: SectionSocialLink[];
  availabilityText?: string;
  skills?: SkillTag[];
  resumeUrl?: string;
  showResume?: boolean;
  showSkills?: boolean;
}

export type SectionPadding = "none" | "small" | "medium" | "large";

export type SectionBackgroundType = "color" | "image";

export interface SectionBackground {
  type: SectionBackgroundType;
  color?: string;
  imageUrl?: string;
  imageLqip?: string;
  imageAlt?: string;
}

export type SectionOverlay = "none" | "light" | "dark";

export enum FetchErrorCode {
  NOT_FOUND = "NOT_FOUND",
  NETWORK_ERROR = "NETWORK_ERROR",
  INVALID_DATA = "INVALID_DATA",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class FetchError extends Error {
  constructor(
    public code: FetchErrorCode,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "FetchError";
  }
}
