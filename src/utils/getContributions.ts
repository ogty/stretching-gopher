import dayjs from 'dayjs';
import { config } from 'dotenv';
import { Octokit } from '@octokit/core';

config();

type Contributions = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: [
          {
            contributionDays: [
              {
                date: string;
                contributionCount: number;
              },
            ];
          },
        ];
      };
    };
  };
};

export async function getContributions(userName: string) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY,
  });

  const now = dayjs().format('YYYY-MM-DDThh:mm:ss');
  const today = dayjs().subtract(0, 'day').format('YYYY-MM-DDThh:mm:ss');

  const query = `
    query contributions ($userName:String!, $now:DateTime!, $today:DateTime!) {
      user(login: $userName) {
        contributionsCollection(to: $now, from: $today) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const contributions = await octokit.graphql<Contributions>(query, {
    userName,
    now,
    today,
  });

  const dailyContributions: number[] = [];
  contributions.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
    week.contributionDays.forEach((contributionDay) => {
      dailyContributions.push(contributionDay.contributionCount);
    });
  });

  return dailyContributions[0];
}
