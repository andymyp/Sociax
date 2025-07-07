"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "../atoms/button";
import { toast } from "sonner";
import { CropperModal } from "../organisms/modals/cropper-modal";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue: UseFormSetValue<{ avatar: string | File | undefined }>;
  className?: string;
  image?: string;
}

const AvatarUpload = ({ setValue, className, image, ...props }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openCropper, setOpenCropper] = useState(false);

  useEffect(() => {
    setImageUrl(image || null);
  }, [image, setValue]);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (imageFile) {
      setValue("avatar", imageFile);
    } else {
      setValue("avatar", imageUrl || "");
    }
  }, [imageFile, imageUrl, setValue]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be less than 2MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setOpenCropper(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const handleRemoveAvatar = () => {
    setPreview(null);
    setImageUrl(null);
    setImageFile(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="relative">
      <div
        className={cn(
          "relative border-2 border-border w-40 h-40 bg-transparent p-0 cursor-pointer transition-all duration-100 rounded-full shadow-sm",
          isDragActive && "ring-2 ring-primary ring-offset-2",
          className
        )}
        {...getRootProps()}
      >
        <Avatar className="size-full">
          <AvatarImage src={preview || undefined} />
          <AvatarFallback className="rounded-md">
            <ImageIcon className="h-12 w-12 text-muted-foreground/80 transition-transform duration-300 ease-in-out hover:scale-105" />
          </AvatarFallback>
        </Avatar>
        <input {...props} {...getInputProps()} />
      </div>
      {preview && (
        <Button
          type="button"
          className="absolute bg-red-700 hover:bg-red-600 top-1 right-1 w-8 h-8 rounded-full"
          onClick={handleRemoveAvatar}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <CropperModal
        title="Adjust Your Picture"
        open={openCropper}
        onOpenChange={setOpenCropper}
        setImage={setImageUrl}
        image={imageUrl}
        setImageFile={setImageFile}
      />
    </div>
  );
};

AvatarUpload.displayName = "AvatarUpload";

export { AvatarUpload };
