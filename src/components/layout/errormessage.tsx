import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message?: string
}

export const ErrorMessage = ({
  message = "An error occurred. Please try again.",
}: ErrorMessageProps) => {
  return (
    <div className="bg-white border border-red-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
      </div>
    </div>
  )
}
