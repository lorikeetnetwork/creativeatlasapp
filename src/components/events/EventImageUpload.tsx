import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadEventImage } from "@/hooks/useEventMutations";

interface EventImageUploadProps {
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

const EventImageUpload = ({
  currentImage,
  onImageUploaded,
  onImageRemoved,
}: EventImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadEventImage();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage.mutateAsync(file);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <img
            src={currentImage}
            alt="Event cover"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onImageRemoved}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadImage.isPending ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload cover image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 1920x1080 (16:9)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default EventImageUpload;
