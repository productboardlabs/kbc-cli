import * as fetch from "node-fetch";
import { keboolaUrl } from "./defaults";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  "X-Storageapi-Token": process.env["KEBOOLA_TOKEN"]
};

export const getTransformations = () =>
  // @ts-ignore
  fetch(keboolaUrl, {
    method: "GET",
    headers
    // @ts-ignore
  }).then(response => response.json());

export const getTransformation = (bucketId: number, transformationId: number) =>
  // @ts-ignore
  fetch(`${keboolaUrl}/${bucketId}/rows/${transformationId}`, {
    method: "GET",
    headers
    // @ts-ignore
  }).then(response => response.json());

// @ts-ignore
export const pushTransformation = (bucketId: number, transformation) =>
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
