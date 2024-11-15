document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a page with slides
  if (document.getElementsByClassName("mySlides").length > 0) {
    let slideIndex = 1;
    showSlides(slideIndex);

    // Make these functions globally available for the slideshow
    window.plusSlides = function(n) {
      showSlides(slideIndex += n);
    }

    window.currentSlide = function(n) {
      showSlides(slideIndex = n);
    }

    function showSlides(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides");
      let dots = document.getElementsByClassName("dot");
      if (n > slides.length) { slideIndex = 1; }
      if (n < 1) { slideIndex = slides.length; }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
    }

    // Automatically go to the next slide every 8 seconds
    setInterval(function() {
      slideIndex++;
      showSlides(slideIndex);
    }, 8000); // 8 seconds
  }

  // Check if we're on the contact page with maps
  const locationDropdown = document.getElementById('locationDropdown');
  if (locationDropdown) {
    const maps = {
      braamfontein: document.getElementById('map-braamfontein'),
      riverlea: document.getElementById('map-riverlea'),
      glenhazel: document.getElementById('map-glenhazel')
    };

    function showMap(location) {
      for (let key in maps) {
        if (maps[key]) {  // Check if map element exists
          maps[key].style.display = key === location ? 'block' : 'none';
        }
      }
    }

    locationDropdown.addEventListener('change', function () {
      const selectedLocation = this.value;
      if (selectedLocation !== "0") {
        showMap(selectedLocation);
      } else {
        for (let key in maps) {
          if (maps[key]) maps[key].style.display = 'none';
        }
      }
    });

    // Set initial map view
    showMap('braamfontein');
  }

  // Check if we're on the calculate fees page
  const calculateButton = document.getElementById("calculateButton");
  const feesForm = document.getElementById("feesForm");
  const totalDisplay = document.querySelector(".value");
  
  if (calculateButton && feesForm && totalDisplay) {
    // Store selected courses for invoice generation
    let selectedCourses = [];
  
    // Define VAT rate
    const VAT_RATE = 0.15;
  
    function calculateDiscount(totalBeforeDiscount, numberOfCourses) {
      if (numberOfCourses > 3) {
        return totalBeforeDiscount * 0.15; // 15% discount for more than 3 courses
      } else if (numberOfCourses === 3) {
        return totalBeforeDiscount * 0.10; // 10% discount for 3 courses
      } else if (numberOfCourses === 2) {
        return totalBeforeDiscount * 0.05; // 5% discount for 2 courses
      }
      return 0; // No discount for 1 course
    }
  
    function calculateTotal() {
      let subtotal = 0;
      const selectedCourses = [];
      const checkedCourses = document.querySelectorAll('input[type="checkbox"]:checked');
    
      checkedCourses.forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        subtotal += price;
        selectedCourses.push({ name: checkbox.value, price });
      });
    
      const discount = calculateDiscount(subtotal, checkedCourses.length);
      const totalAfterDiscount = subtotal - discount;
      const vat = totalAfterDiscount * VAT_RATE;
      const finalTotal = totalAfterDiscount + vat;
    
      // Display the total in the added div
      totalDisplay.innerHTML = `
        <div class="fee-breakdown">
          <p>Subtotal: R${subtotal.toFixed(2)}</p>
          <p>Discount: -R${discount.toFixed(2)}</p>
          <p>VAT (15%): R${vat.toFixed(2)}</p>
          <p><strong>Final Total: R${finalTotal.toFixed(2)}</strong></p>
        </div>
      `;
    }
  
    function validateForm(e) {
      const email = document.getElementById("email").value;
      const password = document.getElementById("psw").value;
      const passwordRepeat = document.getElementById("psw-repeat").value;
  
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        e.preventDefault();
        return false;
      }
  
      if (password !== passwordRepeat) {
        alert("Passwords do not match");
        e.preventDefault();
        return false;
      }
  
      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        e.preventDefault();
        return false;
      }
  
      return true;
    }
  
    // Event listeners for calculate fees page
    calculateButton.addEventListener("click", calculateTotal);
  
    feesForm.addEventListener("submit", function(e) {
      if (validateForm(e)) {
        const formData = {
          firstName: document.getElementById("first_name").value,
          surname: document.getElementById("surname").value,
          street: document.getElementById("street").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
          courses: selectedCourses
        };
  
        console.log("Form submitted with data:", formData);
        alert("Thank you for your registration! A consultant will contact you shortly.");
      }
    });
  }
  
});