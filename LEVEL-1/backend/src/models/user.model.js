// Purpose: Defines the shape of a user document in MongoDB.
// Owns the password hashing logic via a pre-save hook —
// the controller never touches raw passwords directly.

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            // unique: true creates a MongoDB index that rejects duplicate emails.
            // The error it throws is a low-level MongoDB error — we handle it
            // in the error handler middleware with a specific check for code 11000
            // (MongoDB's duplicate key error code).
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid eamil address',],         
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, 
            // select: false means this field is EXCLUDED from query results
            // by default. When you do User.findOne({ email }), the password
            // hash is NOT returned unless you explicitly request it with
            // .select('+password'). This prevents accidental password exposure
            // in API responses — a critical security default.            
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            // enum restricts the value to this exact list.
            // Mongoose rejects any other string at the schema level —
            // you cannot accidentally set role: 'superuser'.
            default: 'user',
            // All new accounts are regular users by default.
            // Admin accounts are promoted manually or via a seeding script.
        },
    },
    { timestamps: true}
)

// ── Pre-save hook ────────────────────────────────────────────────────
// This function runs automatically BEFORE every .save() call.
// Centralising hashing here means the controller never sees a plain
// password — it just calls user.save() and the model handles the rest.

userSchema.pre('save', async function () {
    // 'this' refers to the document being saved.

    // Only hash if the password field was actually modified.
    // Without this check, every time you update a user's name or role
    // the already-hashed password would be hashed AGAIN — producing
    // a hash of a hash, which would break login permanently.
    

    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10)
    // 10 = salt rounds (cost factor).
    // bcrypt generates a random salt, runs 2^10 iterations, and
    // returns the hash with the salt embedded in the string.
    
})

// ── Instance method ──────────────────────────────────────────────────
// Adding comparePassword as a method on the schema means every User
// document automatically has this function available.
// Usage: const isMatch = await user.comparePassword('plainTextInput')

userSchema.methods.comparePassword = async function (candidatePassword) {
    // 'this.password' is the stored hash.
    // Because password has select: false, the calling code must have
    // explicitly fetched it with .select('+password') — we'll see this
    // in the login controller.

    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User