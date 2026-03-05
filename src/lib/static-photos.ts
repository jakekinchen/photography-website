import fs from "fs";
import path from "path";
import photoOrderManifest from "./photo-order-manifest.json";

export interface StaticPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  blurData: string;
  aspectRatio: number;
  width: number;
  height: number;
  make?: string;
  model?: string;
  lensModel?: string;
  focalLength35mm?: number;
  fNumber?: number;
  exposureTime?: number;
  iso?: number;
  dateTimeOriginal?: string | Date;
}

export interface CategorySet {
  id: string;
  category: string;
  coverPhoto: StaticPhoto;
  photos: StaticPhoto[];
  photoCount: number;
}

const PHOTO_DIR = path.join(process.cwd(), "public", "jakekinchen-photos");
const CATEGORY_DISPLAY_ORDER = [
  "portraits",
  "landscapes",
  "events",
  "real-estate",
];
const ORDER_MANIFEST = photoOrderManifest as Record<string, string[]>;

// Simple placeholder blur data (gray)
const DEFAULT_BLUR_DATA = "L6PZfSi_.AyE_3t7t7R**0teleEe";

// Get photo dimensions from filename pattern or use defaults
function getPhotoDimensions(filename: string): {
  width: number;
  height: number;
  aspectRatio: number;
} {
  // Filenames contain resolution hints like _rw_1920 or _rw_3840
  const match = filename.match(/_rw_(\d+)/);
  const width = match ? parseInt(match[1]) : 1920;
  // Assume 3:2 aspect ratio for photos
  const height = Math.round(width * (2 / 3));
  return { width, height, aspectRatio: width / height };
}

// Format category name for display
function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizedImageName(filename: string): string {
  return filename.toLowerCase().replace(/\.(jpe?g|png|webp)$/i, "");
}

function orderPhotoFiles(category: string, files: string[]): string[] {
  const order = ORDER_MANIFEST[category] ?? [];
  if (order.length === 0) {
    return [...files].sort((a, b) => a.localeCompare(b));
  }

  const exactOrder = new Map<string, number>();
  const normalizedOrder = new Map<string, number>();

  order.forEach((filename, index) => {
    const lower = filename.toLowerCase();
    exactOrder.set(lower, index);

    const normalized = normalizedImageName(lower);
    if (!normalizedOrder.has(normalized)) {
      normalizedOrder.set(normalized, index);
    }
  });

  const getRank = (filename: string): number => {
    const lower = filename.toLowerCase();
    const exactMatch = exactOrder.get(lower);
    if (exactMatch !== undefined) {
      return exactMatch;
    }

    const normalized = normalizedImageName(lower);
    const normalizedMatch = normalizedOrder.get(normalized);
    if (normalizedMatch !== undefined) {
      return normalizedMatch + 0.5;
    }

    return Number.MAX_SAFE_INTEGER;
  };

  return [...files].sort((a, b) => {
    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return a.localeCompare(b);
  });
}

// Get all photos from a category folder
function getPhotosFromCategory(category: string): StaticPhoto[] {
  const categoryPath = path.join(PHOTO_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  const photoFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  const orderedPhotoFiles = orderPhotoFiles(category, photoFiles);

  return orderedPhotoFiles.map((file) => {
    const { width, height, aspectRatio } = getPhotoDimensions(file);
    const id = file.replace(/\.[^.]+$/, ""); // Remove extension for ID

    return {
      id,
      url: `/jakekinchen-photos/${category}/${file}`,
      title: formatCategoryName(category),
      category,
      blurData: DEFAULT_BLUR_DATA,
      aspectRatio,
      width,
      height,
    };
  });
}

// Get all categories
function getCategories(): string[] {
  if (!fs.existsSync(PHOTO_DIR)) {
    return [];
  }

  const categories = fs
    .readdirSync(PHOTO_DIR)
    .filter((item) => {
      const itemPath = path.join(PHOTO_DIR, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith(".");
    });

  const preferred = CATEGORY_DISPLAY_ORDER.filter((category) =>
    categories.includes(category)
  );
  const remaining = categories
    .filter((category) => !preferred.includes(category))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...remaining];
}

// Get all photos across all categories
export function getAllPhotos(): StaticPhoto[] {
  const categories = getCategories();
  return categories.flatMap((category) => getPhotosFromCategory(category));
}

const LANDING_FEATURED_CATEGORIES = ["events", "portraits"];

function interleavePhotos(photoGroups: StaticPhoto[][]): StaticPhoto[] {
  const maxLength = Math.max(...photoGroups.map((group) => group.length), 0);
  const result: StaticPhoto[] = [];

  for (let index = 0; index < maxLength; index++) {
    for (const group of photoGroups) {
      const photo = group[index];
      if (photo) {
        result.push(photo);
      }
    }
  }

  return result;
}

// Get featured photos for landing carousel
export function getFeaturedPhotos(limit: number = 10): StaticPhoto[] {
  const prioritizedGroups = LANDING_FEATURED_CATEGORIES.map((category) =>
    getPhotosFromCategory(category).slice(0, limit)
  ).filter((group) => group.length > 0);

  const prioritized = interleavePhotos(prioritizedGroups);

  if (prioritized.length >= limit) {
    return prioritized.slice(0, limit);
  }

  const remainingCategories = getCategories().filter(
    (category) => !LANDING_FEATURED_CATEGORIES.includes(category)
  );

  const remainder = remainingCategories.flatMap((category) =>
    getPhotosFromCategory(category)
  );

  return [...prioritized, ...remainder].slice(0, limit);
}

// Get category sets (similar to city sets but by category)
export function getCategorySets(): CategorySet[] {
  const categories = getCategories();

  return categories.map((category) => {
    const photos = getPhotosFromCategory(category);
    const coverPhoto = photos[0] || {
      id: category,
      url: "/placeholder.svg",
      title: formatCategoryName(category),
      category,
      blurData: DEFAULT_BLUR_DATA,
      aspectRatio: 1.5,
      width: 1920,
      height: 1280,
    };

    return {
      id: category,
      category: formatCategoryName(category),
      coverPhoto,
      photos,
      photoCount: photos.length,
    };
  });
}

// Get photos by category
export function getPhotosByCategory(category: string): StaticPhoto[] {
  return getPhotosFromCategory(category);
}

// Get a single photo by ID
export function getPhotoById(id: string): StaticPhoto | null {
  const allPhotos = getAllPhotos();
  return allPhotos.find((photo) => photo.id === id) || null;
}
