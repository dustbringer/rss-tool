import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

export type CombineData = {
  [key: string]: number | string | undefined; // put whatever but i only care about the following
  url0: string | undefined;
  url1: string | undefined;
  url2: string | undefined;
  url3: string | undefined;
  url4: string | undefined;
  url5: string | undefined;
  url6: string | undefined;
  url7: string | undefined;
  url8: string | undefined;
  url9: string | undefined;
  limit: number | undefined;
};

// Details in https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/3.XMLBuilder.md
export const defaultXmlOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  // parseAttributeValue: true,
  indentBy: "  ",
  format: true,
  // // You need this to preserve boolean values!
  suppressBooleanAttributes: false,
};

export function parseXML(input: string) {
  const parser = new XMLParser(defaultXmlOptions);
  return parser.parse(input);
}

export function combineDatas(
  datas: Array<string>,
  limit: number,
  url?: string
) {
  console.log(`Combining ${datas.length} feeds`);
  const objs = datas.map((data) => parseXML(data));
  const all = objs
    .map((obj) => obj.rss.channel.item)
    .flat()
    .toSorted(
      // sort the items
      (a: any, b: any) =>
        -(new Date(a.pubDate).valueOf() - new Date(b.pubDate).valueOf())
    );

  const namespaces = [
    `xmlns=http://www.w3.org/2005/Atom`,
    ...new Set(datas.map((data) => data.match(/xmlns:[^=]+="[^"]+"/g)).flat()),
  ]
    .filter((s) => s !== null)
    .map((s) => {
      const output = s.split("=");
      output[0] = `@_${output[0]}`;
      return output;
    });

  const output = {
    feed: {
      ...Object.fromEntries(namespaces),
      title: `rss-tools: combined feeds [${objs
        .map((obj) => obj.rss.channel.title)
        .join(",")}]`,
      link: {
        "@_rel": "self",
        href: url,
      },
      updated: new Date().toISOString(),
      author: "dustbringer",
      entry: all.slice(0, limit), // only take up to limit
    },
  };
  return output;
}

export default function combine(data: CombineData, url: string) {
  return Promise.all(
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      .filter((n) => data[`url${n}`] !== undefined)
      .map((n) => fetch(data[`url${n}`] as string))
  )
    .then((ress) => Promise.all(ress.map((res) => res.text())))
    .then((datas) => {
      const builder = new XMLBuilder(defaultXmlOptions);
      const xmlContent = builder.build(
        combineDatas(datas, data.limit || 25, url)
      );
      return `<?xml version="1.0" encoding="UTF-8"?>${xmlContent}`;
    });
}
