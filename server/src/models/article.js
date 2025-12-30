import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    originalContent: {
      type: String,
      required: true
    },

    updatedContent: {
      type: String,
      default: ""
    },

    sourceUrl: {
      type: String,
      required: true,
      unique: true
    },

    references: {
      type: [String],
      default: []
    },

    isUpdated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Article = mongoose.model("Article", ArticleSchema);

export default Article;
