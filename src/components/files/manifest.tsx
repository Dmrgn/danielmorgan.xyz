import Projects from "./Projects";
import ReadMe from "./Readme";
import Project from "./Project";
import repos from "../../../assets/repos.json";
import companies from "../../../assets/companies.json";
import Video from "./Video.ts";
import AIHeader from "./AIHeader.tsx";
import AppTsxTxt from "../../../assets/app.txt";
import type { CompanyData } from "@/lib/useCompanyData.tsx";

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
 *
 * When not targeting a company, returns the default manifest with a single public/projects folder containing all projects.
 */
export function buildManifest(company?: CompanyData) {
    // all project file nodes (used for the default view)
    const allProjectNodes = repos.map((p) => ({
        name: `${p.name}.json`,
        type: "file" as const,
        path: `public/projects/${slugify(p.name)}.json`,
    }));

    // map of path => React content for every project
    const projectFileContents = Object.fromEntries(
        repos.map((p) => {
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

    // build fileContents
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
        "src/components/Header.tsx": <AIHeader />,
        "public/projects.json": <Projects />,
        "src/App.tsx": AppTsxTxt,
        "public/videos/traffic.webm": <Video id="gE0qPx-4PYk" />,
        "public/videos/gamedev.webm": <Video id="v1pUm38jRmk" />,
        "public/videos/tickling.webm": <Video id="Teh1WYaFt44" />,
        "public/videos/infrascan.webm": <Video id="a2k2Cdsv2RE" />,
        "public/videos/mindcontrol.webm": <Video id="yWqgPWiTZVc" />,
        ...projectFileContents,
    };

    // if no company is being targeted , return default manifest
    if (!company) {
        return { files: defaultFiles, fileContents: defaultFileContents };
    }

    // build company-specific project nodes in the exact order specified in the company.projects array
    const companyProjectNodes: FileNode[] = [];
    const matchedProjectNames = new Set<string>();

    for (const projName of company.projects || []) {
        const found = (repos as any[]).find((r) => r.name === projName);
        if (found) {
            companyProjectNodes.push(projectNodeForRepo(found));
            matchedProjectNames.add(found.name);
        } else {
            console.log(`companies.json: project "${projName}" not found in repos.json.`);
        }
    }

    // other projects: keep the same global sorting (year desc, stable)
    const otherProjectNodes: FileNode[] = repos
        .filter((p) => !matchedProjectNames.has(p.name))
        .map((p) => projectNodeForRepo(p));

    // Compose files with two folders under public/projects
    const companyFolderName = `${company.name}-projects`;
    const companyFolderPath = `public/projects/${slugify(company.name)}-projects`;

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
