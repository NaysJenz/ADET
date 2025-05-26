// app/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ui/ProfileDropdown";

interface Post {
  id: number;
  title: string;
  body: string;
  comments: Comment[];
  likes: number;
}

interface Comment {
  id: number;
  text: string;
}

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((res) => res.json())
      .then((data) => {
        const loadedPosts: Post[] = data.map((post: any) => ({
          ...post,
          comments: [],
          likes: 0,
        }));
        setPosts(loadedPosts);
      });
  }, []);

  const handleAddPost = () => {
    const newPost: Post = {
      id: Date.now(),
      title,
      body,
      comments: [],
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setTitle("");
    setBody("");
  };

  const handleAddComment = (postId: number, text: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: Date.now(), text }],
            }
          : post
      )
    );
  };

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <>
      {/* 🌐 HEADER */}
      <header className="w-full bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">
          🏠 Home
        </Link>
        <nav className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ➕ New Post
          </Button>
          <ProfileDropdown />
        </nav>
      </header>

      {/* 📝 CONTENT */}
      <main className="max-w-2xl mx-auto py-10 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Button onClick={handleAddPost}>Post</Button>
          </CardContent>
        </Card>

        {posts.map((post) => (
          <Card key={post.id} className="mb-6">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>{post.body}</p>
              <Button variant="outline" onClick={() => handleLike(post.id)}>
                👍 Like ({post.likes})
              </Button>

              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-semibold">Comments</h4>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-sm bg-gray-100 p-2 rounded">
                    {comment.text}
                  </div>
                ))}
                <AddCommentForm
                  onSubmit={(text) => handleAddComment(post.id, text)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}

function AddCommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button variant="secondary" onClick={handleSubmit}>
        Comment
      </Button>
    </div>
  );
}