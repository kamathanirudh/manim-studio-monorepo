"use client"

import { Plus } from "lucide-react"
import SceneInput from "./SceneInput"
import type { Scene } from "@/app/page"

interface SceneManagerProps {
  scenes: Scene[]
  onAddScene: () => void
  onRemoveScene: (id: string) => void
  onUpdateScene: (id: string, content: string) => void
}

export default function SceneManager({ scenes, onAddScene, onRemoveScene, onUpdateScene }: SceneManagerProps) {
  return (
    <div className="space-y-6">
      {scenes.map((scene, index) => (
        <div key={scene.id} className="relative">
          <SceneInput
            scene={scene}
            sceneNumber={index + 1}
            onUpdate={onUpdateScene}
            onRemove={onRemoveScene}
            canRemove={scenes.length > 1}
          />

          {index === scenes.length - 1 && scenes.length < 10 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onAddScene}
                className="group flex items-center justify-center w-12 h-12 bg-white border-2 border-dashed border-gray-300 rounded-full hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Add new scene"
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          )}
        </div>
      ))}

      {scenes.length >= 10 && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Maximum of 10 scenes reached</p>
        </div>
      )}
    </div>
  )
}
