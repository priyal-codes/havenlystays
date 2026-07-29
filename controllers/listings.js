const Listing = require("../models/listing.js");

module.exports.index = async(req, res) => {
    const { search, category, month, guests } = req.query;
    let queryConditions = [];

    if (category && category.trim() !== "") {
        const catRegex = new RegExp(category.trim(), "i");
        queryConditions.push({
            $or: [
                { category: catRegex },
                { title: catRegex },
                { description: catRegex },
                { location: catRegex },
                { country: catRegex }
            ]
        });
    }

    if (search && search.trim() !== "") {
        const searchRegex = new RegExp(search.trim(), "i");
        queryConditions.push({
            $or: [
                { title: searchRegex },
                { location: searchRegex },
                { country: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ]
        });
    }

    if (month && month.trim() !== "") {
        const monthRegex = new RegExp(month.trim(), "i");
        queryConditions.push({
            $or: [
                { bestMonth: monthRegex },
                { title: monthRegex },
                { description: monthRegex },
                { location: monthRegex },
                { country: monthRegex }
            ]
        });
    }

    let finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};
    let allListings = await Listing.find(finalQuery);

    // Fallback: if month was chosen but no specific restriction matches, return destination stays so user gets results
    if (month && month.trim() !== "" && allListings.length === 0) {
        const fallbackConditions = queryConditions.filter(c => !c.$or.some(o => o.bestMonth));
        const fallbackQuery = fallbackConditions.length > 0 ? { $and: fallbackConditions } : {};
        allListings = await Listing.find(fallbackQuery);
    }

    res.render("listings/index.ejs", { 
        allListings, 
        search: search ? search.trim() : "", 
        category: category ? category.trim() : "",
        selectedMonth: month ? month.trim() : "",
        guests: guests ? guests.trim() : ""
    });
};

module.exports.searchSuggestions = async(req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === "") {
        return res.json([]);
    }
    const searchRegex = new RegExp(q.trim(), "i");
    const suggestions = await Listing.find({
        $or: [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
        ]
    }).select("title location country image price _id").limit(6);

    res.json(suggestions);
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
         return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
       
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
         return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};