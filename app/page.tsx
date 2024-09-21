'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sessionId: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [sessionId, _setSessionId] = useState<string>("");

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const fetchedImages: GeneratedImage[] = await response.json();
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        // Optionally set an error state here
      }
    }
    fetchImages();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
  
    setIsGenerating(true);
    setError(null); // Clear any previous errors
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sessionId })
      });
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const newImage: GeneratedImage = await response.json();
      setImages((prevImages) => [newImage, ...prevImages]);
      setPrompt("");
    } catch (error) {
      console.error("Failed to generate image:", error);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderImage = (image: GeneratedImage) => {
    if (image.status === 'starting' || image.status === 'processing') {
      return <div className="aspect-square flex items-center justify-center bg-gray-200">Processing...</div>;
    } else if (image.status === 'failed') {
      return <div className="aspect-square flex items-center justify-center bg-red-200">Generation failed</div>;
    } else if (image.url) {
      return (
        <Image
          src={image.url}
          alt={`Generated Simone image: ${image.prompt}`}
          fill
          style={{ objectFit: 'cover' }}
        />
      );
    } else {
      return <div className="aspect-square flex items-center justify-center bg-gray-200">No image available</div>;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Simone The Bully Image Generator</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
        <Input
          type="text"
          placeholder="Enter a prompt for a Simone image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="aspect-square relative overflow-hidden rounded-lg shadow-md cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            {renderImage(image)}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-gray-500">
          No images generated yet. Enter a prompt to get started!
        </p>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Generated Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-square">
              {selectedImage && renderImage(selectedImage)}
            </div>
            <div>
              <p><strong>Prompt:</strong> {selectedImage?.prompt}</p>
              <p><strong>Created:</strong> {selectedImage?.createdAt}</p>
              <p><strong>Status:</strong> {selectedImage?.status}</p>
            </div>
          </div>
          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  );
}