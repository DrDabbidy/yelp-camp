const Campground = require("../models/campground"),
      middleware = require("../middleware/index"),
      express    = require("express"),
      router     = express.Router();

// INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // create the new campground obj
    const newCampground = {
        name: req.body.name,
        img: req.body.img,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };

    // aad the new campground to the db
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            req.flash("warning", "Something went wrong :/");
            res.redirect("/campgrounds");
        }
        else {
            console.log(`new campground: ${campground}`);
            
            req.flash("success", `Successfully created campground ${campground.name}!`);
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show the form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW - shows a specific campground from our list
router.get("/:id", (req, res) => {
    // find the campground w/ the provided id
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            // render the show template for that campground
            res.render("campgrounds/show", { campground: campground })
        }
    });
});

// EDIT - render the form to edit the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("campgrounds/edit", { campground: campground });
    });
})

// UPDATE - update a campground (push the changes made in edit)
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            res.redirect("back");
        }
        req.flash("success", `Successfully edited ${campground.name}!`);
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// DESTROY - deletes the campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        req.flash("success", `Successfully deleted campground!`);
        res.redirect("/campgrounds");
    });
});

module.exports = router;