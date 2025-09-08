"use client"

import { useState } from "react"
import { FileTree } from "./FileTree"
import { CodeEditor } from "./CodeEditor"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const sampleFiles = [
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
            {
                name: "pages",
                type: "folder" as const,
                path: "src/pages",
                children: [
                    { name: "index.tsx", type: "file" as const, path: "src/pages/index.tsx" },
                    { name: "about.tsx", type: "file" as const, path: "src/pages/about.tsx" },
                ],
            },
            {
                name: "styles",
                type: "folder" as const,
                path: "src/styles",
                children: [
                    { name: "globals.css", type: "file" as const, path: "src/styles/globals.css" },
                    { name: "components.css", type: "file" as const, path: "src/styles/components.css" },
                ],
            },
            { name: "App.tsx", type: "file" as const, path: "src/App.tsx" },
            { name: "main.tsx", type: "file" as const, path: "src/main.tsx" },
        ],
    },
    {
        name: "public",
        type: "folder" as const,
        path: "public",
        children: [
            { name: "index.html", type: "file" as const, path: "public/index.html" },
            { name: "favicon.ico", type: "file" as const, path: "public/favicon.ico" },
        ],
    },
    { name: "package.json", type: "file" as const, path: "package.json" },
    { name: "tsconfig.json", type: "file" as const, path: "tsconfig.json" },
    { name: "README.md", type: "file" as const, path: "README.md" },
]

const fileContents: Record<string, string> = {
    "src/App.tsx": `import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <h1>Welcome to React</h1>
        <p>Start editing to see some magic happen!</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;`,
    "src/components/Header.tsx": `import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav>
        <h1>My App</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;`,
"package.json": `{
    "name": "my-react-app",
    "version": "1.0.0",
    "private": true,
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "typescript": "^4.9.5"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
}`,
}

interface Tab {
    id: string
    name: string
    path: string
    content: string
    language: string
    isDirty: boolean
}

export default function CodeEditorPage() {
    const [tabs, setTabs] = useState<Tab[]>([])
    const [activeTab, setActiveTab] = useState<string>()

    const handleFileSelect = (path: string) => {
        // Check if tab already exists
        const existingTab = tabs.find((tab) => tab.path === path)
        if (existingTab) {
            setActiveTab(existingTab.id)
            return
        }

        // Create new tab
        const fileName = path.split("/").pop() || path
        const content = fileContents[path] || `// Content for ${fileName}\n\n`
        const newTab: Tab = {
            id: `tab-${Date.now()}`,
            name: fileName,
            path,
            content,
            language: path.split(".").pop() || "text",
            isDirty: false,
        }

        setTabs((prev) => [...prev, newTab])
        setActiveTab(newTab.id)
    }

    const handleTabClose = (tabId: string) => {
        setTabs((prev) => {
            const newTabs = prev.filter((tab) => tab.id !== tabId)
            if (activeTab === tabId && newTabs.length > 0) {
                setActiveTab(newTabs[newTabs.length - 1].id)
            } else if (newTabs.length === 0) {
                setActiveTab(undefined)
            }
            return newTabs
        })
    }

    const handleContentChange = (tabId: string, content: string) => {
        setTabs((prev) =>
            prev.map((tab) => (tab.id === tabId ? { ...tab, content, isDirty: content !== fileContents[tab.path] } : tab)),
        )
    }

    return (
        <div className="h-screen w-screen bg-background">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
                    <div className="h-full bg-sidebar border-r border-sidebar-border">
                        <FileTree
                            files={sampleFiles}
                            onFileSelect={handleFileSelect}
                            selectedFile={tabs.find((tab) => tab.id === activeTab)?.path}
                        />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={75}>
                    <CodeEditor
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onTabClose={handleTabClose}
                        onContentChange={handleContentChange}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}