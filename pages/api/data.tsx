import { getGitHubData } from "../../lib/github-api"
import { NextApiRequest, NextApiResponse } from "next"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.json(await getGitHubData())
}
