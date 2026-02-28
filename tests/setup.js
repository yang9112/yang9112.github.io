// Jest DOM setup

// Simple custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && document.body.contains(received);
    if (pass) {
      return {
        message: () => `expected element not to be in the document`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be in the document`,
        pass: false,
      };
    }
  }
});

// Cleanup after each test
afterEach(() => {
  document.body.innerHTML = '';
});

// Mock global objects that are not available in JSDOM
global.fetch = jest.fn();

// Console methods mocking for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};