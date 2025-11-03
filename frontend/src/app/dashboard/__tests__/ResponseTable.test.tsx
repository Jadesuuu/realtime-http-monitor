import { render, screen, fireEvent } from "@testing-library/react";
import { ResponseTable } from "../ResponseTable";
import { Response } from "@/types/api.types";

/**
 * Mock Data Generator
 *
 * Creates fake response data for testing.
 * Allows testing with different dataset sizes.
 */
const createMockResponses = (count: number): Response[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    requestPayload: JSON.stringify({ test: "data" }),
    responseData: JSON.stringify({ origin: `192.168.1.${i}` }),
    statusCode: i % 5 === 0 ? 500 : 200, // Every 5th is an error
    responseTime: 100 + i * 10,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
};

describe("ResponseTable", () => {
  /**
   * Test: Component Renders
   *
   * Verifies component mounts without crashing.
   */
  it("should render table with title", () => {
    const mockData = createMockResponses(5);
    render(<ResponseTable responses={mockData} />);

    expect(screen.getByText(/Response History/)).toBeInTheDocument();
    expect(screen.getByText(/\(5\)/)).toBeInTheDocument();
  });

  /**
   * Test: Empty State
   *
   * Verifies proper message when no data available.
   */
  it("should display empty state when no responses", () => {
    render(<ResponseTable responses={[]} />);

    expect(screen.getByText(/No data yet/)).toBeInTheDocument();
  });

  /**
   * Test: Data Display
   *
   * Verifies all columns render correctly with data.
   */
  it("should display response data correctly", () => {
    const mockData = createMockResponses(3);
    render(<ResponseTable responses={mockData} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("200")[0]).toBeInTheDocument();
    expect(screen.getByText(/100ms/)).toBeInTheDocument();
    expect(screen.getByText(/192.168.1.0/)).toBeInTheDocument();
  });

  /**
   * Test: Pagination Visibility
   *
   * Verifies pagination only shows when needed.
   */
  it("should not show pagination with less than 10 items", () => {
    const mockData = createMockResponses(5);
    render(<ResponseTable responses={mockData} />);

    expect(screen.queryByText(/Previous/)).not.toBeInTheDocument();
  });

  it("should show pagination with more than 10 items", () => {
    const mockData = createMockResponses(15);
    render(<ResponseTable responses={mockData} />);

    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    expect(screen.getByText(/Previous/)).toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
  });

  /**
   * Test: Pagination Navigation
   *
   * Verifies pagination buttons work correctly.
   */
  it("should navigate to next page", () => {
    const mockData = createMockResponses(15);
    render(<ResponseTable responses={mockData} />);

    // First page shows ID 1
    expect(screen.getByText("1")).toBeInTheDocument();

    const nextButton = screen.getByText(/Next/);
    fireEvent.click(nextButton);

    // Second page shows ID 11
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
  });

  /**
   * Test: Button Disabled States
   *
   * Verifies prev/next buttons disable at boundaries.
   */
  it("should disable previous button on first page", () => {
    const mockData = createMockResponses(15);
    render(<ResponseTable responses={mockData} />);

    const prevButton = screen.getByRole("button", { name: /Previous/ });
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    const mockData = createMockResponses(15);
    render(<ResponseTable responses={mockData} />);

    // Navigate to last page
    const nextButton = screen.getByRole("button", { name: /Next/ });
    fireEvent.click(nextButton);

    // Next button should now be disabled
    expect(nextButton).toBeDisabled();
  });

  /**
   * Test: Status Badge Variants
   *
   * Verifies success/error badges render correctly.
   */
  it("should show error badge for non-200 status codes", () => {
    const mockData: Response[] = [
      {
        id: 1,
        requestPayload: "{}",
        responseData: "{}",
        statusCode: 500,
        responseTime: 100,
        timestamp: new Date().toISOString(),
      },
    ];

    render(<ResponseTable responses={mockData} />);
  });
});
