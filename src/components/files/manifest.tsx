import Projects from "./Projects";
import ReadMe from "./Readme";
import Project from "./Project";
import repos from "../../../assets/repos.json";
import companies from "../../../assets/companies.json";
import Video from "./Video.ts";

function slugify(name: string) {
    return name
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .toLowerCase();
}

type FileNode = {
    name: string;
    type: "file" | "folder";
    path: string;
    children?: FileNode[];
};

/**
 * Build the files and fileContents manifest.
 * If companyId is provided (string), and matches companies[].id (coerced to string),
 * the public/projects folder will be replaced with two folders:
 *  - {company.name}-projects (slugified path) containing the exact projects listed for the company (keeps the company's array order)
 *  - other-projects containing remaining projects (sorted by year desc then original order)
 *
 * When no companyId or no matching company, returns the default manifest with a single public/projects folder containing all projects.
 */
export function buildManifest(companyId?: string) {
    // preserve original order index so we can do a stable sort by year then original order
    const projectsWithIndex = (repos as any[]).map((p, i) => ({ ...p, __index: i }));

    // sort by year_created desc, then by original array order
    const sortedProjects = projectsWithIndex.slice().sort((a, b) => {
        const yearDiff = (b.year_created || 0) - (a.year_created || 0);
        if (yearDiff !== 0) return yearDiff;
        return a.__index - b.__index;
    });

    // all project file nodes (used for the default view)
    const allProjectNodes = sortedProjects.map((p) => ({
        name: `${p.name}.json`,
        type: "file" as const,
        path: `public/projects/${slugify(p.name)}.json`,
    }));

    // map of path => React content for every project
    const projectFileContents = Object.fromEntries(
        sortedProjects.map((p) => {
            const path = `public/projects/${slugify(p.name)}.json`;
            return [path, <Project project={p} />];
        }),
    );

    // helper to create a file node for a repo object
    function projectNodeForRepo(repo: any): FileNode {
        return {
            name: `${repo.name}.json`,
            type: "file",
            path: `public/projects/${slugify(repo.name)}.json`,
        };
    }

    // default files structure (no company)
    const defaultFiles: FileNode[] = [
        {
            name: "src",
            type: "folder",
            path: "src",
            children: [
                {
                    name: "components",
                    type: "folder",
                    path: "src/components",
                    children: [
                        { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
                        { name: "Footer.tsx", type: "file", path: "src/components/Footer.tsx" },
                        { name: "Button.tsx", type: "file", path: "src/components/Button.tsx" },
                    ],
                },
                { name: "App.tsx", type: "file", path: "src/App.tsx" },
            ],
        },
        {
            name: "public",
            type: "folder",
            path: "public",
            children: [
                { name: "projects.json", type: "file", path: "public/projects.json" },
                {
                    name: "projects",
                    type: "folder",
                    path: "public/projects",
                    children: allProjectNodes,
                },
                {
                    name: "videos",
                    type: "folder",
                    path: "public/videos",
                    children: [
                        { name: "mindcontrol.webm", type: "file", path: "public/videos/mindcontrol.webm" },
                        { name: "gamedev.webm", type: "file", path: "public/videos/gamedev.webm" },
                        { name: "tickling.webm", type: "file", path: "public/videos/tickling.webm" },
                        { name: "infrascan.webm", type: "file", path: "public/videos/infrascan.webm" },
                        { name: "traffic.webm", type: "file", path: "public/videos/traffic.webm" },
                    ],
                },
            ],
        },
        { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
        { name: "README.md", type: "file", path: "README.md" },
    ];

    // build fileContents including README and projects.json
    const defaultFileContents = {
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
        "public/videos/traffic.webm": <Video id="gE0qPx-4PYk" />,
        "public/videos/gamedev.webm": <Video id="v1pUm38jRmk" />,
        "public/videos/tickling.webm": <Video id="Teh1WYaFt44" />,
        "public/videos/infrascan.webm": <Video id="a2k2Cdsv2RE" />,
        "public/videos/mindcontrol.webm": <Video id="yWqgPWiTZVc" />,
        ...projectFileContents,
    };

    // If no companyId provided, return default manifest
    if (!companyId) {
        return { files: defaultFiles, fileContents: defaultFileContents };
    }

    // find company by id (ids in companies.json may be strings; coerce to string)
    const matchedCompany = (companies as any[]).find((c) => String(c.id) === String(companyId));

    if (!matchedCompany) {
        // no match, return default
        return { files: defaultFiles, fileContents: defaultFileContents };
    }

    // Build company-specific project nodes in the exact order specified in the company.projects array
    const companyProjectNodes: FileNode[] = [];
    const matchedProjectNames = new Set<string>();

    for (const projName of matchedCompany.projects || []) {
        // Exact match only (as requested)
        const found = (repos as any[]).find((r) => r.name === projName);
        if (found) {
            companyProjectNodes.push(projectNodeForRepo(found));
            matchedProjectNames.add(found.name);
        } else {
            // If a listed project name doesn't match any repo exactly, warn so you can fix companies.json
            // Use console.warn for developer visibility
            // eslint-disable-next-line no-console
            console.warn(`companies.json: project "${projName}" not found in repos.json (expected exact match).`);
        }
    }

    // Other projects: those not in matchedProjectNames, keep the same global sorting (year desc, stable)
    const otherProjectNodes: FileNode[] = sortedProjects
        .filter((p) => !matchedProjectNames.has(p.name))
        .map((p) => projectNodeForRepo(p));

    // Compose files with two folders under public/projects
    const companyFolderName = `${matchedCompany.name}-projects`;
    const companyFolderPath = `public/projects/${slugify(matchedCompany.name)}-projects`;

    const files: FileNode[] = [
        {
            name: "src",
            type: "folder",
            path: "src",
            children: [
                {
                    name: "components",
                    type: "folder",
                    path: "src/components",
                    children: [
                        { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
                        { name: "Footer.tsx", type: "file", path: "src/components/Footer.tsx" },
                        { name: "Button.tsx", type: "file", path: "src/components/Button.tsx" },
                    ],
                },
                { name: "App.tsx", type: "file", path: "src/App.tsx" },
            ],
        },
        {
            name: "public",
            type: "folder",
            path: "public",
            children: [
                { name: "projects.json", type: "file", path: "public/projects.json" },
                {
                    name: "projects",
                    type: "folder",
                    path: "public/projects",
                    children: [
                        {
                            name: companyFolderName,
                            type: "folder",
                            path: companyFolderPath,
                            children: companyProjectNodes,
                        },
                        {
                            name: "other-projects",
                            type: "folder",
                            path: "public/projects/other-projects",
                            children: otherProjectNodes,
                        },
                    ],
                },
            ],
        },
        { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
        { name: "README.md", type: "file", path: "README.md" },
    ];

    // fileContents remain the same (we already included all project contents into projectFileContents)
    return { files, fileContents: defaultFileContents };
}
