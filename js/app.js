// Animations
function _fadeIn(el) {
  var opacity = 0.1;

  el.style.opacity = opacity;
  el.style.display = "block";

  var timer = setInterval(function () {
    if (opacity >= 1) {
      clearInterval(timer);
    }

    el.style.opacity = opacity;

    opacity += opacity * 0.1;
  }, 15);
}

function _fadeOut(el) {
  var opacity = 1;

  var timer = setInterval(function () {
    if (opacity <= 0.1) {
      clearInterval(timer);
      el.style.display = "none";
    }

    el.style.opacity = opacity;

    opacity -= opacity * 0.1;
  }, 15);
}

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

// Check email-radio click
const checkDownloadRadios = () => {
  const popup = document.querySelector(".popup-download");
  if (popup) {
    const popupRadios = document.querySelectorAll(".radio-form input");
    const mailWrapper = popup.querySelector(".popup-download__item_mail");
    const mailInput = mailWrapper.querySelector("input");

    for (let index = 0; index < popupRadios.length; index++) {
      const radio = popupRadios[index];

      radio.addEventListener("change", () => {
        if (radio.hasAttribute("data-mail")) {
          mailWrapper.style.display = "block";
        } else {
          mailInput.value = "";
          mailWrapper.style.display = "none";
        }
      });
    }
  }
};

// Phone mask
const phoneMask = () => {
  let phoneInputs = document.querySelectorAll("input[data-tel-input]");

  for (let phoneInput of phoneInputs) {
    phoneInput.addEventListener("keydown", onPhoneKeyDown);
    phoneInput.addEventListener("input", onPhoneInput, false);
    phoneInput.addEventListener("paste", onPhonePaste, false);
  }

  function getInputNumbersValue(input) {
    // Return stripped input value — just numbers
    return input.value.replace(/\D/g, "");
  }

  function onPhonePaste(e) {
    let input = e.target,
      inputNumbersValue = getInputNumbersValue(input);
    let pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      let pastedText = pasted.getData("Text");
      if (/\D/g.test(pastedText)) {
        // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
        // formatting will be in onPhoneInput handler
        input.value = inputNumbersValue;
        return;
      }
    }
  }

  function onPhoneInput(e) {
    let input = e.target,
      inputNumbersValue = getInputNumbersValue(input),
      selectionStart = input.selectionStart,
      formattedInputValue = "";

    if (!inputNumbersValue) {
      return (input.value = "");
    }

    if (input.value.length != selectionStart) {
      // Editing in the middle of input, not last symbol
      if (e.data && /\D/g.test(e.data)) {
        // Attempt to input non-numeric symbol
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9")
        inputNumbersValue = "7" + inputNumbersValue;
      let firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
  }

  function onPhoneKeyDown(e) {
    // Clear input after remove last symbol
    let inputValue = e.target.value.replace(/\D/g, "");
    if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
    }
  }
};

// Open info in slider
const openInfo = () => {
  const triggers = document.querySelectorAll(
    ".slide-collaboration__text_trigger"
  );

  if (triggers.length > 0) {
    for (let index = 0; index < triggers.length; index++) {
      const trigger = triggers[index];

      trigger.addEventListener("click", () => {
        const parent = trigger.closest(".collaboration__slide");
        const spoiler = parent.querySelector(
          ".slide-collaboration__list_spoiler"
        );

        if (trigger.classList.contains("clicked")) {
          _fadeOut(spoiler);
          trigger.classList.remove("clicked");
        } else {
          _fadeIn(spoiler);
          trigger.classList.add("clicked");
        }
      });
    }
  }
};

window.onload = () => {
  isWebp();
  checkDownloadRadios();
  slider();
  openInfo();
  ymap();
  lazyload();
  phoneMask();

  // Popup
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
  // Popup

  // Form Check
  const formAddError = (el) => {
    el.classList.add("_error");
    el.parentElement.classList.add("_error");
  };

  const formRemoveError = (el) => {
    el.classList.remove("_error");
    el.parentElement.classList.remove("_error");
  };

  // Валидация Email
  const emailTest = (input) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input.value);
  };

  // Form Validation & Send
  const forms = document.querySelectorAll("form");
  for (var i = 0; i < forms.length; i++) {
    form = forms[i];

    form.addEventListener("submit", formSend);
  }
  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(this);

    if (error === 0) {
      const popupThanks = document.querySelector('.popup-thanks');
      const popupLink = popupThanks.querySelector('.popup-thanks__link');
      if(this.closest('.popup-download')) {
        popupLink.style.display = 'inline-block';
      } else {
        popupLink.style.display = "none";
      }
      popupOpen(popupThanks);
    }
  }
  function formValidate(form) {
    let error = 0;
    let formReq = form.querySelectorAll("._req");

    for (var i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      const parent = input.parentElement;
      formRemoveError(input);

      if (window.getComputedStyle(parent).display !== "none") {
        if (input.classList.contains("_email")) {
          if (!emailTest(input)) {
            formAddError(input);
            error++;
          }
        } else if (input.value == "") {
          formAddError(input);
          error++;
        } else if (input.type === "checkbox" && !input.checked) {
          formAddError(input);
          error++;
        }
      }
    }

    return error;
  }
  // Form Check
};
