import '@testing-library/jest-dom';

// Silenciar warnings específicos de Reactstrap y librerías de terceros
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Silenciar warnings de defaultProps de Reactstrap
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Support for defaultProps will be removed') ||
       args[0].includes('defaultProps'))
    ) {
      return;
    }

    // Silenciar warnings de findDOMNode de react-transition-group
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('findDOMNode is deprecated') ||
       args[0].includes('findDOMNode'))
    ) {
      return;
    }

    // Silenciar warnings de ReactDOM.render deprecado
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOM.render')
    ) {
      return;
    }

    // Silenciar warnings de act() y suspended resources
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('act(...)') ||
       args[0].includes('suspended resource') ||
       args[0].includes('wrap-tests-with-act'))
    ) {
      return;
    }

    // Mostrar otros errores normalmente
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Silenciar warnings de React Router Future Flags
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('v7_startTransition') ||
       args[0].includes('v7_relativeSplatPath'))
    ) {
      return;
    }

    // Silenciar otros warnings comunes de librerías
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillMount'))
    ) {
      return;
    }

    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock global de window.matchMedia (necesario para componentes responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de localStorage si no existe
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock de IntersectionObserver (útil para lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock de ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};