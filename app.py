from flask import Flask, request, session, redirect, render_template, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from db import get_connection
import os

app = Flask(__name__)
app.secret_key = "mysecretkey"
def render_with_user(template, **kwargs):
    return render_template(
        template,
        
        **kwargs
    )


@app.route("/")
def index():
    return redirect("/home")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
def save_file(file):
    """Save a single uploaded file and return its filename"""
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filename
    return None
# ================= GOLD LOAN FORM PAGE ==================
@app.route("/goldloanform")
def goldloanform():
    return render_with_user("GoldLoanForm.html")


# ------------------ SUBMIT GOLD LOAN FORM ------------------
@app.route("/submit_gold_loan", methods=["GET", "POST"])
def submit_gold_loan():
    if request.method == "GET":
        return render_with_user("GoldLoanForm.html")
    # User must be logged in
    if "user_id" not in session:
        return redirect("/login")

    

    try:
        # ------------ FORM FIELDS ------------
        fullName = request.form.get("fullName")
        surname = request.form.get("surname")
        email = request.form.get("email")
        phone = request.form.get("phone")
        address = request.form.get("address")

        goldWeight = request.form.get("goldWeight")
        purity = request.form.get("purity")
        loanAmount = request.form.get("loanAmount")
        purpose = request.form.get("purpose")

        # ------------ FILE UPLOADS ------------
        idProof = save_file(request.files.get("idProof"))
        addressProof = save_file(request.files.get("addressProof"))
        goldImages = request.files.getlist("goldImages")
        goldImagesPath = ",".join([save_file(f) for f in goldImages])

        # ------------ SAVE GOLD LOAN APPLICATION ------------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO gold_loan_applications
            (fullName, surname, email, phone, address,
             goldWeight, purity, loanAmount, purpose,
             idProof, addressProof, goldImages, user_id)
            VALUES (%s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s)
        """

        values = (
            fullName, surname, email, phone, address,
            goldWeight, purity, loanAmount, purpose,
            idProof, addressProof, goldImagesPath,
            session["user_id"]
        )

        cursor.execute(query, values)
        conn.commit()

        # ------------ UPDATE USER APPLIED LOAN TYPE ------------
        cursor.execute("UPDATE users SET applied_loan=%s WHERE id=%s",
                       ("gold", session["user_id"]))
        conn.commit()

        # ------------ UPDATE SESSION ------------
        session["applied_loan"] = "gold"

        # ------------ SUCCESS RESPONSE ------------
        return jsonify({
            "status": "success",
            "name": fullName,
            "phone": phone
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })


# ================= SUBMIT PERSONAL LOAN FORM ==================
@app.route("/submit_personal_loan", methods=["GET","POST"])
def submit_personal_loan():
    if request.method == "GET":
        return render_with_user("PersonalLoanForm.html")
    try:
        fullName = request.form.get("fullName")
        surname = request.form.get("surname")
        dob = request.form.get("dob")
        address = request.form.get("address")
        loanAmount = request.form.get("loanAmount")
        loanPurpose = request.form.get("loanPurpose")
        employmentStatus = request.form.get("employmentStatus")
        monthlyIncome = request.form.get("monthlyIncome")

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO personal_loan_applications
            (fullName, surname, dob, address, loanAmount, loanPurpose, employmentStatus, monthlyIncome)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (fullName, surname, dob, address, loanAmount, loanPurpose, employmentStatus, monthlyIncome)

        cursor.execute(query, values)
        conn.commit()

        return jsonify({"status": "success", "name": fullName})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
# ============ SUBMIT BUSINESS LOAN FORM ============



@app.route("/submit_business_loan", methods=["GET","POST"])
def submit_business_loan():
    if request.method == "GET":
        return render_with_user("BusinessLoanForm.html")
    try:
        loanAmount = request.form.get("loanAmount")
        loanPurpose = request.form.get("loanPurpose")
        businessName = request.form.get("businessName")
        businessType = request.form.get("businessType")
        regDate = request.form.get("regDate")
        industry = request.form.get("industry")
        annualTurnover = request.form.get("annualTurnover")

        # --------- FILE UPLOAD (Multiple) ---------
        files = request.files.getlist("bankStatements")
        filenames = []

        for f in files:
            if f.filename:
                filename = secure_filename(f.filename)
                filepath = os.path.join("uploads", filename)
                f.save(filepath)
                filenames.append(filename)

        file_string = ",".join(filenames)

        # --------- DATABASE INSERT ---------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO business_loan_applications
            (loanAmount, loanPurpose, businessName, businessType, regDate, industry, annualTurnover, bankStatements)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (loanAmount, loanPurpose, businessName, businessType, regDate,
                               industry, annualTurnover, file_string))

        conn.commit()

        return jsonify({
            "status": "success",
            "businessName": businessName
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    
# ============ SUBMIT VEHICLE LOAN FORM ============
@app.route("/submit_vehicle_loan", methods=["GET","POST"])
def submit_vehicle_loan():
    if request.method == "GET":
        return render_with_user("VehicleLoanForm.html")
    try:
        fullName = request.form.get("fullName")
        surname = request.form.get("surname")
        email = request.form.get("email")
        phone = request.form.get("phone")
        vehicleType = request.form.get("vehicleType")
        vehicleModel = request.form.get("vehicleModel")
        loanAmount = request.form.get("loanAmount")
        address = request.form.get("address")

        file = request.files.get("licenseFile")

        filename = None
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join("uploads", filename))

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO vehicle_loan_applications
            (fullName, surname, email, phone, vehicleType, vehicleModel, loanAmount, address, licenseFile)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        cursor.execute(query, (fullName, surname, email, phone, vehicleType, vehicleModel, loanAmount, address, filename))
        conn.commit()

        return jsonify({"status": "success", "name": fullName})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
 
    # ================= SUBMIT EDUCATION LOAN FORM ==================
@app.route("/submit_education_loan", methods=["GET", "POST"])
def submit_education_loan():
    if request.method == "GET":
        return render_with_user("EducationLoanForm.html")

    try:
        fullName = request.form.get("fullName")
        email = request.form.get("email")
        phone = request.form.get("phone")
        dob = request.form.get("dob")
        courseName = request.form.get("courseName")
        universityName = request.form.get("universityName")
        courseDuration = request.form.get("courseDuration")
        coName = request.form.get("coName")
        relationship = request.form.get("relationship")

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO education_loan_applications
            (fullName, email, phone, dob, courseName, universityName,
             courseDuration, coName, relationship)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            fullName, email, phone, dob,
            courseName, universityName, courseDuration,
            coName, relationship
        ))

        conn.commit()

        return jsonify({
            "status": "success",
            "name": fullName
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


# ------------------ SUBMIT HOME LOAN FORM ------------------ 
@app.route("/submit_home_loan", methods=["GET", "POST"])
def submit_home_loan():

    if request.method == "GET":
        return render_with_user("HomeLoanForm.html")
     # User must be logged in
    if "user_id" not in session:
        return redirect("/login")

    try:
        # ------------ FORM FIELDS ------------
        fullName = request.form.get("fullName")
        surname = request.form.get("surname")
        address = request.form.get("address")
        dob = request.form.get("dob")
        phone = request.form.get("phone")

        annualIncome = request.form.get("annualIncome")
        employmentType = request.form.get("employmentType")

        propertyLocation = request.form.get("propertyLocation")
        propertyValue = request.form.get("propertyValue")

        loanPurpose = request.form.get("loanPurpose")
        loanAmount = request.form.get("loanAmount")
        tenure = request.form.get("tenure")

        # ------------ FILE UPLOADS ------------
        idProof = save_file(request.files.get("idProof"))
        addressProof = save_file(request.files.get("addressProof"))
        incomeProof = save_file(request.files.get("incomeProof"))

        property_files = request.files.getlist("propertyDocs")
        propertyDocs = ",".join([save_file(f) for f in property_files])

        # ------------ SAVE LOAN APPLICATION IN DATABASE ------------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO home_loan_applications
            (fullName, surname, address, dob, phone,
             annualIncome, employmentType,
             propertyLocation, propertyValue,
             loanPurpose, loanAmount, tenure,
             idProof, addressProof, incomeProof, propertyDocs,
             user_id)
            VALUES (%s, %s, %s, %s, %s,
                    %s, %s,
                    %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s,
                    %s)
        """

        values = (
            fullName, surname, address, dob, phone,
            annualIncome, employmentType,
            propertyLocation, propertyValue,
            loanPurpose, loanAmount, tenure,
            idProof, addressProof, incomeProof, propertyDocs,
            session["user_id"]
        )

        cursor.execute(query, values)
        conn.commit()

        # ---------- UPDATE USER APPLIED LOAN ----------
        cursor.execute("UPDATE users SET applied_loan=%s WHERE id=%s",
                       ("home", session["user_id"]))
        conn.commit()

        # ----------- UPDATE SESSION ----------
        session["applied_loan"] = "home"

        # ------------ RETURN SUCCESS (JSON) ------------
        return jsonify({
            "status": "success",
            "name": fullName,
            "phone": phone
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

# ------------------ HOME ------------------
@app.route("/home")
def home():
    return render_with_user("Homepage.html")
# ------------------ ABOUT US PAGE ------------------
@app.route("/aboutus")
def aboutus():
    return render_with_user("About us.html")

# ------------------ CONTACT US PAGE ------------------
@app.route("/contact")
def contact():
    return render_with_user("Contact.html")


# ------------------ EXPLORE LOANS PAGE ------------------
@app.route("/exploreloans")
def exploreloans():
    return render_with_user("ExploreLoans.html")

# ------------------ REGISTRATION ------------------
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_with_user("RegistrationPage.html")

    try:
        # ----------- FORM DATA -----------
        first_name = request.form.get("firstName")
        last_name = request.form.get("lastName")
        email = request.form.get("email")
        phone = request.form.get("phone")
        dob = request.form.get("dob")
        gender = request.form.get("gender")
        address = request.form.get("address")

        id_type = request.form.get("idType")
        id_number = request.form.get("idNumber")

        employment = request.form.get("employment")
        income = request.form.get("income")
        loan_type = request.form.get("loanType")
        amount = request.form.get("amount")
        tenure = request.form.get("tenure")
        branch = request.form.get("branch")

        username = request.form.get("username")
        password = request.form.get("password")
        hashed_password = generate_password_hash(password)

        security_question = request.form.get("securityQ")

        # ----------- FILE UPLOADS -----------
        # Save KYC Document
        profile_doc_file = request.files.get("profileDoc")
        profileDoc = None
        if profile_doc_file and profile_doc_file.filename != "":
            profileDoc = secure_filename(profile_doc_file.filename)
            profile_doc_file.save(os.path.join(UPLOAD_FOLDER, profileDoc))

       

        # ----------- DATABASE INSERT -----------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO users (
                firstName, lastName, email, phone, dob, gender, address,
                idType, idNumber,
                employment, income,
                loanType, amount, tenure, branch,
                username, password, securityQ,
                profileDoc
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s,
                    %s, %s,
                    %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s,
                    %s)
        """

        values = (
            first_name, last_name, email, phone, dob, gender, address,
            id_type, id_number,
            employment, income,
            loan_type, amount, tenure, branch,
            username, hashed_password, security_question,
            profileDoc
        )

        cursor.execute(query, values)
        conn.commit()

        return "<script>alert('Registration Successful!'); window.location='/login';</script>"

    except Exception as e:
        return f"<h2>Error: {e}</h2>"

    
#----------
@app.route("/homeloan")
def homeloan():
    return render_with_user("HomeLoan.html")
@app.route("/goldloan")
def goldloan():
    return render_with_user("GoldLoan.html")
@app.route("/personalloan")
def personalloan():
    return render_with_user("PersonalLoan.html")
@app.route("/educationloan")
def educationloan():
    return render_with_user("EducationLoan.html")
@app.route("/vehicleloan")
def vehicleloan():
    return render_with_user("VehicleLoan.html")
@app.route("/businessloan")
def businessloan():
    return render_with_user("BusinessLoan.html")
@app.route("/businessform")
def businessform():
    return render_with_user("business_application_form.html")
# ------------------ LOGIN PAGE ROUTE ------------------
@app.route("/loginpage")
def loginpage():
    return render_with_user("Login.html")

# ------------------ LOGIN LOGIC ------------------
@app.route("/login", methods=["GET","POST"])
def login():
 if request.method == "POST":
    email = request.form.get("email")
    pwd = request.form.get("password")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return "<script>alert('Email Not Found'); window.location='/loginpage';</script>"

    if check_password_hash(user["password"], pwd):
        session["user_id"] = user["id"]
        session["user_name"] = user["firstName"]
        session["applied_loan"] = user["applied_loan"]

        return "<script>alert('Login Successful!'); window.location='/dashboard';</script>"

    return "<script>alert('Incorrect Password'); window.location='/loginpage';</script>"
 return redirect("/home")
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/home")
@app.route("/profile")
def profile():
    if "user_id" not in session:
        return redirect("/login")

    user_id = session["user_id"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        return "User not found", 404

    # FIX: ONLY SEND 'user', remove 'user_name'
    return render_with_user("Profile.html", user=user)


# ------------------ DASHBOARD ------------------
@app.route("/dashboard")
def dashboard():
    return render_with_user("Homepage.html")
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    