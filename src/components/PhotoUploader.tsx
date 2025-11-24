import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoFile {
  file: File;
  preview: string;
  caption: string;
}

interface PhotoUploaderProps {
  photos: PhotoFile[];
  onPhotosChange: (photos: PhotoFile[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, and WebP images are allowed.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Each photo must be under 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can upload a maximum of ${maxPhotos} photos.`,
        variant: "destructive",
      });
      return;
    }

    const newPhotos: PhotoFile[] = [];
    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        const preview = URL.createObjectURL(file);
        newPhotos.push({ file, preview, caption: "" });
      }
    });

    onPhotosChange([...photos, ...newPhotos]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photos[index].preview);
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index].caption = caption;
    onPhotosChange(updatedPhotos);
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const updatedPhotos = [...photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop photos here, or click to select
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          JPG, PNG, or WebP up to 10MB each (max {maxPhotos} photos)
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Photos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <Label>Photos ({photos.length}/{maxPhotos})</Label>
          <div className="grid gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border rounded-lg bg-card"
              >
                <div className="flex items-center cursor-move">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <img
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Add a caption (optional)"
                    value={photo.caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                  />
                  <div className="flex gap-2">
                    {index > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => movePhoto(index, index - 1)}
                      >
                        Move Up
                      </Button>
                    )}
                    {index < photos.length - 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => movePhoto(index, index + 1)}
                      >
                        Move Down
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
