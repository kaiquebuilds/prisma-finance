import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserNotFound } from "./user-not-found";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

const mockFetchApi = vi.fn();

vi.mock("@/lib/api/client", () => ({
  fetchApi: (...args: unknown[]) => mockFetchApi(...args),
}));

function mockFetchApiResponse(data: unknown) {
  mockFetchApi.mockResolvedValueOnce({
    json: () => Promise.resolve({ data }),
  });
}

function mockFetchApiError() {
  mockFetchApi.mockRejectedValueOnce(new Error("API error (404)"));
}

describe("<UserNotFound />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    mockFetchApi.mockReset();
    mockRefresh.mockReset();
  });

  it("shows error state immediately for non-404 status codes", () => {
    render(<UserNotFound statusCode={500} />);

    expect(screen.getByText(/não foi possível/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /tentar/i })).toBeDefined();
    expect(screen.queryByText(/preparando/i)).toBeNull();
  });

  it("does not poll when status code is not 404", async () => {
    render(<UserNotFound statusCode={500} />);

    await vi.advanceTimersByTimeAsync(3000);

    expect(mockFetchApi).not.toHaveBeenCalled();
  });

  it("shows loading state for 404", () => {
    mockFetchApiError();
    render(<UserNotFound statusCode={404} />);

    expect(screen.getByText(/preparando/i)).toBeDefined();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls router.refresh() when user is found", async () => {
    mockFetchApiResponse({ name: "Alex" });
    render(<UserNotFound statusCode={404} />);

    await vi.advanceTimersByTimeAsync(3000);

    expect(mockFetchApi).toHaveBeenCalledWith("/v1/users/me");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("retries on failed polls and shows error after max retries", async () => {
    for (let i = 0; i < 10; i++) {
      mockFetchApiError();
    }

    render(<UserNotFound statusCode={404} />);

    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(3000);
    }
    // flush the state update from the last retry
    await vi.advanceTimersByTimeAsync(0);

    expect(mockFetchApi).toHaveBeenCalledTimes(10);
    expect(screen.getByText(/não foi possível/i)).toBeDefined();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("refreshes the page when retry button is clicked after error", async () => {
    render(<UserNotFound statusCode={500} />);

    screen.getByRole("button", { name: /tentar/i }).click();

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("succeeds after a few failed retries", async () => {
    mockFetchApiError();
    mockFetchApiError();
    mockFetchApiResponse({ name: "Alex" });

    render(<UserNotFound statusCode={404} />);

    await vi.advanceTimersByTimeAsync(3000);
    await vi.advanceTimersByTimeAsync(3000);
    await vi.advanceTimersByTimeAsync(3000);

    expect(mockFetchApi).toHaveBeenCalledTimes(3);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
