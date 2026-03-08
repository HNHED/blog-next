import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { slugify } from '@/utils/toc';
import React from 'react';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markdown', markdown);

interface ReactElementWithChildren extends React.ReactElement {
  props: {
    children?: React.ReactNode;
  };
}

// 类型守卫函数
function isElementWithChildren(node: React.ReactNode): node is ReactElementWithChildren {
  return React.isValidElement(node) && 'children' in (node.props as object);
}


// 递归提取 React 节点中的文本内容
const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isElementWithChildren(node)) {
    return extractText(node.props.children);
  }
  return '';
};

// 标题渲染组件
const HeadingRenderer = ({ level, children }: { level: number, children: React.ReactNode }) => {
  const text = extractText(children);
  const id = slugify(text);
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  return <Tag id={id} className="scroll-mt-20">{children}</Tag>;
};

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <article className="prose prose-teal dark:prose-invert max-w-none
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自动为标题添加 ID 用于大纲跳转
          h1: ({ children }) => <HeadingRenderer level={1}>{children}</HeadingRenderer>,
          h2: ({ children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
          h3: ({ children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,
          h4: ({ children }) => <HeadingRenderer level={4}>{children}</HeadingRenderer>,
          h5: ({ children }) => <HeadingRenderer level={5}>{children}</HeadingRenderer>,
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            return !inline && match ? (
              <div className="relative group">
                {/* 悬浮显示的语言标识 */}
                <div className="absolute right-4 top-2 text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <code className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 px-1.5 py-0.5 rounded-md font-medium" {...props}>
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
