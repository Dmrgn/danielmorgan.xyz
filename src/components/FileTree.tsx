import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
    name: string
    type: "file" | "folder"
    children?: FileNode[]
    path: string
}

interface FileTreeProps {
    files: FileNode[]
    onFileSelect: (path: string) => void
    selectedFile?: string
}

const FileTreeNode = ({
    node,
    level = 0,
    onFileSelect,
    selectedFile,
}: {
    node: FileNode
    level?: number
    onFileSelect: (path: string) => void
    selectedFile?: string
}) => {
    const [isExpanded, setIsExpanded] = useState(level < 2)
    const isSelected = selectedFile === node.path

    const handleClick = () => {
        if (node.type === "folder") {
            setIsExpanded(!isExpanded)
        } else {
            onFileSelect(node.path)
        }
    }

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-sidebar-accent rounded-sm transition-colors",
                    isSelected && "bg-sidebar-primary text-sidebar-primary-foreground",
                    !isSelected && "text-sidebar-foreground hover:text-sidebar-accent-foreground",
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
            >
                {node.type === "folder" && (
                    <div className="w-4 h-4 flex items-center justify-center">
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                )}
                <div className="w-4 h-4 flex items-center justify-center">
                    {node.type === "folder" ? (
                        isExpanded ? (
                            <FolderOpen className="w-4 h-4" />
                        ) : (
                            <Folder className="w-4 h-4" />
                        )
                    ) : (
                        <File className="w-4 h-4" />
                    )}
                </div>
                <span className="truncate">{node.name}</span>
            </div>
            {node.type === "folder" && isExpanded && node.children && (
                <div>
                    {node.children.map((child, index) => (
                        <FileTreeNode
                            key={`${child.path}-${index}`}
                            node={child}
                            level={level + 1}
                            onFileSelect={onFileSelect}
                            selectedFile={selectedFile}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export function FileTree({ files, onFileSelect, selectedFile }: FileTreeProps) {
    return (
        <div className="h-full overflow-auto">
            <div className="p-2">
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide mb-2">Explorer</h3>
                {files.map((file, index) => (
                    <FileTreeNode
                        key={`${file.path}-${index}`}
                        node={file}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                    />
                ))}
            </div>
        </div>
    )
}
