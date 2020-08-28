const Campground     = require("./models/campground"), 
      Comment        = require("./models/comment"),
      methodOverride = require("method-override"),
      LocalStrategy  = require("passport-local"),
      User           = require("./models/user"),
      flash          = require("connect-flash"),
      bodyParser     = require("body-parser"), 
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      express        = require("express"),
      seedDB         = require("./seed"),
      app            = express();

const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("mongoose is connected"))
.catch((err) => console.log(err));

app.use(require("express-session")({
    secret: "Nobody cares about your feelings...",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use((req, res, next) => {
    res.locals.curUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});
app.use(methodOverride("_method"));
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB(); // seed the DB

// run the app to listen to http requests on port 3000
app.listen(3000, () => {
    console.log("The Yelp Camp Server has Started!");
});