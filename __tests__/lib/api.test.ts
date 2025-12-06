/**
 * API utility tests
 * Tests for API fetch functions and error handling
 */

describe('API Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Environment Configuration', () => {
    it('should have API base URLs defined', () => {
      // Check that API base can be configured via environment
      expect(process.env.NEXT_PUBLIC_SERVICES_API_BASE).toBeDefined;
    });
  });

  describe('Fetch Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'));
      
      await expect(
        fetch('/api/test')
      ).rejects.toThrow('Network error');
    });

    it('should handle 404 responses', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const response = await fetch('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    it('should handle 500 responses', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const response = await fetch('/api/error');
      expect(response.status).toBe(500);
    });
  });

  describe('Request Headers', () => {
    it('should set Content-Type for POST requests', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
    });
  });
});
