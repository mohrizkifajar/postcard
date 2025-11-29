"use client";

import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { toggleLike } from "@/actions/post";
import type { PostCardProps, ToggleLikeResponse } from "@/lib/definitions";
import { formatDateDiff, formatNumber } from "@/lib/utils";
import Avatar from "./avatar";

export default function PostCard({ post }: PostCardProps) {
  const initialState: ToggleLikeResponse = {
    status: "",
    data: null,
  };
  const [state, action, pending] = useActionState(toggleLike, initialState);

  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  // For debug
  const [lastSeq, setLastSeq] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      // reconcile to server truth
      setLiked(Boolean(state.data?.is_liked));
      setLikesCount(Number(state.data?.likes_count));
      setLastSeq(state.data?.seq);
    }

    if (state.status === "failed") {
      // Rollback
      const nextLiked = !liked;
      const nextCount = Math.max(0, likesCount + (nextLiked ? 1 : -1));
      setLiked(nextLiked);
      setLikesCount(nextCount);
      setError(state.status);
    }
  }, [state, liked, likesCount]);

  async function onToggleLike() {
    // Prevent click spam when in-flight
    if (pending) {
      return;
    }

    setError(null);

    // Optimistic update
    const nextLiked = !liked;
    const nextCount = Math.max(0, likesCount + (nextLiked ? 1 : -1));
    setLiked(nextLiked);
    setLikesCount(nextCount);
  }

  return (
    <article className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar
          src={post.author.avatar || ""}
          alt={`${post.author.username} avatar`}
          fullName={`${post.author.first_name} ${post.author.last_name}`}
          username={post.author.username}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {post.author.username}
            </p>
            <span className="text-xs text-neutral-400">•</span>
            <p className="text-xs text-neutral-400">
              {formatDateDiff(new Date(post.created_at))}
            </p>
          </div>
          <p className="truncate text-xs text-neutral-400">
            {post.location || "Gresik"}
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg px-2 py-1 text-neutral-300 hover:bg-white/5"
          aria-label="More"
        >
          •••
        </button>
      </div>

      {/* Image */}
      {post.media[1].media_type === "image" ? (
        <div
          className="relative aspect-square w-full bg-neutral-800"
          key={post.media[1].media_url}
        >
          <Image
            src={post.media[1].media_url}
            alt="Post image"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      ) : (
        <video src={post.media[1].media_url} muted controls />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <form action={action}>
            <input type="hidden" name="post_id" value={post.id} />

            <button
              type="submit"
              onClick={onToggleLike}
              disabled={pending}
              className="rounded-xl p-2 hover:bg-white/5 disabled:opacity-60"
              aria-label="Like"
            >
              <Heart
                className={[
                  "h-6 w-6",
                  liked ? "fill-red-500 text-red-500" : "text-white",
                ].join(" ")}
              />
            </button>
          </form>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-white/5"
            aria-label="Comment"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </button>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-white/5"
            aria-label="Share"
          >
            <Send className="h-6 w-6 text-white" />
          </button>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 hover:bg-white/5"
          aria-label="Save"
        >
          <Bookmark className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Meta */}
      <div className="space-y-2 px-4 pb-4">
        <p className="text-sm font-semibold text-white">
          {formatNumber(likesCount)} Likes
        </p>

        <p className="text-sm text-white">
          <span className="font-semibold">{post.author.username}</span>{" "}
          <span className="text-neutral-200">{post.content}</span>
        </p>

        {/* Debug strip */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-neutral-300">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              liked: <span className="font-mono">{String(liked)}</span>
            </span>
            <span>
              count: <span className="font-mono">{likesCount}</span>
            </span>
            <span>
              loading: <span className="font-mono">{String(pending)}</span>
            </span>
            <span>
              seq: <span className="font-mono">{lastSeq ?? "-"}</span>
            </span>
          </div>
          {error ? <p className="mt-2 text-red-300">Error: {error}</p> : null}
          <p className="mt-2 break-all text-neutral-400">
            POST {process.env.NEXT_PUBLIC_API_URL}/posts/{post.id}/likes
          </p>
        </div>
      </div>
    </article>
  );
}
