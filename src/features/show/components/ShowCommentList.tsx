import { motion } from 'framer-motion';
import type { Comment } from '@/shared/types/story';

interface ShowCommentListProps {
  comments: Comment[];
}

export function ShowCommentList({ comments }: ShowCommentListProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyber-neon">
        <span className="text-cyber-pink mr-2">&gt;</span>
        Comments
      </h2>

      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-l-2 border-cyber-neon/20 pl-4 space-y-2"
        >
          <div className="text-sm text-cyber-neon/50">
            {comment.by} | {new Date(comment.time * 1000).toLocaleString()}
          </div>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
        </motion.div>
      ))}
    </div>
  );
}