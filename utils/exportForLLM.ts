import { RootState, store } from "../redux/store";

export type LLMExportSections = {
  settings: boolean;
  categories: boolean;
  collections: boolean;
  items: boolean;
  logs: boolean;
};

export const DEFAULT_LLM_EXPORT_SECTIONS: LLMExportSections = {
  settings: true,
  categories: true,
  collections: true,
  items: true,
  logs: true,
};

export const hasAnyLLMExportSection = (sections: LLMExportSections): boolean =>
  Object.values(sections).some(Boolean);

/**
 * Builds a plain-text wardrobe export for pasting into an LLM.
 * Only sections marked true in `sections` are included.
 */
export const generateLLMText = (
  sections: LLMExportSections = DEFAULT_LLM_EXPORT_SECTIONS,
): string => {
  if (!store) {
    return "Error: Store not initialized";
  }

  const state: RootState = store.getState();
  const now = new Date().toISOString();

  let md = `# ClosetArchive Wardrobe Export\n\n`;
  md += `**Generated:** ${now}\n\n`;

  if (sections.settings) {
    md += `## Settings\n`;
    md += `- Name: ${state.settings.name}\n`;
    md += `- Laundry reminder: every ${state.settings.laundryNumber} wears\n\n`;
  }

  if (sections.categories) {
    md += `## Categories\n`;
    state.CategoryList.Categories.forEach((cat, i) => {
      const custom = state.CategoryList.CategoryCustomTypes[i]?.customTypes || [];
      const typeList = custom.map((t) => t.label).join(", ");
      md += `- [${i}] ${cat.name?.[0] || "Category"}: ${typeList || "(no custom types)"}\n`;
    });
    md += `\n`;
  }

  if (sections.collections) {
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
  }

  if (sections.items) {
    const items = state.itemsList.items;
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
      if (
        sections.logs &&
        item.logIds &&
        item.logIds.length > 0
      ) {
        md += `- logIds: ${item.logIds.join(", ")}\n`;
      }
      md += `\n`;
    });
  }

  if (sections.logs) {
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
  }

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
