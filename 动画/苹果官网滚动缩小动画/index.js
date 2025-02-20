if (window.innerWidth <= 1920) {
  var matrix_one = 2.07298;
  var matrix_three = 2.07298;
  var matrix_six = 198.73;
}
if (window.innerWidth <= 1660) {
  var matrix_one = 1.7655;
  var matrix_three = 1.7655;
  var matrix_six = 198.73;
}
if (window.innerWidth <= 1024) {
  var matrix_one = 2.54469;
  var matrix_three = 2.54469;
  var matrix_six = 213.4;
}

document.addEventListener('scroll', function () {
  const scalingContainer = document.querySelector('.scaling-container');
  if (scalingContainer) {
    const videoMedia = document.querySelector('.inline-video-media video');
    const videoFrameStatic = document.querySelector('.inline-video-frame-static');
    const overviewHeroTvShadowColor = document.querySelector('.overview-hero-hero-tv-shadow-color');
    const overviewHeroTvRemote = document.querySelector('.overview-hero-hero-tv-remote');
    const sectionContent = document.querySelector('.section-content');

    const maxScroll = window.innerHeight * 1.75 - window.innerHeight;
    const scrollFraction = window.scrollY / maxScroll;
    const scale = Math.max(1, matrix_one - scrollFraction * (matrix_one - 1));
    const skew = Math.max(0, matrix_six - scrollFraction * matrix_six);
    const scale_two = Math.max(0.5, 1 - scrollFraction / 2);
    const skew_two = Math.max(-30, 0 - scrollFraction * (matrix_six + 30));

   
    scalingContainer.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, ${skew})`;
    overviewHeroTvRemote.style.transform = `matrix(${scale_two}, 0, 0, ${scale_two}, 0, ${skew_two})`;
    
    if (overviewHeroTvShadowColor) {
      overviewHeroTvShadowColor.style.opacity = `${0 + scrollFraction}`;
    }

    if (scale < 1.1) {
      if (videoMedia) {
        videoMedia.style.opacity = '0';
      }
      if (videoFrameStatic) {
        videoFrameStatic.style.opacity = '1';
        overviewHeroTvShadowColor.classList.add('no-blur');
        
      }
    } else {
      if (videoMedia) {
        videoMedia.style.opacity = '1';
      }
      if (videoFrameStatic) {
        videoFrameStatic.style.opacity = '0';
        overviewHeroTvShadowColor.classList.remove('no-blur');
      }
    }
    
    if (scale < 1.1) {
      sectionContent.style.opacity = '1';
    } else {
      sectionContent.style.opacity = '0';
    }

  }
});