document.getElementById("regForm").addEventListener("submit", function(event) {

    let pass = document.getElementById("password").value.trim();
    let confirmPass = document.getElementById("confirmPassword").value.trim();

    clearErrors();

    // PASSWORD CHECK
    if (pass !== confirmPass) {
        showError('confirmPassword', 'Passwords do not match');
        event.preventDefault();
        return;
    }

    // TERMS CHECK
    if (!document.getElementById('terms').checked) {
        showError('terms', 'You must accept terms & conditions');
        event.preventDefault();
        return;
    }

    // FORM DEFAULT VALIDATION
    if (!this.checkValidity()) {
        event.preventDefault();
        return;
    }

    // ⭐ DO NOT BLOCK FORM
    // DO NOT SHOW ALERT HERE
    // LET FLASK HANDLE SUCCESS

});
document.getElementById("regForm").addEventListener("submit", function(event) {

    let pass = document.getElementById("password").value.trim();
    let confirmPass = document.getElementById("confirmPassword").value.trim();

    clearErrors();

    // PASSWORD CHECK
    if (pass !== confirmPass) {
        showError('confirmPassword', 'Passwords do not match');
        event.preventDefault();
        return;
    }

    // TERMS CHECK
    if (!document.getElementById('terms').checked) {
        showError('terms', 'You must accept terms & conditions');
        event.preventDefault();
        return;
    }

    // FORM DEFAULT VALIDATION
    if (!this.checkValidity()) {
        event.preventDefault();
        return;
    }

});
// Add event listeners for live validation
document.addEventListener("DOMContentLoaded", function () {

    const validators = {
        firstName: /^[A-Za-z ]+$/,
        lastName: /^[A-Za-z]+$/,
        username: /^[A-Za-z]+$/,
        phone: /^[0-9]{10}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        idNumber: /^.{4,}$/,
        income: /^[0-9]*$/,
        amount: /^[0-9]*$/,
        tenure: /^[0-9]*$/
    };

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Attach input listeners
    document.querySelectorAll("input, select, textarea").forEach(field => {
        field.addEventListener("input", () => validateField(field.id));
    });

    // Validation function
    function validateField(id) {
        const field = document.getElementById(id);
        const value = field.value.trim();

        removeError(id); // Clear old errors

        let isValid = true;
        let errorMsg = "";

        // ---------- NAME / USERNAME ----------
        if (validators[id]) {
            if (!validators[id].test(value) && value !== "") {
                isValid = false;
                errorMsg = "Invalid format.";
            }
        }

        // ---------- ADDRESS ----------
        if (id === "address" && value.length < 10 && value !== "") {
            isValid = false;
            errorMsg = "Address must be at least 10 characters.";
        }

        // ---------- PASSWORD ----------
      if (id === "password") {
    if (value === "") {
        isValid = false;
        errorMsg = "Password is required.";
    } else if (!passwordRegex.test(value)) {
        isValid = false;
        errorMsg = "Use upper, lower, number & symbol (min 8 chars).";
    } else {
        errorMsg = "";  // CLEAR ERROR WHEN VALID
    }
}


        // ---------- CONFIRM PASSWORD ----------
       if (id === "confirmPassword" && value !== password.value) {
            isValid = false;
            errorMsg = "Passwords do not match.";
        }

        // Apply red or green outline
       if (!isValid) {
            field.classList.add("input-error");
            field.classList.remove("input-success");
            showError(id, errorMsg);
        } else {
            field.classList.remove("input-error");

            if (value !== "") field.classList.add("input-success");
        }
    }

    // Show error text
    function showError(id, message) {
        let field = document.getElementById(id);
        let error = document.getElementById(id + "-error");

        if (!error) {
            error = document.createElement("div");
            error.id = id + "-error";
            error.style.color = "red";
            error.style.fontSize = "14px";
            error.style.marginTop = "4px";
            field.insertAdjacentElement("afterend", error);
        }

        error.innerText = message;
    }

    // Remove error
    function removeError(id) {
        let field = document.getElementById(id);
        field.classList.remove("input-error");

        let error = document.getElementById(id + "-error");
        if (error) error.remove();
    }
});
