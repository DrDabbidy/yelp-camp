const Campground = require("../models/campground"),
      Commet     = require("../models/comment");

// all the middleware goes here!
const middlewareObj = {
    isLoggedIn: function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/login");
    },
    checkCampgroundOwnership: function checkCampgroundOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, campground) => {
                if (err) {
                    req.flash("error", "Something went wrong :/");
                    res.redirect("back");
                }
                else if (campground.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
        }
        else {
            req.flash("error", "You must be logged in to do that!");
            res.redirect("/login");
        }
    },
    checkCommentOwnership: function checkCommentOwnership(req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    req.flash("warning", "Something went wrong :/");
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
                else if (comment.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("errr", "You do not have permission to do that!");
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
        }
        else {
            req.flash("error", "You must be logged in to do that!");
            res.render("/login");
        }
    }
}

module.exports = middlewareObj;