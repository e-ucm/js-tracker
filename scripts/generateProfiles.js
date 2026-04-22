import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROFILES_DIR = path.join(ROOT, "xapi-authored-profiles", "Profile_Server_Profiles");
const OUTPUT_DIR = path.join(ROOT, "src", "HighLevel", "Statement", "Ids", "Profiles", "Generated");

function toConstKey(value) {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();

  if (!normalized) {
    return "UNKNOWN";
  }
  return /^\d/.test(normalized) ? `N_${normalized}` : normalized;
}

function toPascalCase(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function compactProfileConstName(profileLabel, fallbackFileName) {
  const source = profileLabel || fallbackFileName;
  const compact = toConstKey(source).replace(/_/g, "");
  return compact.endsWith("PROFILE") ? compact : `${compact}PROFILE`;
}

function latestCategoryId(profile) {
  if (Array.isArray(profile.versions) && profile.versions.length > 0) {
    const sorted = [...profile.versions].sort((a, b) => {
      const dateA = Date.parse(a?.generatedAtTime || "");
      const dateB = Date.parse(b?.generatedAtTime || "");
      const safeA = Number.isNaN(dateA) ? -Infinity : dateA;
      const safeB = Number.isNaN(dateB) ? -Infinity : dateB;
      return safeB - safeA;
    });
    if (sorted[0]?.id) {
      return sorted[0].id;
    }
  }
  return profile.id || "";
}

function conceptKey(concept) {
  const preferred = concept?.prefLabel?.en;
  if (preferred) {
    return toConstKey(preferred);
  }
  if (concept?.id) {
    const tail = concept.id.split(/[\/#]/).filter(Boolean).pop();
    if (tail) {
      return toConstKey(tail);
    }
  }
  return "UNKNOWN";
}

function pushConcept(target, concept) {
  const baseKey = conceptKey(concept);
  let key = baseKey;
  let i = 2;
  while (Object.prototype.hasOwnProperty.call(target, key)) {
    if (target[key] === concept.id) {
      return;
    }
    key = `${baseKey}_${i}`;
    i += 1;
  }
  target[key] = concept.id;
}

function renderObjectEntries(obj, indent) {
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  if (keys.length === 0) {
    return "{}";
  }
  const lines = keys.map((k) => `${indent}${k}: '${obj[k]}',`);
  return `{\n${lines.join("\n")}\n${indent.slice(0, -4)}}`;
}

function generateProfileFile(profileJson, fileName) {
  const label = profileJson?.prefLabel?.en || path.basename(fileName, ".jsonld");
  const constName = compactProfileConstName(label, fileName);
  const categoryId = latestCategoryId(profileJson);

  const groups = {
    VERBS: {},
    ACTIVITIYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
  };

  for (const concept of profileJson.concepts || []) {
    switch (concept?.type) {
      case "Verb":
        pushConcept(groups.VERBS, concept);
        break;
      case "ActivityType":
        pushConcept(groups.ACTIVITIYTYPES, concept);
        break;
      case "ActivityExtension":
        pushConcept(groups.ACTIVITYEXTENSION, concept);
        break;
      case "ContextExtension":
        pushConcept(groups.CONTEXTEXTENSION, concept);
        break;
      case "ResultExtension":
        pushConcept(groups.RESULTEXTENSION, concept);
        break;
      default:
        break;
    }
  }

  const lines = [
    "// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles",
    "// Do not edit manually. Re-run: npm run generate:profiles",
    `export const ${constName} = Object.freeze({`,
    `    CATEGORYID: '${categoryId}',`,
    `    VERBS: ${renderObjectEntries(groups.VERBS, "        ")},`,
    `    ACTIVITIYTYPES: ${renderObjectEntries(groups.ACTIVITIYTYPES, "        ")},`,
    `    ACTIVITYTYPES: ${renderObjectEntries(groups.ACTIVITIYTYPES, "        ")},`,
    `    ACTIVITYEXTENSION: ${renderObjectEntries(groups.ACTIVITYEXTENSION, "        ")},`,
    `    CONTEXTEXTENSION: ${renderObjectEntries(groups.CONTEXTEXTENSION, "        ")},`,
    `    RESULTEXTENSION: ${renderObjectEntries(groups.RESULTEXTENSION, "        ")}`,
    "});",
    ""
  ];

  const pascal = toPascalCase(label.replace(/\.jsonld$/i, ""));
  const outputName = pascal.endsWith("Profile") ? `${pascal}.js` : `${pascal}Profile.js`;
  return { outputName, content: lines.join("\n"), constName };
}

function generateAggregateFile(profiles) {
  const imports = profiles
    .map(({ outputName, constName }) => `import { ${constName} } from './${outputName}';`)
    .join("\n");

  const categoryIds = profiles
    .map(({ constName }) => `        ${constName}: ${constName}.CATEGORYID,`)
    .join("\n");

  const verbs = profiles
    .map(({ constName }) => `        ...${constName}.VERBS,`)
    .join("\n");

  const activityTypes = profiles
    .map(({ constName }) => `        ...${constName}.ACTIVITIYTYPES,`)
    .join("\n");

  const activityExtensions = profiles
    .map(({ constName }) => `        ...${constName}.ACTIVITYEXTENSION,`)
    .join("\n");

  const contextExtensions = profiles
    .map(({ constName }) => `        ...${constName}.CONTEXTEXTENSION,`)
    .join("\n");

  const resultExtensions = profiles
    .map(({ constName }) => `        ...${constName}.RESULTEXTENSION,`)
    .join("\n");

  return [
    "// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles",
    "// Do not edit manually. Re-run: npm run generate:profiles",
    imports,
    "",
    "export const ALL = Object.freeze({",
    "    CATEGORYID: Object.freeze({",
    categoryIds,
    "    }),",
    "    VERBS: Object.freeze({",
    verbs,
    "    }),",
    "    ACTIVITIYTYPES: Object.freeze({",
    activityTypes,
    "    }),",
    "    ACTIVITYTYPES: Object.freeze({",
    activityTypes,
    "    }),",
    "    ACTIVITYEXTENSION: Object.freeze({",
    activityExtensions,
    "    }),",
    "    CONTEXTEXTENSION: Object.freeze({",
    contextExtensions,
    "    }),",
    "    RESULTEXTENSION: Object.freeze({",
    resultExtensions,
    "    })",
    "});",
    ""
  ].join("\n");
}

function main() {
  if (!fs.existsSync(PROFILES_DIR)) {
    throw new Error(`Profiles directory not found: ${PROFILES_DIR}`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const profileFiles = fs
    .readdirSync(PROFILES_DIR)
    .filter((name) => name.toLowerCase().endsWith(".jsonld"))
    .sort((a, b) => a.localeCompare(b));

  const exports = [];
  const generatedProfiles = [];

  for (const fileName of profileFiles) {
    const fullPath = path.join(PROFILES_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const profileJson = JSON.parse(raw);
    const generated = generateProfileFile(profileJson, fileName);
    fs.writeFileSync(path.join(OUTPUT_DIR, generated.outputName), generated.content, "utf-8");
    generatedProfiles.push(generated);
    exports.push(`export * from './${generated.outputName}';`);
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "All.js"),
    generateAggregateFile(generatedProfiles),
    "utf-8"
  );
  exports.push("export * from './All.js';");

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.js"), `${exports.join("\n")}\n`, "utf-8");
  console.log(`Generated ${profileFiles.length} profile constants in ${OUTPUT_DIR}`);
}

main();
