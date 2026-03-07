'use client';

import { useEffect, useRef } from 'react';
import type { CoverConfig } from '@/types/cover';

interface CoverCanvasProps {
  config: CoverConfig;
  title: string;
  tag?: string;
  width?: number;
  height?: number;
  fontScale?: number;
  onGenerated?: (dataUrl: string) => void;
}

// ── Singleton worker ──────────────────────────────────────────────────────────
let workerInstance: Worker | null = null;
const pendingCallbacks = new Map<string, (buffer: ArrayBuffer) => void>();

function getCoverWorker(): Worker | null {
  if (typeof window === 'undefined') return null;
  if (!('OffscreenCanvas' in window)) return null;

  if (!workerInstance) {
    workerInstance = new Worker(
      new URL('../../workers/coverWorker', import.meta.url)
    );
    workerInstance.addEventListener(
      'message',
      ({ data }: MessageEvent<{ id: string; buffer?: ArrayBuffer; error?: string }>) => {
        const cb = pendingCallbacks.get(data.id);
        if (!cb) return;
        pendingCallbacks.delete(data.id);
        if (data.buffer) cb(data.buffer);
      }
    );
  }

  return workerInstance;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CoverCanvas({
  config,
  title,
  tag,
  width = 800,
  height = 450,
  fontScale = 1,
  onGenerated,
}: CoverCanvasProps) {
  // Keep a stable ref so we never add onGenerated to effect deps
  const onGeneratedRef = useRef(onGenerated);
  useEffect(() => { onGeneratedRef.current = onGenerated; }, [onGenerated]);

  useEffect(() => {
    const worker = getCoverWorker();

    // ── Fallback: regular canvas when OffscreenCanvas is unavailable ──────────
    if (!worker) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      // Dynamically import drawing logic only when needed for the fallback
      import('./CoverCanvasFallback').then(({ renderFallback }) => {
        renderFallback(canvas, config, title, tag, width, height, fontScale);
        onGeneratedRef.current?.(canvas.toDataURL('image/png', 0.9));
      });
      return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let cancelled = false;

    pendingCallbacks.set(id, (buffer: ArrayBuffer) => {
      if (cancelled) return;
      const blob = new Blob([buffer], { type: 'image/png' });
      const reader = new FileReader();
      reader.onload = () => {
        if (!cancelled) onGeneratedRef.current?.(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });

    worker.postMessage({ id, config, title, tag, width, height, fontScale });

    return () => {
      cancelled = true;
      pendingCallbacks.delete(id);
    };
  }, [config, title, tag, width, height, fontScale]); // onGenerated intentionally omitted

  return null; // No DOM output — rendering happens off-thread
}
