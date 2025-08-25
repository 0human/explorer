import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paginationInput } from "@/server/zod-types";

// Mocked DB
interface Post {
  id: number;
  name: string;
}
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

const ORG_NAME = '0human'

export const githubRouter = createTRPCRouter({
  getRepoDetail: publicProcedure
    .input(z.object({ repo: z.string() }))
    .query(async ({ input, ctx }) => {
      const { repo } = input;
      try {
        const res = await ctx.octokit.rest.repos.get({
          owner: ORG_NAME,
          repo,
        });

        // 获取README内容
        let readme = null;
        try {
          const readmeRes = await ctx.octokit.rest.repos.getReadme({
            owner: ORG_NAME,
            repo,
          });
          // 解码base64编码的README内容
          readme = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
        } catch (error) {
          // 如果没有README，忽略错误
        }

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
          readme,
        };
      } catch (error) {
        return null;
      }
    }),

  getRepos: publicProcedure
    .input(paginationInput)
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;
      const res = await ctx.octokit.rest.repos.listForOrg({
        org: ORG_NAME,
        per_page: pageSize,
        page,
      });
      return res.data.map(v => ({
        id: v.id,
        name: v.name,
        description: v.description,
        repoUrl: v.html_url,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
        openIssuesCount: v.open_issues_count,
        watchers: v.watchers,
        stargazersCount: v.stargazers_count,
      }))
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});
