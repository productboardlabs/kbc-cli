import * as fetch from "node-fetch";
import { keboolaUrl } from "./defaults";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  "X-Storageapi-Token": process.env["KEBOOLA_TOKEN"]
};

export const pull = () =>
  fetch(keboolaUrl, {
    method: "GET",
    headers
  }).then(response => response.json());

export const push = (bucketId, transformation) =>
  fetch(`${keboolaUrl}/${bucketId}/rows/${transformation.id}`, {
    method: "PUT",
    headers,
    body: `configuration=${encodeURIComponent(
      JSON.stringify(transformation.configuration)
    )}&changeDescription=${encodeURIComponent(
      `Change Queries in ${transformation.name}`
    )}`
  }).then(response => response.json());
