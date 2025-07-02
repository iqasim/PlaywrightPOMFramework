import path from "path";
import fs from "fs";
import config from "../../../playwright.config";

export function loadJsonFile(filename: string): any {
  return require(path.resolve(config.testDatadir, filename));
}