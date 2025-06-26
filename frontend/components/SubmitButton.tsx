"use client"

import { Play } from "lucide-react"

interface SubmitButtonProps {
  onSubmit: () => void
  disabled: boolean
  sceneCount: number
}

export default function SubmitButton({ onSubmit, disabled, sceneCount }: SubmitButtonProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`group flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        <Play className={`w-5 h-5 ${disabled ? "" : "group-hover:scale-110 transition-transform"}`} />
        <span>Generate Animation</span>
      </button>

      {sceneCount > 0 && (
        <p className="text-sm text-gray-500">
          Ready to animate {sceneCount} scene{sceneCount !== 1 ? "s" : ""}
        </p>
      )}

      {sceneCount === 0 && <p className="text-sm text-red-500">Please add content to at least one scene</p>}
    </div>
  )
}
