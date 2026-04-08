import { useState } from "react";
import { X, Heart, Send, Reply } from "lucide-react";
import type { FoodPost } from "@/data/mockData";

export interface Comment {
  id: string;
  user: string;
  text: string;
  likes: number;
  liked: boolean;
  time: string;
  replies: Comment[];
}

interface CommentsSheetProps {
  post: FoodPost;
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (postId: string, text: string) => void;
}

const MOCK_COMMENTS: Comment[] = [
  { id: "c1", user: "max_foodie", text: "Sieht mega lecker aus! 🤤", likes: 24, liked: false, time: "2h", replies: [
    { id: "c1r1", user: "lisa_kocht", text: "Hab es bestellt, war der Hammer!", likes: 8, liked: false, time: "1h", replies: [] }
  ]},
  { id: "c2", user: "berlin_eats", text: "Bestes Restaurant in der Stadt!", likes: 15, liked: false, time: "4h", replies: [] },
  { id: "c3", user: "veggie_anna", text: "Gibt es auch eine vegane Option?", likes: 6, liked: false, time: "6h", replies: [] },
];

const CommentsSheet = ({ post, isOpen, onClose, comments: externalComments, onAddComment }: CommentsSheetProps) => {
  const [localComments, setLocalComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  if (!isOpen) return null;

  const allComments = [
    ...localComments,
    ...externalComments.filter((ec) => !localComments.find((lc) => lc.id === ec.id)),
  ];
  const totalCount = allComments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const toggleLike = (commentId: string, isReply?: string) => {
    setLocalComments((prev) =>
      prev.map((c) => {
        if (isReply) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
            ),
          };
        }
        return c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c;
      })
    );
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      user: "foodie_user",
      text: newComment,
      likes: 0,
      liked: false,
      time: "jetzt",
      replies: [],
    };

    if (replyTo) {
      setLocalComments((prev) =>
        prev.map((c) => (c.id === replyTo ? { ...c, replies: [...c.replies, comment] } : c))
      );
    } else {
      setLocalComments((prev) => [comment, ...prev]);
    }

    onAddComment(post.id, newComment);
    setNewComment("");
    setReplyTo(null);
  };

  const renderComment = (comment: Comment, isReply = false, parentId?: string) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? "ml-10" : ""} animate-fade-in`}>
      <div className="w-8 h-8 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center">
        <span className="text-xs font-bold text-primary-foreground">{comment.user[0].toUpperCase()}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{comment.user}</span>
          <span className="text-xs text-muted-foreground">{comment.time}</span>
        </div>
        <p className="text-sm text-foreground/80 mt-0.5">{comment.text}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <button onClick={() => toggleLike(comment.id, parentId)} className="flex items-center gap-1 active:scale-90 transition-all">
            <Heart className={`w-3.5 h-3.5 transition-all ${comment.liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">{comment.likes}</span>
          </button>
          {!isReply && (
            <button onClick={() => setReplyTo(comment.id)} className="flex items-center gap-1 text-xs text-muted-foreground active:scale-90 transition-all">
              <Reply className="w-3.5 h-3.5" />
              Antworten
            </button>
          )}
        </div>
        {comment.replies.map((r) => renderComment(r, true, comment.id))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-h-[70vh] bg-background rounded-t-3xl flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">{totalCount} Kommentare</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-all">
            <X className="w-4 h-4 text-secondary-foreground" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {allComments.map((c) => renderComment(c))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-muted-foreground">Antwort an {localComments.find((c) => c.id === replyTo)?.user}</span>
              <button onClick={() => setReplyTo(null)} className="text-xs text-primary">Abbrechen</button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">F</span>
            </div>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Kommentar hinzufügen..."
              className="flex-1 px-4 py-2.5 rounded-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSubmit}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                newComment.trim() ? "gradient-primary" : "bg-secondary"
              }`}
            >
              <Send className={`w-4 h-4 ${newComment.trim() ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSheet;
