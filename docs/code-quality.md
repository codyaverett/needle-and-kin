# Code Quality and Testing Documentation

## Code Quality Tools

### ESLint - TypeScript and JavaScript Linting

The project uses ESLint for maintaining code quality and consistency across TypeScript, JavaScript, and Vue files.

#### Configuration
- **Config File**: `.eslintrc.cjs`
- **Ignore File**: `.eslintignore`

#### Available Scripts
```bash
# Check for linting issues
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# TypeScript type checking
pnpm typecheck
```

#### Rules Overview
- **TypeScript**: Strict typing with warnings for `any` usage
- **Unused Variables**: Must prefix with underscore (`_`) to ignore
- **Console Logs**: Warnings except for `console.warn`, `console.error`, and `console.info`
- **Code Style**: Enforces `const` over `let`, template literals, object shorthand
- **Vue Components**: Multi-word names not required for flexibility

#### File-Specific Rules
- **Test Files** (`*.test.ts`, `*.spec.ts`): Relaxed rules for testing
- **Story Files** (`*.stories.js`): Console logs allowed for debugging
- **Server Files** (`server/**`): Info logs allowed for debugging

### TypeScript Configuration

#### Main Config
- **File**: `tsconfig.json`
- **Extends**: Nuxt's base TypeScript configuration
- **Path Aliases**: Configured for clean imports (`@components`, `@utils`, etc.)

#### Exclusions
- Test files and test utilities
- Coverage reports
- Build outputs

### Vue TypeScript Checking
```bash
# Run Vue TypeScript checking
pnpm typecheck
```

This uses `vue-tsc` to check TypeScript in Vue single-file components.

## Testing Strategy

### Test Framework
- **Vitest**: Modern, fast unit testing framework
- **Vue Test Utils**: Official Vue testing library
- **Happy DOM**: Lightweight DOM implementation for testing

### Test Structure
```
server/
  api/
    auth/
      __tests__/     # API endpoint tests
        login.test.ts
        logout.test.ts
        me.test.ts
        refresh.test.ts
        register.test.ts
    posts/
      __tests__/
        index.test.ts
        [slug].test.ts
        latest.test.ts
  __tests__/         # Server utility tests
    security.test.ts
utils/
  __tests__/         # Utility function tests
    math.test.ts
    string.test.ts
test/               # Test setup and helpers
  setup.ts
  server-setup.ts
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test server/api/auth/__tests__/login.test.ts

# Run tests in watch mode
pnpm test --watch
```

### Test Coverage
The project maintains comprehensive test coverage for:
- **Authentication Endpoints**: Login, logout, registration, token refresh
- **Blog Post APIs**: Listing, filtering, pagination, individual posts
- **Security**: Input sanitization, XSS protection, rate limiting simulation
- **Utilities**: String manipulation, math functions
- **Contact Forms**: Validation, submission, error handling

### Test Best Practices

#### 1. Test File Organization
- Co-locate tests with the code they test
- Use `__tests__` directories for better organization
- Name test files with `.test.ts` or `.spec.ts` suffix

#### 2. Test Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should handle specific behavior', async () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = await functionUnderTest(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

#### 3. Mocking
```typescript
// Mock external dependencies
vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      findByEmail: vi.fn()
    }
  }
}))

// Use vi.mocked for properly typed mocks
const mockDb = vi.mocked(db, true)
```

#### 4. Test Utilities
The project includes a `test-utils.ts` file for common test helpers:
```typescript
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Use in tests
const mockEvent = createMockEvent()
setupGlobalMocks()
```

### Continuous Integration

While not yet configured, the testing setup is ready for CI/CD integration:

```yaml
# Example GitHub Actions workflow
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v2
    - name: Install dependencies
      run: pnpm install
    - name: Run linter
      run: pnpm lint
    - name: Run type checking
      run: pnpm typecheck
    - name: Run tests
      run: pnpm test:coverage
```

## Development Workflow

### Pre-commit Checklist
1. **Lint your code**: `pnpm lint:fix`
2. **Check types**: `pnpm typecheck`
3. **Run tests**: `pnpm test`
4. **Update documentation**: Document any new features or changes

### Test-Driven Development (TDD)
When adding new features:
1. Write tests first that define the expected behavior
2. Run tests to see them fail
3. Implement the feature to make tests pass
4. Refactor code while keeping tests green
5. Update documentation

### Code Review Guidelines
- All code must pass linting (`pnpm lint`)
- All tests must pass (`pnpm test`)
- New features must include tests
- TypeScript types should be properly defined (avoid `any`)
- Follow existing code patterns and conventions

## Performance Monitoring

### Build Analysis
```bash
# Analyze bundle size
pnpm build
# Check .output/public/_nuxt/ for bundle sizes
```

### Testing Performance
```bash
# Run tests with performance timing
pnpm test --reporter=verbose
```

## Security Considerations

### Input Validation
- All user inputs are sanitized server-side
- XSS protection through proper escaping
- SQL injection prevention (when database is implemented)

### Authentication Security
- JWT tokens with proper expiration
- Refresh token rotation
- Secure cookie settings (httpOnly, secure in production)
- Password hashing with bcrypt

### API Security
- Rate limiting ready for implementation
- CORS properly configured
- Input validation on all endpoints
- Error messages don't leak sensitive information

## Future Improvements

### Planned Enhancements
1. **E2E Testing**: Add Playwright for end-to-end testing
2. **Visual Regression**: Implement visual testing with Percy or Chromatic
3. **Performance Testing**: Add Lighthouse CI for performance monitoring
4. **Security Scanning**: Integrate security scanning tools
5. **Dependency Auditing**: Automated vulnerability scanning

### Monitoring and Observability
- Error tracking integration (Sentry)
- Performance monitoring (Web Vitals)
- Analytics integration
- User session recording (for debugging)

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Documentation](https://eslint.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [ESLint Playground](https://eslint.org/demo)