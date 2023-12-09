import { Router, Request, Response } from "express";
import { AppDataSouce } from "../data-source";
import { Profile } from "../entity/Profile";
import axios from "axios";
import { GOOGLE_API_KEY, ENGINE_ID } from "../config";

const router = Router();

async function googleSearch(q: String, page: number): Promise<any> {
  const query = `site:linkedin.com/in current * ${q}`;
  const start = (page - 1) * 10 + 1;
  const fields =
    "queries(request/totalResults, request/count),items(link,pagemap/metatags/og:image,pagemap/metatags/profile:first_name,pagemap/metatags/profile:last_name)";
  const { data } = await axios.get(
    "https://www.googleapis.com/customsearch/v1",
    {
      params: {
        key: GOOGLE_API_KEY,
        cx: ENGINE_ID,
        q: query,
        fields: fields,
        start: start,
      },
    }
  );
  return data;
}

function extract(d: any): any {
  return {
    link: d.link,
    img: d.pagemap.metatags[0]["og:image"],
    first_name: d.pagemap.metatags[0]["profile:first_name"],
    last_name: d.pagemap.metatags[0]["profile:last_name"],
  };
}

router.get("/", async (req: Request, res: Response) => {
  const profileRepository = AppDataSouce.getRepository(Profile);
  const data = await googleSearch(
    req.query.query as String,
    Number(req.query.page)
  );
  let totalResult = data.queries.request[0].totalResults;
  let items: Array<Object> = [];
  if (data.items)
    for (const d of data.items) {
      items.push({
        ...extract(d),
        issaved: (await profileRepository.exist({ where: { link: d.link } }))
          ? 1
          : 0,
      });
    }
  res.send({ totalResult, items });
});

router.post("/", async (req: Request, res: Response) => {
  const profileRepository = AppDataSouce.getRepository(Profile);
  for (let item of req.body) {
    const profile = new Profile();
    profile.link = item.link;
    profile.first_name = item.first_name;
    profile.last_name = item.last_name;
    profile.img_url = item.img;
    try {
      profileRepository.save(profile);
    } finally {
    }
  }
  res.send("Success");
});
router.post("/:query", async (req: Request, res: Response) => {
  const profileRepository = AppDataSouce.getRepository(Profile);
  const query = req.params.query;
  let count: number = 0;
  for (let i = 1; i <= 10; ++i) {
    googleSearch(query, i).then((data) => {
      data.items.map((d: any) => {
        let item = extract(d);
        const profile = new Profile();
        profile.link = item.link;
        profile.first_name = item.first_name;
        profile.last_name = item.last_name;
        profile.img_url = item.img;
        try {
          profileRepository.save(profile);
        } catch {
          ++count;
        }
      });
    });
  }
  res.send(`${count} unsaved`);
});

export default router;
