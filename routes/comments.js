const Campground = require("../models/campground"),
      middleware = require("../middleware/index"),
      Comment    = require("../models/comment"),
      express    = require("express"),
      router     = express.Router({ mergeParams: true });

// NEW comments - renders the form for submitting a new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        // render the form
        res.render("comments/new", { campground: campground });
    });
    
});

// CREATE - create a new comment and add it to the campground's list of comments
router.post("/", async (req, res) => {
    try {
        let campground = await Campground.findById(req.params.id);
        let comment = await Comment.create({
            text: req.body.text,
            author: {
                username: req.user.username,
                id: req.user._id
            }
        });
        campground.comments.push(comment);
        await campground.save();
        req.flash("success", "Successfully created new comment!");
    }
    catch (err) {
        console.log(err);
        req.flash("warning", "Something went wrong :/");
    }
    res.redirect(`/campgrounds/${req.params.id}`);
});

// EDIT - render the edit form for the comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req, res) => {
    const campgroundId = req.params.id;
    const comment = await Comment.findById(req.params.comment_id);
    res.render("comments/edit", { campgroundId: campgroundId, comment: comment });
});

// UPDATE - update the comment and render the show page of the campground it is associated w/
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, { text: req.body.text }, (err, comment) => {
        if (err) {
            console.log(err);
        }
        req.flash("success", "Successfully updated comment!");
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// DESTROY - delete the comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/campgrounds/${req.params.id}`); 
    });
});

module.exports = router;