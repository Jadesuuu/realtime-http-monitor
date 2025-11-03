import { render, screen } from "@testing-library/react";
import { ResponseTimeChart } from "../ResponseTimeChart";
import { Response } from "@/types/api.types";

/**
 * Mock Recharts
 *
 * Recharts requires DOM and is hard to test.
 * Mock it to test data transformation logic instead.
 */
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
  }) => (
    <div data-testid="line-chart" data-chart-length={data.length}>
      {children}
    </div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const createMockResponses = (count: number): Response[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    requestPayload: "{}",
    responseData: "{}",
    statusCode: 200,
    responseTime: 100 + i * 10,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
};

describe("ResponseTimeChart", () => {
  /**
   * Test: Component Renders
   */
  it("should render chart with title", () => {
    const mockData = createMockResponses(10);
    render(<ResponseTimeChart responses={mockData} />);

    expect(screen.getByText("Response Time Trend")).toBeInTheDocument();
    expect(screen.getByText("Last 20 requests")).toBeInTheDocument();
  });

  /**
   * Test: Chart Elements Present
   */
  it("should render all chart components", () => {
    const mockData = createMockResponses(10);
    render(<ResponseTimeChart responses={mockData} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
  });

  /**
   * Test: Data Limit
   *
   * Verifies only last 20 responses are charted.
   */
  it("should limit data to 20 responses", () => {
    const mockData = createMockResponses(30);
    render(<ResponseTimeChart responses={mockData} />);

    const chart = screen.getByTestId("line-chart");
    expect(chart.getAttribute("data-chart-length")).toBe("20");
  });

  /**
   * Test: Empty Data
   */
  it("should handle empty responses array", () => {
    render(<ResponseTimeChart responses={[]} />);

    const chart = screen.getByTestId("line-chart");
    expect(chart.getAttribute("data-chart-length")).toBe("0");
  });

  /**
   * Test: Small Dataset
   */
  it("should handle small datasets correctly", () => {
    const mockData = createMockResponses(5);
    render(<ResponseTimeChart responses={mockData} />);

    const chart = screen.getByTestId("line-chart");
    expect(chart.getAttribute("data-chart-length")).toBe("5");
  });
});
