"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PhotoUploadProps {
  bucket: string;
  path: string;
  onUpload: (url: string) => void;
  className?: string;
}

async function compressImage(file: File, maxWidth = 1920): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        0.8
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function PhotoUpload({
  bucket,
  path,
  onUpload,
  className = "",
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      // Preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Compress & upload
      setIsUploading(true);
      try {
        const compressed = await compressImage(file);
        const fileName = `${path}/${Date.now()}.jpg`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressed, {
            contentType: "image/jpeg",
            upsert: false,
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName);

        onUpload(publicUrl);
      } catch (err) {
        console.error("Upload failed:", err);
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, path, onUpload]
  );

  const clearPreview = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full aspect-video object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {!isUploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-orange-500/30 bg-white/[0.02] hover:bg-orange-500/5 transition-all flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Camera className="w-6 h-6 text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-zinc-300 text-sm font-medium">
              Ta bilde eller velg fra galleri
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              JPG, PNG — maks 10MB
            </p>
          </div>
          <Upload className="w-4 h-4 text-zinc-500" />
        </button>
      )}
    </div>
  );
}
