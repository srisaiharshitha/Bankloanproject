from flask import Flask, request, session, redirect, render_template, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from db import get_connection
import os

app = Flask(__name__)
app.secret_key = "mysecretkey"
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
    return render_template("GoldLoanForm.html")


# ================= SUBMIT GOLD LOAN FORM ==================
@app.route("/submit_gold_loan", methods=["GET","POST"])
def submit_gold_loan():
    if request.method == "GET":
        return render_template("GoldLoanForm.html")
    try:
        # ------- Form Fields -------
        fullName = request.form.get("fullName")
        surname = request.form.get("surname")
        dob = request.form.get("dob")
        phone = request.form.get("phone")
        address = request.form.get("address")
        goldWeight = request.form.get("goldWeight")
        goldPurity = request.form.get("goldPurity")

        # ------- File Upload -------
        receipt_file = request.files.get("goldReceipt")

        filename = None
        if receipt_file:
            filename = secure_filename(receipt_file.filename)
            filepath = os.path.join("uploads", filename)
            receipt_file.save(filepath)

        # ------- Insert Into Database -------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO gold_loan_applications
            (fullName, surname, dob, phone, address, goldWeight, goldPurity, goldReceipt)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (fullName, surname, dob, phone, address, goldWeight, goldPurity, filename)

        cursor.execute(query, values)
        conn.commit()

        # Success JSON
        return jsonify({
            "status": "success",
            "name": fullName,
            "phone": phone
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ------------------ SUBMIT HOME LOAN FORM ------------------
@app.route("/submit_home_loan", methods=["GET","POST"])
def submit_home_loan():
    
    if request.method == "GET":
        return render_template("HomeLoanForm.html")
    
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

        # Multiple property files
        property_files = request.files.getlist("propertyDocs")
        propertyDocs = ",".join([save_file(f) for f in property_files])

        # ------------ INSERT INTO DATABASE ------------
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO home_loan_applications
            (fullName, surname, address, dob, phone,
             annualIncome, employmentType,
             propertyLocation, propertyValue,
             loanPurpose, loanAmount, tenure,
             idProof, addressProof, incomeProof, propertyDocs)
            VALUES (%s, %s, %s, %s, %s,
                    %s, %s,
                    %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s)
        """

        values = (
            fullName, surname, address, dob, phone,
            annualIncome, employmentType,
            propertyLocation, propertyValue,
            loanPurpose, loanAmount, tenure,
            idProof, addressProof, incomeProof, propertyDocs
        )

        cursor.execute(query, values)
        conn.commit()

        # ------------ RETURN SUCCESS (JSON) ------------
        return jsonify({
            "status": "success",
            "name": fullName,
            "phone": phone
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ------------------ HOME ------------------
@app.route("/home")
def home():
    return render_template("Homepage.html")
# ------------------ ABOUT US PAGE ------------------
@app.route("/aboutus")
def aboutus():
    return render_template("About us.html")


# ------------------ CONTACT US PAGE ------------------
@app.route("/contact")
def contact():
    return render_template("Contact.html")


# ------------------ EXPLORE LOANS PAGE ------------------
@app.route("/exploreloans")
def exploreloans():
    return render_template("ExploreLoans.html")

# ------------------ REGISTRATION ------------------
@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "GET":
        return render_template("RegistrationPage.html")
    try:
        # FORM DATA
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

        # FILE UPLOAD
        file = request.files["profileDoc"]
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        profile_pic_file = request.files.get("profilePic")
        profile_pic_name = None

        if profile_pic_file and profile_pic_file.filename != "":
           profile_pic_name = secure_filename(profile_pic_file.filename)
           profile_pic_file.save(os.path.join(UPLOAD_FOLDER, profile_pic_name))


        # DATABASE INSERT
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO users (
    firstName, lastName, email, phone, dob, gender, address,
    idType, idNumber,
    employment, income,
    loanType, amount, tenure, branch,
    username, password, securityQ,
    profileDoc, profilePic
)
VALUES (%s, %s, %s, %s, %s, %s, %s,
        %s, %s,
        %s, %s,
        %s, %s, %s, %s,
        %s, %s, %s,
        %s, %s)

        """

        values = (
            first_name, last_name, email, phone, dob, gender, address,
            id_type, id_number,
            employment, income,
            loan_type, amount, tenure, branch,
            username, hashed_password, security_question,
            filename,profile_pic_name  
        )

        cursor.execute(query, values)
        conn.commit()

        return "<script>alert('Registration Successful!'); window.location='/';</script>"

    except Exception as e:
        return f"<h2>Error: {e}</h2>"
    
#----------
@app.route("/homeloan")
def homeloan():
    return render_template("HomeLoan.html")
@app.route("/goldloan")
def goldloan():
    return render_template("GoldLoan.html")
@app.route("/personalloan")
def personalloan():
    return render_template("PersonalLoan.html")
@app.route("/educationloan")
def educationloan():
    return render_template("EducationLoan.html")
@app.route("/vehicleloan")
def vehicleloan():
    return render_template("VehicleLoan.html")
@app.route("/businessloan")
def businessloan():
    return render_template("BusinessLoan.html")
@app.route("/businessform")
def businessform():
    return render_template("business_application_form.html")
# ------------------ LOGIN PAGE ROUTE ------------------
@app.route("/loginpage")
def loginpage():
    return render_template("Login.html")


# ------------------ LOGIN LOGIC ------------------
@app.route("/login", methods=["POST"])
def login():
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
        return "<script>alert('Login Successful!'); window.location='/profile';</script>"

    return "<script>alert('Incorrect Password'); window.location='/loginpage';</script>"
# ------------------ USER PROFILE PAGE ------------------
@app.route("/profile")
def profile():
    if "user_id" not in session:
        return redirect("/loginpage")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE id=%s", (session["user_id"],))
    user = cursor.fetchone()

    return render_template("Profile.html", user=user)


# ------------------ DASHBOARD ------------------
@app.route("/dashboard")
def dashboard():
    return render_template("Homepage.html")
#--------------------------------------------------
from flask import send_from_directory

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

#---------------LOGOUT---------------------------
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/loginpage")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    
