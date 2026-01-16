import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Create from "@/pages/tracks/create";
import rootReducer from "@/store/reducers";
import { useRouter } from "next/router";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock MainLayout to just render children
jest.mock("@/layouts/MainLayout", () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

// Mock StepWrapper to render step 0 content when activeStep is 0
jest.mock("@/components/StepWrapper", () => {
  return function MockStepWrapper({
    activeStep,
    children,
  }: {
    activeStep: number;
    children: React.ReactNode[];
  }) {
    return <div data-testid="step-wrapper">{children[activeStep]}</div>;
  };
});

// Mock FileUpload component
jest.mock("@/components/FileUpload", () => {
  return function MockFileUpload({
    setFile,
    children,
  }: {
    setFile: (file: File) => void;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <button onClick={() => setFile(new File([""], "test.txt"))}>
          {children}
        </button>
      </div>
    );
  };
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Create Page - First Form (Step 0)", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: "/tracks/create",
      query: {},
      asPath: "/tracks/create",
      isReady: true,
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isPreview: false,
    } as unknown as ReturnType<typeof useRouter>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display all form fields in step 0 with correct labels", () => {
    // Create a minimal Redux store for testing
    const store = configureStore({
      reducer: rootReducer,
    });

    render(
      <Provider store={store}>
        <Create />
      </Provider>
    );

    // Check that all three text fields are present with correct labels
    expect(screen.getByLabelText("Название трека")).toBeInTheDocument();
    expect(screen.getByLabelText("Имя исполнителя")).toBeInTheDocument();
    expect(screen.getByLabelText("Слова к треку")).toBeInTheDocument();
  });

  it("should render step 0 as the initial active step", () => {
    const store = configureStore({
      reducer: rootReducer,
    });

    render(
      <Provider store={store}>
        <Create />
      </Provider>
    );

    // Verify the text fields are visible (indicating step 0 is active)
    const trackNameInput = screen.getByLabelText(
      "Название трека"
    ) as HTMLInputElement;
    const artistNameInput = screen.getByLabelText(
      "Имя исполнителя"
    ) as HTMLInputElement;
    const lyricsInput = screen.getByLabelText(
      "Слова к треку"
    ) as HTMLTextAreaElement;

    expect(trackNameInput).toBeVisible();
    expect(artistNameInput).toBeVisible();
    expect(lyricsInput).toBeVisible();
  });

  it("should have input fields as empty initially", () => {
    const store = configureStore({
      reducer: rootReducer,
    });

    render(
      <Provider store={store}>
        <Create />
      </Provider>
    );

    const trackNameInput = screen.getByLabelText(
      "Название трека"
    ) as HTMLInputElement;
    const artistNameInput = screen.getByLabelText(
      "Имя исполнителя"
    ) as HTMLInputElement;
    const lyricsInput = screen.getByLabelText(
      "Слова к треку"
    ) as HTMLTextAreaElement;

    expect(trackNameInput.value).toBe("");
    expect(artistNameInput.value).toBe("");
    expect(lyricsInput.value).toBe("");
  });
});
