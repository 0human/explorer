import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paginationInput } from "@/server/zod-types";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

const ORG_NAME = '0human'

export const githubRouter = createTRPCRouter({
  // 获取仓库基本信息
  getRepoBasicInfo: publicProcedure
    .input(z.object({ repo: z.string() }))
    .query(async ({ input, ctx }) => {
      const { repo } = input;
      try {
        const res = await ctx.octokit.rest.repos.get({
          owner: ORG_NAME,
          repo,
        });

        return {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          repoUrl: res.data.html_url,
          owner: res.data.owner.login,
          avatarUrl: res.data.owner.avatar_url,
          createdAt: res.data.created_at,
          updatedAt: res.data.updated_at,
          openIssuesCount: res.data.open_issues_count,
          watchers: res.data.watchers,
          stargazersCount: res.data.stargazers_count,
          forks: res.data.forks,
          language: res.data.language,
          license: res.data.license?.name ?? null,
          private: res.data.private,
        };
      } catch {
        return null;
      }
    }),
    
  // 单独获取README内容
  getRepoReadme: publicProcedure
    .input(z.object({ repo: z.string() }))
    .query(async ({ input, ctx }) => {
      const { repo } = input;
      try {
        const readmeRes = await ctx.octokit.rest.repos.getReadme({
          owner: ORG_NAME,
          repo,
        });
        // 解码base64编码的README内容
        return Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
      } catch {
        // 如果没有README或获取失败，返回null
        return null;
      }
    }),
    
  // 单独获取tags列表
  getRepoTags: publicProcedure
    .input(z.object({ repo: z.string() }).and(paginationInput))
    .query(async ({ input, ctx }) => {
      const { repo, page, pageSize } = input;
      try {
        console.log('getRepoTags', repo, page, pageSize);
        const tagsRes = await ctx.octokit.rest.repos.listTags({
          owner: ORG_NAME,
          repo,
          per_page: pageSize,
          page,
        });
        return {
          tags: tagsRes.data.map(tag => tag.name),
          hasMore: tagsRes.data.length >= pageSize,
        };
      } catch {
        // 如果获取tags失败，返回空数组
        return {
          tags: [],
          hasMore: false,
        };
      }
    }),

  getRepos: publicProcedure
    .input(paginationInput)
    .query(async ({ input, ctx }) => {
      const ignoredRepos = ['explorer', '.github'];
      const { page, pageSize } = input;
      
      // 获取所有仓库（不使用GitHub的分页）
      let allRepos: RestEndpointMethodTypes["repos"]["listForOrg"]["response"]["data"] = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const res = await ctx.octokit.rest.repos.listForOrg({
          org: ORG_NAME,
          per_page: 100, // 一次获取最多100个
          page: currentPage,
          type: 'public',
          sort: 'updated',
          direction: 'desc',
        });
        
        if (res.data.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...res.data];
          currentPage++;
        }
      }
      
      // 过滤掉被忽略的仓库
      const filteredRepos = allRepos.filter((repo: {name: string}) => !ignoredRepos.includes(repo.name));
      
      // 手动分页
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRepos = filteredRepos.slice(startIndex, endIndex);
      
      return paginatedRepos.map(v => ({
        id: v.id,
        name: v.name,
        description: v.description,
        repoUrl: v.html_url,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
        openIssuesCount: v.open_issues_count,
        watchers: v.watchers,
        stargazersCount: v.stargazers_count,
      }));
    }),
});
