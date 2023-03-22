//Config
var slide_duration = 20000 //20000 default
const scrollSpeed = 50 //50 default
const progress = document.querySelector('.progress-indicator')
//Init slideshow
var slides = []
var currentSlide = 0
var nextSlide = 1
var reload = false

document.querySelectorAll('.slide').forEach((x) => {
  slides.push(x.getAttribute('id'))
})

// Comment out the line below to pause
initSlide()

function initSlide() {
  document.querySelector(`.slide#${ slides[currentSlide] }`).classList.add('active')
  let duration = slideDuration(0)

  //Set indicator time
  progress.style.setProperty(`--slide-duration`, `${slideDuration(0)}ms`)
  progress.classList.add('running')

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
          console.log('Site build ID', xhttp.responseText)
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
