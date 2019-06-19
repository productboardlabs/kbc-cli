import * as fetch from "node-fetch";
import { keboolaUrl } from "./defaults";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  "X-Storageapi-Token": process.env["KEBOOLA_TOKEN"]
};

export const pull = () =>
  // @ts-ignore
  fetch(keboolaUrl, {
    method: "GET",
    headers
    // @ts-ignore
  }).then(response => response.json());

// @ts-ignore
export const push = (bucketId, transformation) =>
  // @ts-ignore
  fetch(`${keboolaUrl}/${bucketId}/rows/${transformation.id}`, {
    method: "PUT",
    headers,
    body: `configuration=${encodeURIComponent(
      JSON.stringify(transformation.configuration)
    )}&changeDescription=${encodeURIComponent(
      `Change Queries in ${transformation.name}`
    )}`
    // @ts-ignore
  }).then(response => response.json());
