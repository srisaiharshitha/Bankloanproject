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

    // ----- SIMPLE INTEREST -----
    let SI = (P * R * T) / 100;
    let SI_Amt = P + SI;

    // ----- COMPOUND INTEREST -----
    let CI_Amt = P * Math.pow((1 + (R / 100 / N)), (N * T));
    let CI = CI_Amt - P;

    // ----- FORMAT OUTPUT EXACTLY LIKE YOUR IMAGE -----
    document.getElementById("output").style.display = "block";
    document.getElementById("output").innerHTML = `
        <div style="padding: 12px; background:#e8f3ff; border-radius:8px;">
            <b>Simple Interest:</b> ₹${SI.toFixed(2)}<br>
            <b>Amount (SI):</b> ₹${SI_Amt.toFixed(2)}
        </div>

        <div style="padding: 12px; margin-top:10px; background:#e8f3ff; border-radius:8px;">
            <b>Compound Interest:</b> ₹${CI.toFixed(2)}<br>
            <b>Amount (CI):</b> ₹${CI_Amt.toFixed(2)}
        </div>
    `;
}



function goBack() {
    window.location.href = "./ExploreLoans.html";
  }
  function showApplicationForm(){
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    // ensure submission result hidden if was visible earlier
    document.getElementById('submissionResult').style.display = 'none';
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  function backToDetails(){
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('detailsSection').style.display = 'block';
  }

  
   
function handleSubmit(event) {
    event.preventDefault();   // Stop page reload

    let form = document.getElementById("homeLoanForm");
    let formData = new FormData(form);

    fetch("/submit_home_loan", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        // Hide the form
        document.getElementById("homeLoanForm").style.display = "none";

        // Show the result card
        document.getElementById("submissionResult").style.display = "block";

        // Fill name + phone in the confirmation UI
        document.getElementById("resName").textContent = data.name;
        document.getElementById("resPhone").textContent = data.phone;
    })
    .catch(err => {
        alert("Error submitting form.");
        console.error(err);
    });




    // Basic client-side checks for required file inputs (files exist)
    var idF = document.getElementById('idProof').files.length;
    var addrF = document.getElementById('addressProof').files.length;
    var incF = document.getElementById('incomeProof').files.length;
    var propF = document.getElementById('propertyDocs').files.length;

    if(!idF || !addrF || !incF || !propF){
      alert('Please upload all required documents before submitting.');
      return;
    }

    // Collect a couple of values to show in submission result (no style changes)
    var name = document.getElementById('fullName').value || '';
    var phone = document.getElementById('phone').value || '';

    // Hide form, show submission result (keeps same look - uses .card)
    document.getElementById('homeLoanForm').style.display = 'none';
    document.getElementById('submissionResult').style.display = 'block';
    document.getElementById('resName').textContent = name;
    document.getElementById('resPhone').textContent = phone;

    // NOTE: This is still a demo client-only behaviour. To actually upload files,
    // send FormData via fetch/XHR to your backend endpoint here.
  }

  function doneViewing(){
    // After viewing submission result, return to details (or you can keep on same page)
    document.getElementById('submissionResult').style.display = 'none';
    backToDetails();
  }

  // Eligibility UI
  function toggleEligibility(){
    var panel = document.getElementById('eligibilityPanel');
    if(!panel) return;
    if(panel.style.display === 'none' || panel.style.display === ''){
      panel.style.display = 'block';
      panel.scrollIntoView({behavior:'smooth', block:'center'});
    } else {
      panel.style.display = 'none';
    }
  }

  function checkEligibility(){
    var age = parseInt(document.getElementById('eligAge').value,10) || 0;
    var income = parseFloat(document.getElementById('eligIncome').value) || 0;
    var score = parseInt(document.getElementById('eligScore').value,10) || 0;
    var coapp = document.getElementById('eligCoapp').value === 'yes';

    var msg = '';
    var ok = true;

    // Simple rules (you can change logic later on backend)
    if(age < 21 || age > 65){
      msg += '<div class="result-no">Not eligible by age (21-65 required).</div>';
      ok = false;
    }
    // assume minimal income threshold: ₹150,000
    if(income < 150000){
      msg += '<div class="result-no">Income is low for typical home loan (recommended ₹1,50,000+).</div>';
      ok = false;
    }
    // credit score rule
    if(score < 650){
      msg += '<div class="result-no">Credit score is low (prefer 650+ for consideration).</div>';
      ok = false;
    }

    // small positive message if co-applicant helps
    if(ok){
      msg = '<div class="result-okay">You appear likely eligible. Please proceed to full application and upload documents for verification.</div>';
    } else if(coapp && score >= 600 && income >= 100000){
      // rough relaxation if co-applicant present
      msg += '<div class="result-okay">With a co-applicant and documents, you may be considered. Proceed to apply.</div>';
    } else {
      msg += '<div style="margin-top:6px; color:#444;">If you think any data is incorrect, update and re-check, or contact support.</div>';
    }

    document.getElementById('eligResult').innerHTML = msg;
  }
  function goBack() {
    window.location.href = "./ExploreLoans.html";
  }
  function showApplicationForm(){
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    // ensure submission result hidden if was visible earlier
    document.getElementById('submissionResult').style.display = 'none';
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  function backToDetails(){
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('detailsSection').style.display = 'block';
  }

  function handleSubmit(e){
    e.preventDefault();

    // Basic client-side checks for required file inputs (files exist)
    var idF = document.getElementById('idProof').files.length;
    var addrF = document.getElementById('addressProof').files.length;
    var incF = document.getElementById('incomeProof').files.length;
    var propF = document.getElementById('propertyDocs').files.length;

    if(!idF || !addrF || !incF || !propF){
      alert('Please upload all required documents before submitting.');
      return;
    }

    // Collect a couple of values to show in submission result (no style changes)
    var name = document.getElementById('fullName').value || '';
    var phone = document.getElementById('phone').value || '';

    // Hide form, show submission result (keeps same look - uses .card)
    document.getElementById('homeLoanForm').style.display = 'none';
    document.getElementById('submissionResult').style.display = 'block';
    document.getElementById('resName').textContent = name;
    document.getElementById('resPhone').textContent = phone;

    // NOTE: This is still a demo client-only behaviour. To actually upload files,
    // send FormData via fetch/XHR to your backend endpoint here.
  }

  function doneViewing(){
    // After viewing submission result, return to details (or you can keep on same page)
    document.getElementById('submissionResult').style.display = 'none';
    backToDetails();
  }

  // Eligibility UI
  function toggleEligibility(){
    var panel = document.getElementById('eligibilityPanel');
    if(!panel) return;
    if(panel.style.display === 'none' || panel.style.display === ''){
      panel.style.display = 'block';
      panel.scrollIntoView({behavior:'smooth', block:'center'});
    } else {
      panel.style.display = 'none';
    }
  }

  function checkEligibility(){
    var age = parseInt(document.getElementById('eligAge').value,10) || 0;
    var income = parseFloat(document.getElementById('eligIncome').value) || 0;
    var score = parseInt(document.getElementById('eligScore').value,10) || 0;
    var coapp = document.getElementById('eligCoapp').value === 'yes';

    var msg = '';
    var ok = true;

    // Simple rules (you can change logic later on backend)
    if(age < 21 || age > 65){
      msg += '<div class="result-no">Not eligible by age (21-65 required).</div>';
      ok = false;
    }
    // assume minimal income threshold: ₹150,000
    if(income < 150000){
      msg += '<div class="result-no">Income is low for typical home loan (recommended ₹1,50,000+).</div>';
      ok = false;
    }
    // credit score rule
    if(score < 650){
      msg += '<div class="result-no">Credit score is low (prefer 650+ for consideration).</div>';
      ok = false;
    }

    // small positive message if co-applicant helps
    if(ok){
      msg = '<div class="result-okay">You appear likely eligible. Please proceed to full application and upload documents for verification.</div>';
    } else if(coapp && score >= 600 && income >= 100000){
      // rough relaxation if co-applicant present
      msg += '<div class="result-okay">With a co-applicant and documents, you may be considered. Proceed to apply.</div>';
    } else {
      msg += '<div style="margin-top:6px; color:#444;">If you think any data is incorrect, update and re-check, or contact support.</div>';
    }

    document.getElementById('eligResult').innerHTML = msg;
  }
  document.addEventListener("DOMContentLoaded", () => {

    const nameRegex = /^[A-Za-z\s ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const positiveNumber = /^[1-9][0-9]*$/;

    function setError(input, errorSpan, message) {
        input.classList.add("input-error");
        input.classList.remove("input-success");
        errorSpan.textContent = message;
    }

    function setSuccess(input, errorSpan) {
        input.classList.remove("input-error");
        input.classList.add("input-success");
        errorSpan.textContent = "";
    }

    function liveValidate(input, errorSpan, regex, message) {
        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!regex.test(value)) {
                setError(input, errorSpan, message);
            } else {
                setSuccess(input, errorSpan);
            }
        });
    }

    // GET INPUTS
    const fullName = document.getElementById("fullName");
    const surname = document.getElementById("surname");
    const address = document.getElementById("address");
    const phone = document.getElementById("phone");
    const dob = document.getElementById("dob");
    const annualIncome = document.getElementById("annualIncome");
    const propertyValue = document.getElementById("propertyValue");
    const loanAmount = document.getElementById("loanAmount");

    // GET ERROR SPANS
    const fullNameError = document.getElementById("fullNameError");
    const surnameError = document.getElementById("surnameError");
    const addressError = document.getElementById("addressError");
    const phoneError = document.getElementById("phoneError");
    const dobError = document.getElementById("dobError");
    const incomeError = document.getElementById("incomeError");
    const propertyValueError = document.getElementById("propertyValueError");
    const loanAmountError = document.getElementById("loanAmountError");
    const fileError = document.getElementById("fileError");

    // REAL-TIME VALIDATION
    liveValidate(fullName, fullNameError, nameRegex, "Only alphabets are allowed");
    liveValidate(surname, surnameError, nameRegex, "Only alphabets are allowed");
    liveValidate(phone, phoneError, phoneRegex, "Phone number must be 10 digits");
    liveValidate(annualIncome, incomeError, positiveNumber, "Enter a valid number");
    liveValidate(propertyValue, propertyValueError, positiveNumber, "Enter a valid amount");
    liveValidate(loanAmount, loanAmountError, positiveNumber, "Enter a valid amount");

    address.addEventListener("input", () => {
        if (address.value.trim().length < 5) {
            setError(address, addressError, "Address must be at least 5 characters");
        } else {
            setSuccess(address, addressError);
        }
    });

    dob.addEventListener("change", () => {
        if (!dob.value) {
            setError(dob, dobError, "Select a valid Date of Birth");
        } else {
            setSuccess(dob, dobError);
        }
    });

    // FINAL SUBMIT VALIDATION
    document.getElementById("homeLoanForm").addEventListener("submit", function(event) {
        event.preventDefault();
        let valid = true;

        const validateList = [
            {input: fullName, span: fullNameError, regex: nameRegex, msg: "Enter valid name"},
            {input: surname, span: surnameError, regex: nameRegex, msg: "Enter valid surname"},
            {input: phone, span: phoneError, regex: phoneRegex, msg: "Enter valid 10-digit number"},
            {input: annualIncome, span: incomeError, regex: positiveNumber, msg: "Enter valid income"},
            {input: propertyValue, span: propertyValueError, regex: positiveNumber, msg: "Enter valid property value"},
            {input: loanAmount, span: loanAmountError, regex: positiveNumber, msg: "Enter valid amount"}
        ];

        validateList.forEach(f => {
            if (!f.regex.test(f.input.value.trim())) {
                setError(f.input, f.span, f.msg);
                valid = false;
            }
        });

        if (address.value.trim().length < 5) {
            setError(address, addressError, "Enter full address");
            valid = false;
        }

        if (!dob.value) {
            setError(dob, dobError, "Select date of birth");
            valid = false;
        }

        if (valid) {
            this.submit();
        }
    });

});