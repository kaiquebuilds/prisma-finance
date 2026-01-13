import { expect, test } from "vitest";
import { foo } from ".";

test("foo() returns 'bar'", () => {
  expect(foo()).toBe("bar");
});
