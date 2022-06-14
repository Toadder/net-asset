// Ymap
const ymap = () => {
  let sectionMap = document.querySelector(".map");

  function ymapInit() {
    if (typeof ymaps === "undefined") return;

    ymaps.ready(function () {
      let map = new ymaps.Map("ymap", {
        center: [43.58272357456786, 39.76034150000001],
        zoom: 19,
        controls: ["zoomControl"],
        behaviors: ["drag"],
      });

      let placemark = new ymaps.Placemark(
        [43.58272357456786, 39.76034150000001],
        {
          // Hint
          hintContent: "Net Asset",
          balloonContent: "г. Сочи, ул. Водораздельная, д. 5/1",
        },
        {
          iconLayout: "default#image",
          iconImageHref: "img/marker.svg",
          iconImageSize: [80, 80],
          iconImageOffset: [-35, -35],
        }
      );
      map.geoObjects.add(placemark);
    });
  }

  if (sectionMap) {
    window.addEventListener("scroll", checkYmapInit);
    checkYmapInit();
  }

  function checkYmapInit() {
    let sectionMapTop = sectionMap.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let sectionMapOffsetTop = sectionMapTop + scrollTop;

    if (scrollTop + window.innerHeight > sectionMapOffsetTop) {
      ymapLoad();
      window.removeEventListener("scroll", checkYmapInit);
    }
  }

  function ymapLoad() {
    let script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    document.body.appendChild(script);
    script.onload = ymapInit;
  }
};

// Popup
const popup = () => {
  const popupLinks = document.querySelectorAll(".popup-link");
  const body = document.querySelector("body");
  const lockPadding = document.querySelectorAll(".lock-padding");
  let unlock = true;
  const timeout = 500;

  if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
        const popupName = popupLink.getAttribute("href").replace("#", "");
        const currentPopup = document.getElementById(popupName);
        popupOpen(currentPopup);
        e.preventDefault();
      });
    }
  }

  const popupCloseIcon = document.querySelectorAll(".close-popup");
  if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
        popupClose(el.closest(".popup"));
        e.preventDefault();
      });
    }
  }

  function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
      const popupActive = document.querySelector(".popup.open");
      if (popupActive) {
        popupClose(popupActive, false);
      } else {
        bodyLock();
      }
      currentPopup.classList.add("open");
      currentPopup.addEventListener("click", function (e) {
        if (!e.target.closest(".popup__content")) {
          popupClose(e.target.closest(".popup"));
        }
      });
    }
  }

  function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
      popupActive.classList.remove("open");
      if (doUnlock) {
        bodyUnlock();
      }
    }
  }

  function bodyLock() {
    const lockPaddingValue =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add("_lock");

    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }

  function bodyUnlock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = "0px";
        }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("_lock");
    }, timeout);

    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }

  document.addEventListener("keydown", function (e) {
    if (e.which === 27) {
      const popupActive = document.querySelector(".popup.open");
      popupClose(popupActive);
    }
  });
};

// Slider
const slider = () => {
  if (document.querySelector(".collaboration__slider")) {
    new Swiper(".collaboration__slider", {
      slidesPerView: 3.3,
      loop: false,
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 24,
      speed: 600,

      navigation: {
        nextEl: ".collaboration__next",
        prevEl: ".collaboration__prev",
      },

      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
          initialSlide: 0,
        },
        767: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        1600: {
          slidesPerView: 3.3,
          spaceBetween: 24,
          initialSlide: 1,
        },
      },
    });
  }
};

// Lazyloading + animation
const lazyload = () => {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.35,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    const startAnimtion = (trigger) => {
      const wrapper = trigger.closest(".animation-wrapper");
      const children = wrapper.querySelectorAll(".animation-child");

      let i = 0;
      const animationProcess = setInterval(() => {
        if (i === children.length - 1) {
          clearInterval(animationProcess);
        }

        children[i].classList.add("animation-child--animated");
        i++;
      }, 500);
    };

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        } else if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute("data-srcset");
        }

        img.onload = () => {
          const parent = img.closest(".lazy-wrapper");

          img.classList.add("lazy-image--loaded");
          parent.classList.add("lazy-wrapper--loaded");

          if (img.classList.contains("animation-trigger")) {
            startAnimtion(img);
          }
        };
        observer.unobserve(img);
      }
    });
  }, options);

  const lazyImages = document.querySelectorAll(
    "img[data-src], source[data-srcset]"
  );
  lazyImages.forEach((img) => observer.observe(img));
};

// Check Webp
const isWebp = () => {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector("body").classList.add("webp");
    } else {
      document.querySelector("body").classList.add("no-webp");
    }
  });
};

window.onload = () => {
  isWebp();
  slider();
  popup();
  ymap();
  lazyload();
};
