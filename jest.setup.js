/**
 * Jest Setup File
 * Runs after Jest is initialized but before tests run
 */
// Import jest-dom matchers - this extends expect with DOM assertions
require('@testing-library/jest-dom')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock environment variables for API testing
process.env.NEXT_PUBLIC_USER_API_BASE = 'http://localhost:8001'
process.env.NEXT_PUBLIC_SERVICE_API_BASE = 'http://localhost:8002'
process.env.NEXT_PUBLIC_STAFF_API_BASE = 'http://localhost:8003'
process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE = 'http://localhost:8004'
process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE = 'http://localhost:8005'
process.env.NEXT_PUBLIC_ANALYTICS_API_BASE = 'http://localhost:8006'

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('act(...)'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global fetch mock
global.fetch = jest.fn()

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
