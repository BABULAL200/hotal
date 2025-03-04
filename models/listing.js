const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            filename: {
                type: String,
                default: "default-filename",
            },
            url: {
                type: String,
                default: "https://unsplash.com/photos/a-forest-filled-with-lots-of-trees-covered-in-fog-A0xv0-vSpkc",
                set: (v) =>
                    v === ""
                        ? "https://unsplash.com/photos/a-forest-filled-with-lots-of-trees-covered-in-fog-A0xv0-vSpkc"
                        : v,
            },
        },
        price: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
        },
        country: {
            type: String,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    // {
    //     timestamps: true, // Automatically adds createdAt and updatedAt fields
    // }
);

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
