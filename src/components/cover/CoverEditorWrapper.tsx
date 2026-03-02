'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Post } from '@/types/post';
import { CoverConfig } from '@/types/cover';
import { postService } from '@/services/postService';
import CoverEditor from './CoverEditor';
import { ImageIcon } from 'lucide-react';

interface CoverEditorWrapperProps {
  post: Post;
}

export default function CoverEditorWrapper({ post }: CoverEditorWrapperProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('post');
  const [isEditing, setIsEditing] = useState(false);

  // 非管理员不显示
  if (!session) return null;

  const handleSave = async (config: CoverConfig) => {
    try {
      await postService.updateCover(post.id, { coverConfig: config });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('保存封面失败:', error);
      alert(t('saveCoverFailed'));
    }
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center p-4">
        <div className="w-full max-w-4xl max-h-[90vh]">
          <CoverEditor
            post={post}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
      title="编辑封面"
    >
      <ImageIcon size={16} />
      <span>{t('editCover')}</span>
    </button>
  );
}
