"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Tags({ repo }: { repo: string }) {
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const { data } = api.github.getRepoTags.useQuery({ repo, page, pageSize: 10 });
  useEffect(() => {
    setPage(1)
    setTags([])
  }, [])
  useEffect(() => {
    if (data) {
      setTags(prev => [...prev, ...data.tags]);
    }
  }, [data]);
  if (tags.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">版本标签</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => {
          // 提取版本号，假设tag格式为vX.X.X或直接X.X.X
          const versionRegex = /v?(\d+\.\d+\.\d+)/;
          const versionMatch = versionRegex.exec(tag);
          const version = versionMatch ? versionMatch[1] : tag;
          const tagUrl = `https://nextjs-${version}.0human.website`;
          
          return (
            <Link key={tag} href={tagUrl} target="_blank" rel="noopener noreferrer">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-base font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {tag}
              </div>
            </Link>
          );
        })}
        {data?.hasMore && <Button onClick={() => setPage(page + 1)} size="sm">加载更多</Button>}
      </div>
    </div>
  );
}