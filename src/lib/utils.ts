import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPineconeNamespace(input: string): string {
  if (!input) {
      return '';
  }

  // Convert to lowercase
  let result = input.toLowerCase();

  // Replace spaces with underscores
  result = result.replace(/\s+/g, '_');

  // Remove any non-alphanumeric characters except underscores and hyphens
  result = result.replace(/[^a-z0-9_-]/g, '');

  // Ensure the string starts with a letter or underscore (Pinecone requirement)
  if (!/^[a-z_]/.test(result)) {
      result = '_' + result;
  }

  // Truncate to maximum length (63 characters is Pinecone's limit)
  if (result.length > 63) {
      result = result.substring(0, 63);
  }

  return result;
}