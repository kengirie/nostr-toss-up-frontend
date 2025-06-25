// Extract image URLs from text content
export function extractImageUrls(content: string): string[] {
  const imageUrlPattern = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?/gi;
  return content.match(imageUrlPattern) || [];
}

// Remove image URLs from text content
export function removeImageUrls(content: string): string {
  const imageUrlPattern = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?/gi;
  return content.replace(imageUrlPattern, '').trim();
}