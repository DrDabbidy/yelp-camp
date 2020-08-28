const User     = require("../models/user"),
      passport = require("passport"),
      express  = require("express"),
      router   = express.Router();

// ROUTES
// root dir
router.get("/", (req, res) => {
    res.render("landing");
});

// <----- AUTH ROUTES ----->
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            req.flash("warning", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Successfully registered! Welcome, ${user.username}!`);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;