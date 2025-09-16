window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

// 幻灯片切换功能
const slideData = {
    slides1: {
        current: 1,
        total: 13,
        prefix: 'slides1'
    },
    slides2: {
        current: 1,
        total: 14,
        prefix: 'slides2'
    }
};

function changeSlide(slideSet, direction) {
    console.log('changeSlide called:', slideSet, direction);
    const data = slideData[slideSet];
    if (!data) {
        console.log('No data found for:', slideSet);
        return;
    }
    
    // 计算新页码
    data.current += direction;
    
    // 循环处理
    if (data.current > data.total) {
        data.current = 1;
    } else if (data.current < 1) {
        data.current = data.total;
    }
    
    console.log('New slide number:', data.current);
    
    // 更新图片
    const slideId = slideSet === 'slides1' ? 'slide1' : 'slide2';
    const counterId = slideSet + '-counter';
    const img = document.getElementById(slideId);
    const counter = document.getElementById(counterId);
    
    console.log('Looking for elements:', slideId, counterId);
    console.log('Image element:', img);
    console.log('Counter element:', counter);
    
    if (img && counter) {
        const slideNumber = data.current.toString().padStart(2, '0');
        const newSrc = `static/images/${data.prefix}/${data.prefix}_${slideNumber}.png`;
        console.log('New image source:', newSrc);
        
        img.src = newSrc;
        img.alt = `Slide ${data.current}`;
        counter.textContent = data.current;
        
        // 添加淡入效果
        img.style.opacity = '0.7';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 150);
    } else {
        console.log('Image or counter element not found');
    }
}

// 确保函数在全局作用域中可用
window.changeSlide = changeSlide;

// 键盘导航支持
document.addEventListener('keydown', function(event) {
    // 检查是否在幻灯片区域
    const activeSlide = document.querySelector('.slideshow-container:hover');
    if (!activeSlide) return;
    
    const slideId = activeSlide.querySelector('img').id;
    const slideSet = slideId === 'slide1' ? 'slides1' : 'slides2';
    
    if (event.key === 'ArrowLeft') {
        changeSlide(slideSet, -1);
        event.preventDefault();
    } else if (event.key === 'ArrowRight') {
        changeSlide(slideSet, 1);
        event.preventDefault();
    }
});

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    
    // 确保幻灯片功能在页面加载后可用
    console.log('Document ready, slideData:', slideData);
    console.log('changeSlide function:', typeof changeSlide);

})
