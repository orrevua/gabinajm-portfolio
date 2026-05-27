import {
  SectionBackground,
  SectionPadding,
  SectionOverlay,
  FetchError,
  FetchErrorCode,
} from "../types";

export interface ISection {
  readonly id: string;
  readonly uid: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly content: unknown[];
  readonly background: SectionBackground | null;
  readonly overlay: SectionOverlay;
  readonly padding: SectionPadding;
  readonly order: number;
}

export class Section implements ISection {
  readonly id: string;
  readonly uid: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly content: unknown[];
  readonly background: SectionBackground | null;
  readonly overlay: SectionOverlay;
  readonly padding: SectionPadding;
  readonly order: number;

  constructor(data: ISection) {
    Section.validate(data);
    this.id = data.id;
    this.uid = data.uid.trim().toLowerCase();
    this.title = data.title.trim();
    this.subtitle = data.subtitle?.trim() || null;
    this.content = data.content;
    this.background = data.background;
    this.overlay = data.overlay;
    this.padding = data.padding;
    this.order = data.order;
  }

  private static validate(data: unknown): asserts data is ISection {
    if (!data || typeof data !== "object") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Section data must be a non-null object",
        400
      );
    }

    const section = data as Record<string, unknown>;

    if (!section.id || typeof section.id !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Section id is required and must be a string",
        400
      );
    }

    if (!section.uid || typeof section.uid !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Section uid is required and must be a string",
        400
      );
    }

    if (!section.title || typeof section.title !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Section title is required and must be a string",
        400
      );
    }

    if (!Array.isArray(section.content)) {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Section content must be an array",
        400
      );
    }
  }

  static tryCreate(data: unknown): Section | null {
    try {
      return new Section(data as ISection);
    } catch {
      return null;
    }
  }

  hasBackground(): boolean {
    return this.background !== null;
  }

  hasImageBackground(): boolean {
    return this.background?.type === "image" && !!this.background.imageUrl;
  }

  hasColorBackground(): boolean {
    return this.background?.type === "color" && !!this.background.color;
  }
}
