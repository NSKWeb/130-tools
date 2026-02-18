# Contributing to 130 Tools Platform

Thank you for your interest in contributing to the 130 Tools Platform! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please:

1. Check if the bug has already been reported
2. Try to isolate the problem
3. Collect relevant information (browser, OS, error messages)

When submitting a bug report, include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

1. Check if the enhancement has already been suggested
2. Provide clear use case and benefits
3. Consider implementation complexity

### Adding New Tools

To add a new tool:

1. Read the [Tool Development Guide](TOOLS.md)
2. Create the tool configuration JSON
3. Implement the tool logic
4. Add tests
5. Update documentation

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests
5. Update documentation
6. Ensure tests pass
7. Submit pull request

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis (optional)

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/130tools-platform.git
cd 130tools-platform

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
cp .env.local.example .env.local

# Set up database
pnpm db:generate
pnpm db:push
pnpm db:seed

# Start development
pnpm dev
```

## Project Structure

```
├── apps/
│   ├── web/          # Public site
│   └── admin/        # Admin dashboard
├── packages/
│   ├── database/     # Prisma client
│   ├── types/        # TypeScript types
│   ├── validation/   # Zod schemas
│   ├── cache/        # Redis caching
│   ├── errors/       # Error classes
│   └── tools/        # Tool engine
└── e2e/              # E2E tests
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Avoid `any` type - use `unknown` if necessary
- Export types from index files
- Document complex types

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use composition over inheritance
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first approach
- Ensure dark mode support
- Maintain accessibility standards

### Testing

- Write unit tests for utilities
- Write integration tests for APIs
- Write E2E tests for critical paths
- Aim for 80%+ coverage

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Documentation

- Document all public APIs
- Include JSDoc comments for functions
- Update README for new features
- Keep API.md and TOOLS.md current

## Commit Guidelines

We follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:

```
feat(tools): add compound interest calculator
fix(auth): resolve session timeout issue
docs(api): update authentication examples
test(tools): add unit tests for bmi calculator
```

## Tool Development Guidelines

When creating a new tool:

1. **Keep it focused** - One clear purpose
2. **Validate inputs** - Prevent invalid data
3. **Handle errors** - Graceful error messages
4. **Test thoroughly** - Edge cases matter
5. **Document well** - Clear descriptions

See [TOOLS.md](TOOLS.md) for detailed guide.

## Review Process

Pull requests require:

1. Passing CI checks
2. Code review approval
3. Up-to-date with main branch
4. No merge conflicts

Reviewers will check:

- Code quality and style
- Test coverage
- Documentation updates
- Security implications
- Performance impact

## Testing Checklist

Before submitting PR:

- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Manual testing completed
- [ ] E2E tests pass (if applicable)
- [ ] No console errors
- [ ] Works in dark mode
- [ ] Mobile responsive
- [ ] Accessibility verified

## Questions?

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
