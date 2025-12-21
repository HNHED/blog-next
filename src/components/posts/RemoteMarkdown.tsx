'use client'; // 声明为客户端组件

import dynamic from 'next/dynamic';

// 在客户端组件里使用 ssr: false 是完全允许的
const MarkdownViewer = dynamic(() => import('./MarkdownViewer'), { 
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
      正在加载渲染引擎...
    </div>
  )
});

export default function RemoteMarkdown({ content }: { content: string }) {
  return <MarkdownViewer content={content} />;
}