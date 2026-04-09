import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ComponentType, SvelteComponent } from "svelte";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type WithElementRef<T, TElement extends SvelteComponent = SvelteComponent> = T & {
  ref?: ComponentType<TElement>;
};
