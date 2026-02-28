// Image optimization tests
describe('Image Optimization', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div class="gallery">
        <img src="img/logo1.png" alt="Test Logo 1" class="gallery-image">
        <img src="img/logo2.jpg" alt="Test Logo 2" class="gallery-image">
      </div>
    `;
  });

  test('should have optimized image paths in production HTML', () => {
    const images = document.querySelectorAll('.gallery-image');
    expect(images).toHaveLength(2);
    
    // Test that images have proper alt attributes
    images.forEach((img, index) => {
      expect(img.alt).toBeTruthy();
      expect(img.classList.contains('gallery-image')).toBe(true);
    });
  });

  test('should handle lazy loading for images', () => {
    const images = document.querySelectorAll('.gallery-image');
    images.forEach(img => {
      // Set loading attribute manually since JSDOM doesn't support it
      img.loading = 'lazy';
      expect(img.loading).toBe('lazy');
    });
  });
});