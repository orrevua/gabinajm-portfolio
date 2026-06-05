/**
 * Domain layer barrel exports
 * Centralizes all domain types, models, and interfaces for clean imports
 */

// Types
export * from "./types";

// Models
export { Profile, type IProfile } from "./models/Profile";
export { Project, type IProject } from "./models/Project";
export { Section, type ISection } from "./models/Section";

// Interfaces
export type { IDataService, HomePage } from "./interfaces/DataService";
export { NullDataService } from "./interfaces/DataService";
