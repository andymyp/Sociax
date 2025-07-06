"use client";

import { Button } from "@/components/atoms/button";
import { Slider } from "@/components/atoms/slider";
import { AlertDialogFooter } from "@/components/molecules/alert-dialog";
import { ResponsiveModal } from "@/components/molecules/responsive-modal";
import { CropArea, CropPoint } from "@/lib/types/app-type";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  image: string | null;
  setImage: (image: string | null) => void;
  setImageFile: (file: File | null) => void;
}

export const CropperModal = (props: Props) => {
  const [crop, setCrop] = useState<CropPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );

  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<{ url: string; file: File }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }

          const unixTimestamp = Math.floor(Date.now());
          const newFilename = `${unixTimestamp}.jpg`;

          const file = new File([blob], newFilename, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          const url = URL.createObjectURL(blob);

          resolve({ url, file });
        },
        "image/jpeg",
        0.8
      );
    });
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCropSave = async () => {
    if (!props.image || !croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const { url, file } = await getCroppedImg(props.image, croppedAreaPixels);

      props.setImage(url);
      props.setImageFile(file);
      props.onOpenChange(false);
    } catch {
      toast.error("Failed to crop image. Please try again.");
    } finally {
      setIsSaving(false);
      handleReset();
    }
  };

  const handleCancel = () => {
    props.setImage(null);
    props.onOpenChange(false);
    handleReset();
  };

  return (
    <ResponsiveModal
      title={props.title}
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <div className="flex flex-col gap-5">
        <div className="relative w-full h-56 md:h-64 bg-gray-100 rounded-lg overflow-hidden">
          {props.image && (
            <Cropper
              image={props.image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Zoom</label>
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
      <AlertDialogFooter className="mt-4 gap-3">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleCropSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </AlertDialogFooter>
    </ResponsiveModal>
  );
};
