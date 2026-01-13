import { expect, test } from "vitest";
import { sayHello } from "@/index";

test("sayHello() has 'Hello' in it", () => {
  expect(sayHello()).toContain("Hello");
});
