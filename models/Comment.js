// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;
// Create the Note schema
// Define Comment schema
const CommentSchema = new Schema({
  _article_id: {
    type: String,
    ref: 'Article'
  },
  comment: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})
// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model
// Create the Note model with the NoteSchema
var Comment = mongoose.model("Comment", CommentSchema);
// Export the Note model
module.exports = Comment;