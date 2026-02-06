// src/app/admin/new/page.tsx
'use client'

import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Save, Eye, Edit3, ArrowLeft, Loader2, Hash, ChevronLeft, Edit2, Layout, ImageIcon } from 'lucide-react'
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
  const [isUploading, setIsUploading] = useState(false)

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

  // 处理粘贴图片
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // 查找粘贴内容中的图片
    const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));
    if (!imageItem) return;

    // 阻止默认粘贴行为
    e.preventDefault();

    const file = imageItem.getAsFile();
    if (!file) return;

    const textarea = editRef.current;
    if (!textarea) return;

    // 记录光标位置
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 插入上传占位符
    const placeholder = '![上传中...](uploading)';
    const newContent = content.slice(0, start) + placeholder + content.slice(end);
    setContent(newContent);

    setIsUploading(true);

    try {
      const result = await api.uploadImage(file);

      // 替换占位符为实际图片链接
      const imageMarkdown = `![image](${result.url})`;
      setContent(prev => prev.replace(placeholder, imageMarkdown));
    } catch (error) {
      console.error('上传图片失败:', error);
      // 移除占位符
      setContent(prev => prev.replace(placeholder, ''));
      alert('上传图片失败，请重试');
    } finally {
      setIsUploading(false);
    }
  }


  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] dark:bg-gray-900">
      {/* 顶部工具栏 */}
      <header className="h-16 px-6 flex items-center justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 z-20 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-105"
            title="返回"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative flex-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="为你的文章起个标题..."
              className="text-2xl font-serif font-semibold outline-none bg-transparent w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 tracking-wide"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/40 to-teal-400/0" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 模式切换器 */}
          <div className="flex bg-gray-100/60 dark:bg-gray-700/60 p-1 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
            {[
              { id: 'edit', label: '编辑', icon: <Edit2 size={14} /> },
              { id: 'split', label: '分屏', icon: <Layout size={14} /> },
              { id: 'preview', label: '预览', icon: <Eye size={14} /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 ${viewMode === mode.id
                  ? 'bg-white dark:bg-gray-600 shadow-md text-teal-600 dark:text-teal-400 scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'
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
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 disabled:shadow-none disabled:scale-100"
          >
            <Save size={18} />
            {isSubmitting ? "正在保存..." : "发布文章"}
          </button>
        </div>
      </header>

      {/* 标签栏 */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/40 dark:border-gray-700/40 px-8 py-3 flex items-center gap-3 overflow-x-auto">
        <Hash size={16} className="text-teal-500/70 dark:text-teal-400/70" />
        {tags.map(tag => (
          <span
            key={tag}
            className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-sm border border-teal-200/50 dark:border-teal-700/50 hover:shadow-md transition-all duration-200"
          >
            <span className="font-medium">{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 hover:scale-110 transition-all duration-200 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="输入标签按回车添加..."
          className="outline-none text-sm flex-1 min-w-[150px] bg-transparent text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {/* 主工作区 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 编辑区 */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className="absolute inset-4 rounded-2xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-300/20 dark:shadow-gray-900/40">
              {/* 微妙的色彩渐变层 */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 dark:from-teal-900/20 via-transparent to-cyan-50/20 dark:to-cyan-900/10 pointer-events-none" />

              {/* 左侧装饰线 */}
              <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-teal-400/60 via-cyan-400/40 to-teal-400/0" />

              {/* 上传中指示器 */}
              {isUploading && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-teal-500/90 text-white px-3 py-1.5 rounded-lg text-sm shadow-lg">
                  <Loader2 size={14} className="animate-spin" />
                  上传图片中...
                </div>
              )}

              <textarea
                ref={editRef}
                onScroll={() => handleScroll('edit')}
                onPaste={handlePaste}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在这里开始你的创作..."
                className="absolute inset-0 pl-6 pr-8 py-8 outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60 z-10 font-mono text-[15px] leading-[1.9] tracking-wide"
              />
            </div>
          </div>
        )}

        {/* 预览区 */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className="flex-1 overflow-y-auto"
            ref={previewRef}
            onScroll={() => handleScroll('preview')}
          >
            <div className="p-4 h-full">
              <div className="min-h-full rounded-2xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-300/20 dark:shadow-gray-900/40">
                {/* 顶部装饰线 */}
                <div className="h-[3px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

                <div className="p-8 lg:p-12">
                  <div className="max-w-3xl mx-auto">
                    <RemoteMarkdown content={content || "*在左侧编辑区开始创作...*"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 条件渲染大纲栏：仅在非分屏模式下显示 */}
        {viewMode !== 'split' && toc.length > 0 && (
          <aside className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 overflow-y-auto hidden lg:block border-l border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full" />
              文章目录
            </h3>
            <nav className="space-y-1">
              {toc.map((item, index) => (
                <div
                  key={index}
                  style={{ paddingLeft: `${(item.level - 1) * 1.2}rem` }}
                  className={`py-1.5 px-3 cursor-pointer rounded-lg transition-all duration-200 hover:bg-teal-50 dark:hover:bg-teal-900/30 ${item.level === 1
                    ? 'font-semibold text-gray-700 dark:text-gray-300 text-sm'
                    : 'text-gray-500 dark:text-gray-400 text-xs'
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