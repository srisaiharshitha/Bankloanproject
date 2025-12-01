// PROGRESS BAR FUNCTION
function setProgress(step) {
  const percent = (step / 4) * 100;
  document.getElementById("loanProgressBar").style.width = percent + "%";
}
// EMI CALCULATOR FUNCTION
function calculate() {
  let P = parseFloat(document.getElementById("p").value);
  let R = parseFloat(document.getElementById("r").value);
  let T = parseFloat(document.getElementById("t").value);
  let N = parseFloat(document.getElementById("n").value);

  if (!P || !R || !T || !N) {
      document.getElementById("output").style.display = "block";
      document.getElementById("output").innerHTML = "⚠ Please fill all fields";
      return;
  }

  let SI = (P * R * T) / 100;
  let SI_Amt = P + SI;

  let CI_Amt = P * Math.pow((1 + (R / 100 / N)), (N * T));
  let CI = CI_Amt - P;

  document.getElementById("output").style.display = "block";
  document.getElementById("output").innerHTML =
    `<b>Simple Interest:</b> ₹${SI.toFixed(2)}<br>
     <b>Amount (SI):</b> ₹${SI_Amt.toFixed(2)}<br><br>
     <b>Compound Interest:</b> ₹${CI.toFixed(2)}<br>
     <b>Amount (CI):</b> ₹${CI_Amt.toFixed(2)}<br>`;
}

// OTP LOGIC
let generatedOTP = null;

function sendOTP(phone) {
  generatedOTP = Math.floor(100000 + Math.random() * 900000);
  alert("OTP sent to " + phone + ": " + generatedOTP);
  document.getElementById("otpBox").style.display = "block";
}

function verifyOTP() {
  const entered = document.getElementById("otpInput").value;
  if (entered == generatedOTP) {
    alert("OTP Verified!");
    document.getElementById("otpBox").style.display = "none";
    finishSubmit();
  } else {
    alert("Incorrect OTP");
  }
}


// PAGE SWITCH FUNCTIONS
function openForm() {
  document.getElementById("detailsPage").style.display = "none";
  document.getElementById("formPage").style.display = "block";
  setProgress(1);
}

function goBack() {
  document.getElementById("detailsPage").style.display = "block";
  document.getElementById("formPage").style.display = "none";
  setProgress(0);
}

function isFutureDate(d) {
  let x = new Date(d), t = new Date();
  x.setHours(0,0,0,0);
  t.setHours(0,0,0,0);
  return x > t;
}


// MAIN FORM SUBMIT
function submitForm(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const weight = Number(document.getElementById("goldWeight").value);
  const purity = document.getElementById("goldPurity").value;
  const receipt = document.getElementById("goldReceipt");

  if (!fullName) return alert("Enter full name.");
  if (isFutureDate(dob)) return alert("Invalid DOB.");
  if (phone.length !== 10) return alert("Invalid phone.");
  if (weight <= 0) return alert("Invalid gold weight.");
  if (!purity) return alert("Select purity.");
  if (!receipt.files.length) return alert("Upload receipt.");

  const file = receipt.files[0];
  const allowed = ["image/jpeg","image/jpg","image/png","application/pdf"];
  if (!allowed.includes(file.type)) return alert("Invalid file type.");
  if (file.size > 5*1024*1024) return alert("Max size 5MB.");

  setProgress(2);

  sendOTP(phone);  // send otp before final submit
}


// FINAL SHOW SUCCESS CARD
function finishSubmit() {
  setProgress(4);

  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();

  document.getElementById("loanForm").style.display = "none";
  document.getElementById("afterSubmit").style.display = "block";

  document.getElementById("resName").textContent = name;
  document.getElementById("resPhone").textContent = phone;
}

function doneViewing() {
  goBack();
}

document.querySelector('.right-box img').addEventListener('error', function() {
  this.style.display = 'none';
});

