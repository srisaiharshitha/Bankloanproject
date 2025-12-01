
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
    function goBack() {
    window.location.href = "./ExploreLoans.html";
  }
    function showApplicationForm(){
      // navigate to the form page
      window.location.href = "business_application_form.html";
    }

    function toggleElig(){
      const form = document.getElementById('eligForm');
      const btn = document.getElementById('openEligBtn');
      if(form.style.display === 'none' || form.style.display === ''){
        form.style.display = 'block';
        btn.textContent = 'Close';
      } else {
        form.style.display = 'none';
        btn.textContent = 'Check Eligibility';
        resetElig();
      }
    }

    function resetElig(){
      document.getElementById('eligForm').reset();
      const res = document.getElementById('eligResult');
      res.style.display = 'none';
      res.className = 'elig-result';
      res.innerHTML = '';
    }

    function evaluateElig(e){
      e.preventDefault();
      const age = Number(document.getElementById('age').value || 0);
      const vintage = Number(document.getElementById('vintage').value || 0);
      const turnover = Number(document.getElementById('turnover').value || 0);
      const credit = Number(document.getElementById('credit').value || 0);

      // Criteria from page:
      // Age 21-65, Vintage >= 2 years, Turnover >= 40,00,000 INR, Credit score >=700 preferred
      const reasons = [];
      let score = 0;

      if(age >= 21 && age <= 65){ score += 1; } else { reasons.push('Applicant age must be between 21 and 65 years.'); }
      if(vintage >= 2){ score += 1; } else { reasons.push('Business vintage should be at least 2 years.'); }
      if(turnover >= 4000000){ score += 1; } else { reasons.push('Minimum annual turnover ₹40,00,000 is required.'); }
      if(isNaN(credit) || credit === 0){
        // credit optional but preferred
      } else if(credit >= 700){ score += 1; } else { reasons.push('Credit score below preferred threshold (700). Improving credit score helps approval.'); }

      const res = document.getElementById('eligResult');

      // Build result
      if(score >= 3 && reasons.length === 0){
        res.className = 'elig-result ok';
        res.innerHTML = '<strong>Eligible — Good chance of approval</strong><div class="small-note" style="margin-top:8px;">Based on the information provided, you meet the main eligibility requirements. Please proceed to the application and upload required documents.</div>';
      } else if(score >= 2){
        res.className = 'elig-result warn';
        let list = '';
        if(reasons.length) list = '<ul style="margin-top:8px; margin-bottom:0;">' + reasons.map(r => '<li>'+r+'</li>').join('') + '</ul>';
        res.innerHTML = '<strong>Conditionally Eligible</strong><div class="small-note" style="margin-top:8px;">You meet some criteria but there are items to improve or document. Address the points below to increase approval chances.' + list + '</div>';
      } else {
        res.className = 'elig-result bad';
        let list = '';
        if(reasons.length) list = '<ul style="margin-top:8px; margin-bottom:0;">' + reasons.map(r => '<li>'+r+'</li>').join('') + '</ul>';
        res.innerHTML = '<strong>Not Eligible</strong><div class="small-note" style="margin-top:8px;">Based on the details, you currently do not meet the minimum criteria.' + list + '<div style="margin-top:10px;">Tips: improve credit score, grow turnover or consider a co-applicant/guarantor.</div></div>';
      }

      res.style.display = 'block';
      // scroll result into view for better UX on small screens
      res.scrollIntoView({behavior:'smooth', block:'center'});
    }
  