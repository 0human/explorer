import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Star, Eye } from "lucide-react";
import dayjs from "dayjs";

export default async function Home() {
  const res = await api.github.getRepos()

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              0Human 项目展示
            </h1>
            <p className="mt-4 text-lg text-muted-foreground mx-auto">
              AI全自动建站实验场：输入关键词→生成完整代码，零人工干预，极限测试AI编程能力！
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {res?.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border bg-card/80 backdrop-blur-sm max-w-sm mx-auto">
                <CardHeader className="flex flex-col items-center py-4">
                  <CardTitle className="text-xl font-semibold tracking-tight text-foreground text-center mb-2">
                    {item.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                      <Eye size={12} /> {item.watchers}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium whitespace-nowrap">
                      <Star size={12} fill="currentColor" /> {item.stargazersCount ?? 0}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description ?? "暂无项目描述"}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground w-20">创建时间:</span>
                      <span>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground w-20">更新时间:</span>
                      <span>{dayjs(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground w-20">问题数:</span>
                      <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-xs">
                        {item.openIssuesCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3">
                  <Link href={`${item.name}`}>
                    <Button
                      variant="outline"
                      className="text-sm gap-1.5 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      size="sm"
                    >
                      查看详情
                    </Button>
                  </Link>
                  <Link href={item.repoUrl} target="_blank">
                    <Button
                      variant="outline"
                      className="text-sm gap-1.5 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      size="sm"
                    >
                      查看项目
                      <ArrowUpRight size={16} />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {!res || res.length === 0 && (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">暂无仓库数据</p>
            </div>
          )}
        </div>
      </div>
    </HydrateClient>
  );
}
