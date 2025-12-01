
    function showApplicationForm(){ document.getElementById('detailsSection').style.display = 'none'; document.getElementById('formSection').style.display = 'block'; window.scrollTo({top:0, behavior:'smooth'}); }
    function backToDetails(){ document.getElementById('formSection').style.display = 'none'; document.getElementById('detailsSection').style.display = 'block'; document.getElementById('successMsg').style.display = 'none'; document.getElementById('vehicleForm').reset(); window.scrollTo({top:0, behavior:'smooth'}); }
    function handleSubmit(e){ e.preventDefault(); document.getElementById('successMsg').style.display = 'block'; document.getElementById('successMsg').scrollIntoView({behavior:'smooth', block:'center'}); setTimeout(()=> backToDetails(), 2000); }
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