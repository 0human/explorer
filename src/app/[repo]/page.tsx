import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { api, HydrateClient } from '@/trpc/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Star, Eye, Calendar, GitBranch, Code, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import GithubReadme from './github-readme';

type Props = {
  params: Promise<{ repo: string }>
}

export default async function RepoDetail({ params }: Props) {
  const { repo } = await params;

  // 获取仓库详情
  const repoDetail = await api.github.getRepoDetail({ repo });

  if (!repoDetail) {
    return notFound();
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 relative">
            <div className="flex justify-between items-center">
              <Link href="/">
                <Button variant="link">
                  返回仓库列表
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {repoDetail.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              {repoDetail.description ?? '暂无项目描述'}
            </p>
          </header>

          <Card className="overflow-hidden border border-border bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
              <div className="flex-shrink-0">
                <Image
                  src={repoDetail.avatarUrl}
                  alt={repoDetail.owner}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-border"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-2xl font-bold tracking-tight text-foreground m-0">
                    {repoDetail.name}
                  </CardTitle>
                  <span className="text-sm font-medium text-muted-foreground">
                    #{repoDetail.id}
                  </span>
                </div>
                <CardDescription className="text-muted-foreground mb-3">
                  {repoDetail.description ?? '暂无项目描述'}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                    <Eye size={12} /> {repoDetail.watchers}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium whitespace-nowrap">
                    <Star size={12} fill="currentColor" /> {repoDetail.stargazersCount}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium whitespace-nowrap">
                    <GitBranch size={12} /> {repoDetail.forks}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium whitespace-nowrap">
                    <AlertCircle size={12} /> {repoDetail.openIssuesCount}
                  </div>
                </div>
              </div>
              <Link href={repoDetail.repoUrl} target="_blank">
                <Button
                  variant="outline"
                  className="text-sm gap-1.5 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                  size="sm"
                >
                  查看代码
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">创建时间</h3>
                      <p className="text-foreground">{repoDetail.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">更新时间</h3>
                      <p className="text-foreground">{repoDetail.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">主要语言</h3>
                      <p className="text-foreground">{repoDetail.language ?? '未知'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">许可证</h3>
                      <p className="text-foreground">{repoDetail.license ?? '无'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">是否私有</h3>
                      <p className="text-foreground">{repoDetail.private ? '是' : '否'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">问题数量</h3>
                      <p className="text-foreground">{repoDetail.openIssuesCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {repoDetail.readme && (
                <div className="prose prose-sm max-w-none text-foreground">
                  <h2 className="text-xl font-bold mb-3">README</h2>
                  <GithubReadme markdown={repoDetail.readme} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </HydrateClient>
  );
}