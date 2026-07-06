import { RootState, store } from "../redux/store";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import ReactNativeBlobUtil from "react-native-blob-util";

// Tuned for LLM token efficiency. 128px JPEG @ q25 is ~10-20x smaller than the
// 500px images stored in the app while remaining usable by vision models.
const LLM_IMAGE_WIDTH = 128;
const LLM_IMAGE_HEIGHT = 128;
const LLM_IMAGE_FORMAT = "JPEG" as const;
const LLM_IMAGE_QUALITY = 25;

async function compressImageForLLM(originalBase64: string): Promise<string> {
  if (!originalBase64) return "";

  const fs = ReactNativeBlobUtil.fs;
  const cacheDir = fs.dirs.CacheDir;
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const inputPath = `${cacheDir}/llm_in_${unique}.jpg`;
  let outputUri: string | null = null;

  try {
    await fs.writeFile(inputPath, originalBase64, "base64");

    const resized = await ImageResizer.createResizedImage(
      `file://${inputPath}`,
      LLM_IMAGE_WIDTH,
      LLM_IMAGE_HEIGHT,
      LLM_IMAGE_FORMAT,
      LLM_IMAGE_QUALITY,
      0,
      null
    );
    outputUri = resized.uri;

    const compressedBase64 = await fs.readFile(outputUri, "base64");
    return compressedBase64;
  } catch (error) {
    console.warn("[LLM Export] Image compression failed, falling back to original:", error);
    return originalBase64;
  } finally {
    try {
      await fs.unlink(inputPath);
    } catch {}
    if (outputUri) {
      try {
        await fs.unlink(outputUri);
      } catch {}
    }
  }
}

export const generateLLMText = async (includeImages: boolean): Promise<string> => {
  if (!store) {
    return "Error: Store not initialized";
  }

  const state: RootState = store.getState();
  const now = new Date().toISOString();

  let md = `# ClosetArchive Wardrobe Export\n\n`;
  md += `**Generated:** ${now}\n`;
  md += `**Images included:** ${includeImages ? `YES (downscaled ${LLM_IMAGE_WIDTH}px JPEG q=${LLM_IMAGE_QUALITY} thumbnails for LLM)` : "NO (text only, smaller context)"}\n\n`;

  // Minimal settings
  md += `## Settings\n`;
  md += `- Name: ${state.settings.name}\n`;
  md += `- Laundry reminder: every ${state.settings.laundryNumber} wears\n\n`;

  // Categories + custom types
  md += `## Categories\n`;
  state.CategoryList.Categories.forEach((cat, i) => {
    const custom = state.CategoryList.CategoryCustomTypes[i]?.customTypes || [];
    const typeList = custom.map((t) => t.label).join(", ");
    md += `- [${i}] ${cat.name?.[0] || "Category"}: ${typeList || "(no custom types)"}\n`;
  });
  md += `\n`;

  // Collections
  md += `## Collections\n`;
  const collections = state.itemsList.collectionTags;
  if (collections.length === 0) {
    md += `(none)\n\n`;
  } else {
    collections.forEach((c) => {
      md += `- ${c.label}${c.color ? ` (color: ${c.color})` : ""}\n`;
    });
    md += `\n`;
  }

  // Items - main data
  const items = state.itemsList.items;

  // Pre-compute compressed images in parallel when needed (much faster for large closets)
  let compressedImages: string[] = [];
  if (includeImages) {
    const compressionPromises = items.map((item) =>
      item.image ? compressImageForLLM(item.image) : Promise.resolve("")
    );
    compressedImages = await Promise.all(compressionPromises);
  }

  md += `## Items (${items.length})\n\n`;
  items.forEach((item, index) => {
    md += `### ${index + 1}. ${item.name || "(unnamed)"}\n`;
    md += `- id: ${item.id}\n`;
    md += `- category: ${item.category}\n`;
    md += `- type: ${item.type}\n`;
    md += `- fit: ${item.fit}\n`;
    md += `- size: ${item.size} ${item.sizeUnit || ""}\n`;
    md += `- quantity: ${item.quantity}\n`;
    if (item.season) md += `- season: ${item.season}\n`;
    if (item.purchaseDate) md += `- purchaseDate: ${item.purchaseDate}\n`;
    const colors = [item.primaryColor, item.secondaryColor, item.tertiaryColor]
      .filter(Boolean)
      .join(" / ");
    md += `- colors: ${colors || "none"} (auto: ${!!item.automaticColor})\n`;
    md += `- laundry: counter=${item.laundryCounter}, laundryable=${item.laundryable}, overrideMax=${item.overrideMaxLaundry}, maxNumber=${item.maxLaundryNumber}\n`;
    if (item.collection && item.collection.length > 0) {
      md += `- collections: ${item.collection.join(", ")}\n`;
    }
    if (item.logIds && item.logIds.length > 0) {
      md += `- logIds: ${item.logIds.join(", ")}\n`;
    }

    let imgField: string;
    if (includeImages && item.image) {
      const compressed = compressedImages[index] || "";
      imgField = `data:image/jpeg;base64,${compressed}`;
    } else if (item.image) {
      imgField = "[IMAGE_OMITTED]";
    } else {
      imgField = "[NO_IMAGE]";
    }
    md += `- image: ${imgField}\n\n`;
  });

  // Logs
  const logs = state.itemsList.logs;
  md += `## Logs (${logs.length})\n\n`;
  if (logs.length === 0) {
    md += `(no logs recorded)\n\n`;
  } else {
    logs.forEach((log) => {
      md += `- ${log.eventDate} | "${log.eventName}" (id: ${log.eventId})\n`;
      if (log.additionalNotes) md += `  notes: ${log.additionalNotes}\n`;
      if (log.logTime) md += `  logTime: ${log.logTime}\n`;
    });
    md += `\n`;
  }

  // Instruct the LLM to ask the user questions, with a couple of examples
  md += `---

Here is my wardrobe data.

Ask me what questions I have or what I need help with.

Here are a few examples:
- what best pants work with this shirt?
- what best goes with current weather?
- what shoes match this top?
`;

  return md;
};
