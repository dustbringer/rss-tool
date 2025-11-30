import express from "express";
import type { Request, Response } from "express";

import combine from "./modules/xml.js";
import type { CombineData } from "./modules/xml.js";

interface RequestQuery {
  foo: string;
}

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    routes: ["/combine"],
    help: {
      combine: `Set query using ?url0= url1= etc. up to url9=. To change the output item limit, ?limit=100 (default 25).`,
    },
  });
});

app.get("/combine", (req: Request<{}, {}, {}, CombineData>, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const data: CombineData = {
    url0: req.query.url0,
    url1: req.query.url1,
    url2: req.query.url2,
    url3: req.query.url3,
    url4: req.query.url4,
    url5: req.query.url5,
    url6: req.query.url6,
    url7: req.query.url7,
    url8: req.query.url8,
    url9: req.query.url9,
    limit: !isNaN(Number(req.query.limit)) ? Number(req.query.limit) : 25,
  };

  combine(data, fullUrl).then((xml) => {
    res.set("Content-Type", "text/xml");
    res.send(xml);
    // res.json(xml);
  });
});

app.use((req, res) => {
  res.status(404).send(`404 ${req.path} not found`);
  console.log(`GET ${req.path}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
