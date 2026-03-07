import type { CoverConfig } from '../types/cover';

interface RenderMessage {
  id: string;
  config: CoverConfig;
  title: string;
  tag?: string;
  width: number;
  height: number;
  fontScale: number;
}

function wrapText(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  const chars = text.split('');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      lineCount++;
      if (lineCount > maxLines) {
        ctx.fillText(line.slice(0, -1) + '...', x, currentY);
        return currentY;
      }
      ctx.fillText(line, x, currentY);
      line = chars[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) ctx.fillText(line, x, currentY);
  return currentY;
}

function drawBaseDecoration(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
  const g1 = ctx.createRadialGradient(width * 0.85, height * 0.15, 0, width * 0.85, height * 0.15, width * 0.4);
  g1.addColorStop(0, 'rgba(255,255,255,0.15)');
  g1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, width, height);

  const g2 = ctx.createRadialGradient(width * 0.1, height * 0.9, 0, width * 0.1, height * 0.9, width * 0.25);
  g2.addColorStop(0, 'rgba(255,255,255,0.1)');
  g2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  const dots = [
    { x: 0.08, y: 0.15, r: 3 }, { x: 0.15, y: 0.25, r: 2 }, { x: 0.92, y: 0.7, r: 4 },
    { x: 0.88, y: 0.85, r: 2 }, { x: 0.75, y: 0.12, r: 2 }, { x: 0.05, y: 0.6, r: 3 },
    { x: 0.95, y: 0.4, r: 2 },
  ];
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(width * dot.x, height * dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(width * 0.9, height * 0.2, 35, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(width * 0.12, height * 0.75, 25, 0, Math.PI * 2); ctx.stroke();
}

function drawPatternDecoration(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(width * 0.85, height * 0.25, 60, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(width * 0.1, height * 0.8, 45, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(width * 0.92, height * 0.6);
  ctx.lineTo(width * 0.98, height * 0.75);
  ctx.lineTo(width * 0.86, height * 0.75);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(width * 0.05, height * 0.12, 12, 12);
  ctx.fillRect(width * 0.9, height * 0.88, 8, 8);
}

function drawCardDecoration(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, height * 0.4, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(90, 30); ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(width - 30, 15); ctx.lineTo(width - 15, 15); ctx.lineTo(width - 15, 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15, height - 30); ctx.lineTo(15, height - 15); ctx.lineTo(30, height - 15); ctx.stroke();
}

function drawMinimalDecoration(ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(width * 0.1, height - 25); ctx.lineTo(width * 0.3, height - 25); ctx.stroke();
}

function renderToCanvas(
  ctx: OffscreenCanvasRenderingContext2D,
  config: CoverConfig,
  title: string,
  tag: string | undefined,
  width: number,
  height: number,
  fontScale: number
) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, config.primaryColor);
  gradient.addColorStop(1, config.secondaryColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (config.template !== 'minimal') drawBaseDecoration(ctx, width, height);

  switch (config.template) {
    case 'pattern': drawPatternDecoration(ctx, width, height); break;
    case 'card':    drawCardDecoration(ctx, width, height);    break;
    case 'minimal':
      ctx.fillStyle = config.primaryColor;
      ctx.fillRect(0, 0, width, height);
      drawMinimalDecoration(ctx, width, height);
      break;
  }

  let textX: number, textY: number, textAlign: CanvasTextAlign;
  switch (config.layout) {
    case 'left':
      textX = 50; textY = height / 2 - 15; textAlign = 'left'; break;
    case 'bottom':
      textX = config.template === 'card' ? 50 : width / 2;
      textY = height - 100;
      textAlign = config.template === 'card' ? 'left' : 'center'; break;
    case 'center': default:
      textX = width / 2; textY = height / 2 - 20; textAlign = 'center'; break;
  }

  const iconSize = Math.round(36 * fontScale);
  if (config.icon) {
    ctx.font = `${iconSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(config.icon, width - 35, 20 + iconSize);
  }

  const titleSize = Math.round((config.template === 'minimal' ? 32 : 26) * fontScale);
  const titleLineHeight = Math.round(34 * fontScale);
  ctx.fillStyle = config.textColor;
  ctx.textAlign = textAlign;
  ctx.font = `bold ${titleSize}px "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif`;

  const displayTitle = config.title || title;
  const finalY = wrapText(ctx, displayTitle, textX, textY, width - 100, titleLineHeight);

  const subtitleSize = Math.round(18 * fontScale);
  const displaySubtitle = config.subtitle || (tag ? `#${tag}` : '');
  if (displaySubtitle) {
    ctx.font = `${subtitleSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(displaySubtitle, textX, finalY + Math.round(30 * fontScale));
    ctx.globalAlpha = 1;
  }
}

self.addEventListener('message', async (e: MessageEvent<RenderMessage>) => {
  const { id, config, title, tag, width, height, fontScale } = e.data;

  try {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    if (!ctx) throw new Error('Failed to get 2d context');

    renderToCanvas(ctx, config, title, tag, width, height, fontScale);

    const blob = await canvas.convertToBlob({ type: 'image/png', quality: 0.9 });
    const buffer = await blob.arrayBuffer();

    post({ id, buffer }, [buffer]);
  } catch (err) {
    post({ id, error: String(err) });
  }
});

function post(message: unknown, transfer?: Transferable[]): void {
  (self as unknown as { postMessage(m: unknown, t?: Transferable[]): void }).postMessage(message, transfer);
}
