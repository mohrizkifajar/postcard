import z from "zod";

// Components Props
export type PostCardProps = {
  post: Post;
};

export type AvatarProps = {
  src: string;
  alt: string;
  fullName: string;
  username: string;
};

// Request & Response Schemas
export const loginSchema = z.object({
  identity: z.string().min(1, {
    message: "Identity cannot be blank",
  }),
  otp_code: z.string().min(1, {
    message: "OTP code cannot be blank",
  }),
});

export type ToggleLikeResponse = {
  status: string;
  data: {
    is_liked: boolean;
    likes_count: number;
    seq?: number;
  } | null;
};

// Models
export type User = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
};

export type Author = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  following: boolean;
};

export type Media = {
  media_url: string;
  media_type: string;
  order: number;
};

export type Post = {
  id: string;
  content: string;
  location?: string;
  media: Media[];
  author: Author;
  is_liked: boolean;
  likes_count: number;
  created_at: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  timestamp: Date;
};
