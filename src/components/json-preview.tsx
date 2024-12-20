import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px] font-mono text-sm"
    />
  );
}

interface JSONPreviewProps {
  data: object;
}

export function JSONPreview({ data }: JSONPreviewProps) {
  return (
    <Card>
      <CardContent className="p-4 max-h-[300px] max-w-[600px] overflow-auto">
        <pre className="text-sm text-gray-600 dark:text-gray-400">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

interface JSONEditorModalProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  disabled?: boolean;
}

export function JSONEditorModal({
  value,
  onChange,
  title,
  disabled,
}: JSONEditorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsedValue = JSON.parse(localValue); // Validate JSON
      onChange(parsedValue); // Only call onChange if JSON is valid
      setError(null);
      setIsOpen(false);
    } catch (err) {
      setError("Invalid JSON format. Please fix the errors and try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <BookOpen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Editor
              value={localValue}
              onChange={(newValue) => {
                setLocalValue(newValue);
                setError(null); // Clear error when user starts editing
              }}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </TabsContent>
          <TabsContent value="preview">
            {(() => {
              try {
                const parsedData = JSON.parse(localValue);
                return <JSONPreview data={parsedData} />;
              } catch {
                return (
                  <p className="text-red-500 font-medium text-center py-2">
                    Cannot preview. Invalid JSON format.
                  </p>
                );
              }
            })()}
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
