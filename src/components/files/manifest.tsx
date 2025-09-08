import Projects from "./Projects";
import ReadMe from "./Readme";

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
                children: [
                    // all projects in assets/repos.json should go here sorted by date
                ]
            },
        ],
    },
    { name: "tsconfig.json", type: "file" as const, path: "tsconfig.json" },
    { name: "README.md", type: "file" as const, path: "README.md" },
]

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
};