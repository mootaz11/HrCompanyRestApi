const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    motdepasse: String,
    image: String,
    cv: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'role' },
    datenaissance: String,
    scores: [{
        quiz: String, score: Number}],
    roleType: String,
    equipe: { type: mongoose.Schema.Types.ObjectId, ref: 'equipe' }
});

module.exports = mongoose.model("user", userSchema);
