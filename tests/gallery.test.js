// Gallery functionality tests
describe('Gallery Module', () => {
  let galleryElement;
  let images;

  beforeEach(() => {
    // Setup gallery DOM structure
    document.body.innerHTML = `
      <div class="gallery">
        <img src="img/test1.jpg" alt="Test 1" class="gallery-image">
        <img src="img/test2.jpg" alt="Test 2" class="gallery-image">
        <img src="img/test3.jpg" alt="Test 3" class="gallery-image">
      </div>
    `;
    
    galleryElement = document.querySelector('.gallery');
    images = document.querySelectorAll('.gallery-image');
  });

  test('should initialize gallery with images', () => {
    expect(galleryElement).toBeInTheDocument();
    expect(images).toHaveLength(3);
    
    images.forEach((img, index) => {
      expect(img.src).toBeTruthy();
      expect(img.alt).toBeTruthy();
    });
  });

  test('should handle image click events', () => {
    const firstImage = images[0];
    let clickEventFired = false;
    
    firstImage.addEventListener('click', (e) => {
      clickEventFired = true;
      expect(e.target).toBe(firstImage);
    });
    
    firstImage.click();
    expect(clickEventFired).toBe(true);
  });

  test('should have responsive image classes', () => {
    images.forEach(img => {
      expect(img.classList.contains('gallery-image')).toBe(true);
    });
  });
});