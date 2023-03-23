//Config
var slide_duration = 20000 //20000 default
const scrollSpeed = 50 //50 default
const progress = document.querySelector('.progress-indicator')
//Init slideshow
var slides = []
var currentSlide = 0
var nextSlide = 1
var reload = false
var removeDate = false

// Comment out the line below to pause
// initSlide()

function initSlide() {
  console.log(`Initializing. Current slide: ${currentSlide} | Next slide: ${nextSlide}`)

  document.querySelectorAll('.slide').forEach((x) => {
    slides.push(x.getAttribute('id'))
  })

  document.querySelector(`.slide#${ slides[currentSlide] }`).classList.add('active')
  let duration = slideDuration([currentSlide])

  //Set indicator time
  progress.style.setProperty(`--slide-duration`, `${slideDuration([currentSlide])}ms`)
  progress.classList.add('running')

  console.log('Queueing next slide transition in', duration)
  setTimeout(changeSlide, duration)
}

function slideDuration(index) {
  if (currentSlide > -1) {
    return document.querySelector(`.slide#${ slides[index] }`).getAttribute('data-duration') || slide_duration
  }
}
function slideDate(index) {
  if (currentSlide > -1) {
    return document.querySelector(`.slide#${ slides[index] }`).getAttribute('data-date') || null
  }
}
function checkDate() {
  let eventDate = slideDate(nextSlide)
  if (eventDate) {
    let today = new Date().setHours(0,0,0,0) / 1000
    if (eventDate < today) {
      removeDate = true
    }
  }
}

//Run the slideshow
function changeSlide() {
  document.querySelector(`.slide#${ slides[currentSlide] }`).classList.add('is-exiting')
  document.querySelector(`.slide#${ slides[nextSlide] }`).classList.add('active')

  if (reload) {
    window.location.reload()
  }
  
  //Set indicator time
  progress.classList.remove('running')
  progress.offsetHeight
  progress.style.setProperty(`--slide-duration`, `${slideDuration(nextSlide)}ms`)
  progress.classList.add('running')

  //Queue nextslide
  let duration = slideDuration(nextSlide)
  console.log('Queueing next slide transition in', duration)

  checkDate()

  if (removeDate) {
    resetSlides()
  } else {
    setTimeout(changeSlide, duration)
    //Cleanup
    setTimeout(() => {
      let current = document.querySelector(`.slide#${ slides[currentSlide] }`)
      current.classList.remove('active')
      current.classList.remove('is-exiting')
      currentSlide = nextSlide
      if ((nextSlide + 1) > (slides.length - 1)) {
        nextSlide = 0
  
        //Check Build ID
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (xhttp.responseText != buildEnv) {
              reload = true
            }
          }
        }
        xhttp.open("GET", versionURL, true)
        xhttp.send()
      } else {
        nextSlide ++
      }
      console.log('set next slide to ', nextSlide)
    }, 2000)
  }
}

if (document.querySelector('.donations')) {
  document.querySelectorAll('.donations').forEach((x) => {
    const donorList = x.querySelector('.donors')
    if (donorList.clientHeight > window.innerHeight) {
      const slideDuration_s = donorList.clientHeight / scrollSpeed
      const slideDuration_ms = slideDuration_s * 1000
      console.log(`Animation duration: ${slideDuration_s}s`)
      donorList.style.setProperty('--donor-animation-duration', `${slideDuration_s}s`)
      x.setAttribute('data-duration', slideDuration_ms)
    } else {
      donorList.classList.add('center')
    }
  })
}

function resetSlides() {
  console.log('Removing dates')
  document.querySelector(`.slide#${ slides[nextSlide] }`).remove()
  
  let resetSlideIndex = currentSlide
  
  removeDate = false
  slides = []
  
  currentSlide ++
  nextSlide ++

  initSlide()

  setTimeout(function() {
    document.querySelector(`.slide#${ slides[resetSlideIndex] }`).classList.remove('active')
    document.querySelector(`.slide#${ slides[resetSlideIndex] }`).classList.remove('is-exiting')
  }, 2000)
}
