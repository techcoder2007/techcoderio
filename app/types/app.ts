import type { ComponentType } from "react";

// Define props interface for each app
export interface AppProps {
  id?: string;
}

// Individual app prop types based on actual component requirements
export interface CalculatorProps {}

export interface ChromeProps {
  id?: string;
}

export interface SpotifyProps {}

export interface TerminalProps {
  id?: string;
}

export interface VSCodeProps {
  id: string;
}

// Create a union type of all possible app component types
export type AppComponent =
  | ComponentType<CalculatorProps>
  | ComponentType<ChromeProps>
  | ComponentType<SpotifyProps>
  | ComponentType<TerminalProps>
  | ComponentType<VSCodeProps>;

// Helper type to extract props from a component
export type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;

// Map of app names to their prop types
export interface AppPropTypes {
  calculator: CalculatorProps;
  chrome: ChromeProps;
  spotify: SpotifyProps;
  terminal: TerminalProps;
  vscode: VSCodeProps;
}

// Map of app names to their components
export interface AppComponents {
  calculator: ComponentType<CalculatorProps>;
  chrome: ComponentType<ChromeProps>;
  spotify: ComponentType<SpotifyProps>;
  terminal: ComponentType<TerminalProps>;
  vscode: ComponentType<VSCodeProps>;
}

// Type-safe app registry
export const APP_COMPONENTS: AppComponents = {
  calculator: () => null, // Will be replaced with actual imports
  chrome: () => null,
  spotify: () => null,
  terminal: () => null,
  vscode: () => null,
} as const;
