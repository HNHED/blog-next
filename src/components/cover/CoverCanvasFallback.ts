import type { CoverConfig } from '@/types/cover';

function wrapText(
  ctx: CanvasRenderingContext2D,
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
    if (ctx.measureText(testLine).width > maxWidth && line) {
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

export function renderFallback(
  canvas: HTMLCanvasElement,
  config: CoverConfig,
  title: string,
  tag: string | undefined,
  width: number,
  height: number,
  fontScale: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, config.primaryColor);
  bg.addColorStop(1, config.secondaryColor);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  let textX: number, textY: number, textAlign: CanvasTextAlign;
  switch (config.layout) {
    case 'left':   textX = 50; textY = height / 2 - 15; textAlign = 'left'; break;
    case 'bottom':
      textX = config.template === 'card' ? 50 : width / 2;
      textY = height - 100;
      textAlign = config.template === 'card' ? 'left' : 'center'; break;
    default:       textX = width / 2; textY = height / 2 - 20; textAlign = 'center';
  }

  const titleSize = Math.round((config.template === 'minimal' ? 32 : 26) * fontScale);
  const titleLineHeight = Math.round(34 * fontScale);
  ctx.fillStyle = config.textColor;
  ctx.textAlign = textAlign;
  ctx.font = `bold ${titleSize}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  const finalY = wrapText(ctx, config.title || title, textX, textY, width - 100, titleLineHeight);

  const subtitle = config.subtitle || (tag ? `#${tag}` : '');
  if (subtitle) {
    ctx.font = `${Math.round(18 * fontScale)}px "Microsoft YaHei", "PingFang SC", sans-serif`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(subtitle, textX, finalY + Math.round(30 * fontScale));
    ctx.globalAlpha = 1;
  }
}
