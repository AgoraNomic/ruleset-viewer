import * as tar from "tar-stream";
import * as zlib from "zlib";
import * as stream from "stream";

// https://stackoverflow.com/a/63361543/1629243
async function streamToString(stream: stream.Readable) {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export type DirTree = { [name: string]: DirTree | string | undefined };

function insertAtPath(tree: DirTree, path: string[], data: DirTree | string) {
  const [name, ...rest] = path;
  if (rest.length == 0 || rest[0] == "") {
    tree[name] = data;
  } else {
    const subtree = tree[name];
    if (!subtree || typeof subtree != "object") {
      throw new Error();
    }
    insertAtPath(subtree, rest, data);
  }
}

export async function getGitHubData(): Promise<DirTree> {
  const res = await fetch(
    "https://github.com/AgoraNomic/ruleset/archive/refs/heads/main.tar.gz"
  );
  // we're using node-fetch here, so this is true
  const body = res.body as unknown as stream.Readable;

  const tree = {};

  const gunzip = zlib.createGunzip();

  const extract = tar.extract();
  extract.on("entry", async (header, stream, next) => {
    try {
      const path = header.name.split("/");
      if (header.type == "directory") {
        insertAtPath(tree, path, {});
      } else if (header.type == "file") {
        insertAtPath(tree, path, await streamToString(stream));
      }

      next();
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  body.pipe(gunzip);
  gunzip.pipe(extract);

  await new Promise((resolve, reject) => {
    extract.on("finish", resolve);
    extract.on("error", reject);
  });

  return tree;
}
