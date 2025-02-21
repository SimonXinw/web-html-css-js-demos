if (window.innerWidth <= 1024) {
  var matrix_one = 2.54469;
  var matrix_three = 2.54469;
  var matrix_six = 213.4;
} else {
  var matrix_one = window.innerWidth / 918;
  var matrix_three = window.innerWidth / 918;
  if (window.innerWidth <= 4480) {
    var matrix_six = 394.845;
  }
  if (window.innerWidth <= 1920) {
    var matrix_six = 198.73;
  }
  if (window.innerWidth <= 1660) {
    var matrix_six = 198.73;
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const scalingContainer = document.querySelector('.section-hero .scaling-container');
  if (scalingContainer) {
    const scale = matrix_one;
    const skew = matrix_six;
    scalingContainer.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, ${skew})`;
  }
});
window.addEventListener('resize', function () {
  if (window.innerWidth <= 1024) {
    matrix_one = 2.54469;
    matrix_three = 2.54469;
    matrix_six = 213.4;
  } else {
    matrix_one = window.innerWidth / 918;
    matrix_three = window.innerWidth / 918;
    if (window.innerWidth <= 4480) {
      matrix_six = 394.845;
    }
    if (window.innerWidth <= 1920) {
      matrix_six = 198.73;
    }
    if (window.innerWidth <= 1660) {
      matrix_six = 198.73;
    }
  }
  const scalingContainer = document.querySelector('.section-hero .scaling-container');
  if (scalingContainer) {
    const scale = window.innerWidth / 918;
    const skew = matrix_six;
    scalingContainer.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, ${skew})`;
  }
});

document.addEventListener('scroll', function () {
  const scalingContainer = document.querySelector('.scaling-container');
  if (scalingContainer) {
    const videoMedia = document.querySelector('.inline-video-media video');
    const videoFrameStatic = document.querySelector('.inline-video-frame-static');
    const overviewHeroTvShadowColor = document.querySelector('.overview-hero-hero-tv-shadow-color');
    const overviewHeroTvRemote = document.querySelector('.overview-hero-hero-tv-remote');
    // const sectionContent = document.querySelector('.section-content');

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

    if (scale < 1.5) {
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
    
    const sectionContent = document.querySelector('.section-content');
    if (sectionContent) {
      const maxScroll = window.innerHeight * 1.75 - window.innerHeight;
      const scrollFraction = window.scrollY / maxScroll;
      sectionContent.style.opacity = `${Math.max(1, 0 + scrollFraction / 4)}`;
    }
    // if (scale < 1.1) {
    //   sectionContent.style.opacity = '1';
    // } else {
    //   sectionContent.style.opacity = '1';
    // }
    const headlineHero = document.querySelector('.headline-hero');
    if (headlineHero) {
      if (window.scrollY >= 10) {
        headlineHero.style.opacity = '0';
      } else {
        headlineHero.style.opacity = '1';
      }
    }
  }
});