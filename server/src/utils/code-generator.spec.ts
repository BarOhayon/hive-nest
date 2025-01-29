import { generateRandomCode } from './code-generator';

describe('generateRandomCode', () => {
  // Test that generates multiple codes to check for consistent behavior
  it('should generate codes of exactly 4 characters', () => {
    // Generate multiple codes to ensure consistency
    for (let i = 0; i < 100; i++) {
      const code = generateRandomCode();
      expect(code.length).toBe(4);
    }
  });

  it('should only contain alphanumeric characters', () => {
    // The regular expression pattern matches only alphanumeric characters
    const alphanumericPattern = /^[A-Za-z0-9]+$/;

    // Test multiple codes to ensure consistent behavior
    for (let i = 0; i < 100; i++) {
      const code = generateRandomCode();
      expect(code).toMatch(alphanumericPattern);
    }
  });

  it('should generate different codes on subsequent calls', () => {
    // Generate a set of codes to check for uniqueness
    const codes = new Set();
    for (let i = 0; i < 100; i++) {
      codes.add(generateRandomCode());
    }

    // If codes are truly random, we should get close to 100 unique codes
    // We use 50 as a conservative threshold to account for possible random collisions
    expect(codes.size).toBeGreaterThan(50);
  });

  it('should use characters from all possible categories', () => {
    // Generate a large sample of codes to analyze character distribution
    let combinedCodes = '';
    for (let i = 0; i < 100; i++) {
      combinedCodes += generateRandomCode();
    }

    // Test for presence of each character category
    expect(combinedCodes).toMatch(/[A-Z]/); // Uppercase letters
    expect(combinedCodes).toMatch(/[a-z]/); // Lowercase letters
    expect(combinedCodes).toMatch(/[0-9]/); // Numbers
  });

  // This test helps catch any performance issues
  it('should generate codes quickly', () => {
    const startTime = process.hrtime();

    // Generate many codes to measure performance
    for (let i = 0; i < 1000; i++) {
      generateRandomCode();
    }

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const totalMilliseconds = seconds * 1000 + nanoseconds / 1000000;

    // Generating 1000 codes should take less than 100ms
    expect(totalMilliseconds).toBeLessThan(100);
  });
});
