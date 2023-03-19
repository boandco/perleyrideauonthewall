//Config
var slide_duration = 20000;
//Init slideshow
var slides = []
var currentSlide = 0
var nextSlide = 1;
document.querySelectorAll('.slide').forEach((x) => {
  slides.push(x.getAttribute('id'))
})

initSlide()

function initSlide() {
  document.querySelector(`.slide#${ slides[currentSlide] }`).classList.add('active')
  let duration = slideDuration(0)
  console.log('Queueing next slide transition in', duration)
  setTimeout(changeSlide, duration)
}

function slideDuration(index) {
  if (currentSlide > -1) {
    return document.querySelector(`.slide#${ slides[index] }`).getAttribute('data-duration') || slide_duration
  }
}

//Run the slideshow
function changeSlide() {
  document.querySelector(`.slide#${ slides[currentSlide] }`).classList.add('is-exiting')
  document.querySelector(`.slide#${ slides[nextSlide] }`).classList.add('active')

  //Queue nextslide
  let duration = slideDuration(nextSlide)
  console.log('Queueing next slide transition in', duration)
  setTimeout(changeSlide, duration)

  //Cleanup
  setTimeout(() => {
    let current = document.querySelector(`.slide#${ slides[currentSlide] }`)
    current.classList.remove('active')
    current.classList.remove('is-exiting')
    currentSlide = nextSlide;
    if ((nextSlide + 1) > (slides.length - 1)) {
      nextSlide = 0
    } else {
      nextSlide ++
    }
    console.log('set next slide to ', nextSlide)
  }, 2000)
}

if (document.querySelector('.donations')) {
  const scrollSpeed = 50
  document.querySelectorAll('.donations').forEach((x) => {
    const donorList = x.querySelector('.donors')
    if (donorList.clientHeight > window.innerHeight) {
      const slideDuration_s = donorList.clientHeight / scrollSpeed;
      const slideDuration_ms = slideDuration_s * 1000;
      console.log(`Animation duration: ${slideDuration_s}s`)
      donorList.style.setProperty('--donor-animation-duration', `${slideDuration_s}s`);
      x.setAttribute('data-duration', slideDuration_ms)
    } else {
      donorList.classList.add('center')
    }
  })
}
