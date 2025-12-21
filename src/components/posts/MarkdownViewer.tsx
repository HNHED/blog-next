import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <article className="prose prose-blue max-w-none 
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自动为标题添加 ID 用于大纲跳转
          h1: ({ children }) => <h1 id={String(children).toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-20">{children}</h1>,
          h2: ({ children }) => <h2 id={String(children).toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-20">{children}</h2>,
          h3: ({ children }) => <h3 id={String(children).toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-20">{children}</h3>,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            return !inline && match ? (
              <div className="relative group">
                {/* 悬浮显示的语言标识 */}
                <div className="absolute right-4 top-2 text-xs font-mono text-shadow-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {match[1].toUpperCase()}
                </div>
                <SyntaxHighlighter
                  style={{
                    ...oneDark,
                    'comment': { color: '#94a3b8', fontStyle: 'italic' }, // 修复注释颜色
                  }}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg my-4 not-prose"
                  customStyle={{ margin: 0 }}
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>

              </div>
            ) : (
              <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded-md font-medium" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}