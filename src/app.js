const express = require("express")
const app = express();
const path = require("path");
const hbs = require("hbs");

require("./db/conn")
const Register = require("./models/register")

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public")
const tempate_path = path.join(__dirname, "../template/views")
const partials_path = path.join(__dirname, "../template/partials")

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", tempate_path);
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.cpassword

        if(password === cpassword) {
            const registerEmployee = new Register({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                cpassword : req.body.cpassword
            })

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }else {
            res.send("Passwords don't match")
        }
    } catch (error) {
        res.status(400).send(error); 
    }
})

// login check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email : email})
        
        if(useremail.password === password) {
            res.status(201).render("index");
        } else {
            res.send("Invalid login details");
        }

    } catch (error) {
        res.status(400).send("Invalid login details");
    }
})


app.listen(port, () => {
    console.log(`server running at ${port}`)
})