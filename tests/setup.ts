// Jest DOM setup and mocks
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  data: {} as Record<string, string>,
};
// Add actual implementation for testing
localStorageMock.getItem.mockImplementation((key: string) => localStorageMock.data[key] || null);
localStorageMock.setItem.mockImplementation((key: string, value: string) => {
  localStorageMock.data[key] = value;
});
localStorageMock.removeItem.mockImplementation((key: string) => {
  delete localStorageMock.data[key];
});
localStorageMock.clear.mockImplementation(() => {
  localStorageMock.data = {};
});

global.localStorage = localStorageMock as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock CustomEvent
class CustomEventMock<T = any> extends Event {
  detail: T;
  constructor(type: string, options: CustomEventInit<T> = {}) {
    super(type, options);
    this.detail = options.detail as T;
  }
}
global.CustomEvent = CustomEventMock as any;

