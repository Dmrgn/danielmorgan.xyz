import Projects from "./Projects";
import ReadMe from "./Readme";
import Project from "./Project";
import repos from "../../../assets/repos.json";

function slugify(name: string) {
  return name
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

// preserve original order index so we can do a stable sort by year then original order
const projectsWithIndex = (repos as any[]).map((p, i) => ({ ...p, __index: i }));

// sort by year_created desc, then by original array order
const sortedProjects = projectsWithIndex.sort((a, b) => {
  const yearDiff = (b.year_created || 0) - (a.year_created || 0);
  if (yearDiff !== 0) return yearDiff;
  return a.__index - b.__index;
});

const projectNodes = sortedProjects.map((p) => ({
  name: `${p.name}.json`,
  type: "file" as const,
  path: `public/projects/${slugify(p.name)}.json`,
}));

const projectFileContents = Object.fromEntries(
  sortedProjects.map((p) => {
    const path = `public/projects/${slugify(p.name)}.json`;
    return [path, <Project project={p} />];
  }),
);

export const files = [
  {
    name: "src",
    type: "folder" as const,
    path: "src",
    children: [
      {
        name: "components",
        type: "folder" as const,
        path: "src/components",
        children: [
          { name: "Header.tsx", type: "file" as const, path: "src/components/Header.tsx" },
          { name: "Footer.tsx", type: "file" as const, path: "src/components/Footer.tsx" },
          { name: "Button.tsx", type: "file" as const, path: "src/components/Button.tsx" },
        ],
      },
      { name: "App.tsx", type: "file" as const, path: "src/App.tsx" },
    ],
  },
  {
    name: "public",
    type: "folder" as const,
    path: "public",
    children: [
      { name: "projects.json", type: "file" as const, path: "public/projects.json" },
      {
        name: "projects",
        type: "folder" as const,
        path: "public/projects",
        children: projectNodes,
      },
    ],
  },
  { name: "tsconfig.json", type: "file" as const, path: "tsconfig.json" },
  { name: "README.md", type: "file" as const, path: "README.md" },
];

export const fileContents = {
  "tsconfig.json": `// I don't know what you were expecting to find here...
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowJs": true,

    // Bundler mode
    "moduleResolution": "bundler",
    "module": "Preserve",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["dist", "node_modules"]
}
`,
  "README.md": <ReadMe />,
  "public/projects.json": <Projects />,
  ...projectFileContents,
};
