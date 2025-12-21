// src/app/admin/new/page.tsx
'use client'

import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Save, Eye, Edit3, ArrowLeft, Loader2, Hash, ChevronLeft, Edit2, Layout } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { api } from '@/utils/api'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// 选择一个你喜欢的主题，比如 oneDark 或 atomDark
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { extractToc } from '@/utils/toc'
import RemoteMarkdown from '../posts/RemoteMarkdown'

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    tags: string[]; // 这里传入标签名称数组
    isPreview?: boolean;
  };
  onSubmit: (data: { title: string; content: string; tags: string[] }) => Promise<void>;
  isSubmitting: boolean;
}

export default function PostForm({ initialData, onSubmit, isSubmitting }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [tagInput, setTagInput] = useState('')

  const editRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // 状态锁，防止循环滚动触发（虽然在这种简单的百分比同步中不一定需要，但加上更稳健）
  const isSyncing = useRef(false);

  const toc = extractToc(content)

  const { data: session } = useSession()
  const router = useRouter()

  const handleScroll = (source: 'edit' | 'preview') => {
    if (viewMode !== 'split' || isSyncing.current) return;

    const editEl = editRef.current;
    const previewEl = previewRef.current;

    if (!editEl || !previewEl) return;

    isSyncing.current = true;

    if (source === 'edit') {
      // 计算左侧滚动的百分比
      const percentage = editEl.scrollTop / (editEl.scrollHeight - editEl.clientHeight);
      // 将该百分比应用到右侧
      previewEl.scrollTop = percentage * (previewEl.scrollHeight - previewEl.clientHeight);
    } else {
      // 如果你也想让右侧带动左侧，逻辑反过来
      const percentage = previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);
      editEl.scrollTop = percentage * (editEl.scrollHeight - editEl.clientHeight);
    }

    // 每一帧结束后释放锁
    window.requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  };

  // 返回按钮的处理：如果内容有变动，提示用户
  const handleBack = () => {
    if (content !== (initialData?.content || "") || title !== (initialData?.title || "")) {
      if (confirm("内容尚未保存，确定要离开吗？")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }


  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 顶部工具栏 */}
      <header className="h-16 border-b px-4 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            title="返回"
          >
            <ChevronLeft size={24} />
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="text-xl font-bold outline-none bg-transparent w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* 模式切换器 */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'edit', label: '编辑', icon: <Edit2 size={14} /> },
              { id: 'split', label: '分屏', icon: <Layout size={14} /> },
              { id: 'preview', label: '预览', icon: <Eye size={14} /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === mode.id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onSubmit({ title, content, tags })}
            disabled={isSubmitting || !title}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
          >
            <Save size={18} />
            {isSubmitting ? "正在保存..." : "发布文章"}
          </button>
        </div>
      </header>

      {/* 标签栏 */}
      <div className="bg-white border-b px-6 py-2 flex items-center gap-2 overflow-x-auto">
        <Hash size={16} className="text-gray-400" />
        {tags.map(tag => (
          <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm flex items-center gap-1">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="输入标签按回车添加..."
          className="outline-none text-sm flex-1 min-w-[150px]"
        />
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 编辑区 */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="flex-1 flex flex-col min-w-0">
            <textarea
              ref={editRef} // 绑定 Ref
              onScroll={() => handleScroll('edit')} // 监听滚动
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写点什么..."
              className="flex-1 p-8 outline-none resize-none font-mono text-[15px] leading-relaxed text-gray-800"
            />
          </div>
        )}

        {/* 预览区 */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`flex-1 overflow-y-auto bg-gray-50/30 p-8 ${viewMode === 'split' ? 'border-l' : ''}`} ref={previewRef} onScroll={() => handleScroll('preview')}>
            <div className="max-w-3xl mx-auto">
              <RemoteMarkdown content={content || "*暂无内容*"} />
            </div>
          </div>
        )}

        {/* 条件渲染大纲栏：仅在非分屏模式下显示 */}
        {viewMode !== 'split' && toc.length > 0 && (
          <aside className="w-64 border-l bg-white p-6 overflow-y-auto hidden lg:block animate-in slide-in-from-right duration-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              文章目录
            </h3>
            <nav className="space-y-3">
              {toc.map((item, index) => (
                <div
                  key={index}
                  style={{ paddingLeft: `${(item.level - 1) * 1.2}rem` }}
                  className={`text-sm cursor-pointer hover:text-blue-600 transition-colors ${item.level === 1 ? 'font-semibold text-gray-700' : 'text-gray-500 text-xs'
                    }`}
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.text}
                </div>
              ))}
            </nav>
          </aside>
        )}
      </div>


    </div>
  )
}