const User = require('../models/user')
const fs = require('fs');

const getUser = async (req, res) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      user
    });
  });
}

const getAllUsers = async (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      usersList: users
    });
  })
}

const getAllMembers = async (req, res) => {
  User.find({ isAdmin: false }, (err, members) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      membersList: members
    });
  })
}

const addUser = async (req, res) => {
  const newUser = req.body
  // delete newUser.photoUrl;
  console.log(req.body);
  User.findOne({ email: newUser.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    if (user) {
      console.log(user);
      return res.status(403).json({ success: false, message: "User already exists" });
    } else {
      const newUser = new User(req.body);
      newUser.setPassword(req.body.password);
      if (req.file) newUser.photoUrl = req.file.path;
      newUser.save((err, user) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res.status(201).json({
          success: true,
          user
        });
      })
    }
  })
}

const resetPassword = async (req, res) => {
  const userId = req.params.id;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const currentPassword = req.body.currentPassword;
  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // first validate the current password and then set the new password
    if (user.isValidPassword(currentPassword)) {
      user.setPassword(newPassword);
      const updatedUser = await user.save();
      return res.status(200).json({
        success: true,
        updatedUser: updatedUser
      });
    } else {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
  }
  catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, err: err.message });
  }
}

const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields individually
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.dob) user.dob = req.body.dob;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.isAdmin) user.isAdmin = req.body.isAdmin;
    if (req.body.password) {
      user.setPassword(req.body.password);
    }

    if (req.file) {
      // Handle photoUrl update or deletion here
      if (user.photoUrl) {
        fs.unlinkSync(user.photoUrl);
      }
      user.photoUrl = req.file.path;
    }

    // Save the updated user
    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      updatedUser: updatedUser
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, err: err.message });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.id

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    if (user.photoUrl) {
      fs.unlinkSync(user.photoUrl)
    }
    return res.status(200).json({
      success: true,
      deletedUser: user
    });
  })
}

module.exports = {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  resetPassword
}
