import sharp from "sharp";

type RGB = { r: number; g: number; b: number };

export async function extractImageColorAccent(url: string): Promise<string> {
  try {
    // Fetch and process image
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resize to small size for faster processing
    const { data, info } = await sharp(buffer)
      .resize(100, 100, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Extract pixels
    const pixels: RGB[] = [];
    for (let i = 0; i < data.length; i += info.channels) {
      pixels.push({
        r: data[i]!,
        g: data[i + 1]!,
        b: data[i + 2]!,
      });
    }

    // Simple k-means clustering to find dominant colors
    const clusterCount = 6;
    const clusters: RGB[] = [];

    // Initialize with random pixels
    for (let i = 0; i < clusterCount; i++) {
      const randomIdx = Math.floor(Math.random() * pixels.length);
      clusters.push(pixels[randomIdx]!);
    }

    // Run k-means iterations
    for (let iter = 0; iter < 10; iter++) {
      const assignments: number[][] = Array.from({ length: clusterCount }, () => []);

      // Assign pixels to nearest cluster
      for (let i = 0; i < pixels.length; i++) {
        const pixel = pixels[i]!;
        let minDist = Infinity;
        let minIdx = 0;

        for (let j = 0; j < clusters.length; j++) {
          const cluster = clusters[j]!;
          const dist =
            Math.pow(pixel.r - cluster.r, 2) +
            Math.pow(pixel.g - cluster.g, 2) +
            Math.pow(pixel.b - cluster.b, 2);

          if (dist < minDist) {
            minDist = dist;
            minIdx = j;
          }
        }

        assignments[minIdx]!.push(i);
      }

      // Update cluster centers
      for (let j = 0; j < clusters.length; j++) {
        const assignment = assignments[j]!;
        if (assignment.length === 0) continue;

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;

        for (const idx of assignment) {
          const pixel = pixels[idx]!;
          sumR += pixel.r;
          sumG += pixel.g;
          sumB += pixel.b;
        }

        clusters[j] = {
          r: Math.round(sumR / assignment.length),
          g: Math.round(sumG / assignment.length),
          b: Math.round(sumB / assignment.length),
        };
      }
    }

    // Calculate saturation and luminance for each cluster
    const colorsByType = clusters.map((color) => ({
      ...color,
      saturation: getSaturation(color.r, color.g, color.b),
      luminance: getLuminance(color.r, color.g, color.b),
    }));

    // Sort by saturation (high to low) for vibrant colors
    const vibrantColors = [...colorsByType].sort(
      (a, b) => b.saturation - a.saturation,
    );

    // Find vibrant color (high saturation, medium luminance)
    const vibrant = vibrantColors.find(
      (c) => c.saturation > 0.2 && c.luminance > 0.2 && c.luminance < 0.8,
    );

    if (vibrant) {
      return rgbToHex(vibrant.r, vibrant.g, vibrant.b);
    }

    // Fallback to light vibrant
    const lightVibrant = vibrantColors.find(
      (c) => c.saturation > 0.2 && c.luminance > 0.6,
    );

    if (lightVibrant) {
      return rgbToHex(lightVibrant.r, lightVibrant.g, lightVibrant.b);
    }

    // Always return the most saturated color found, no matter what
    const mostSaturated = vibrantColors[0];
    if (mostSaturated) {
      return rgbToHex(mostSaturated.r, mostSaturated.g, mostSaturated.b);
    }

    // This should never happen, but if it does, return first cluster
    return rgbToHex(clusters[0]!.r, clusters[0]!.g, clusters[0]!.b);
  } catch (error) {
    console.error("Error extracting image color:", error);
    return "#e5e7eb";
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  return max === 0 ? 0 : delta / max;
}

function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
