const Bug = require('../models/Bug');

// @desc    Get all bugs
// @route   GET /api/v1/bugs
exports.getBugs = async (req, res, next) => {
  try {
    const bugs = await Bug.find();
    res.status(200).json({ success: true, count: bugs.length, data: bugs });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a bug
// @route   POST /api/v1/bugs
exports.createBug = async (req, res, next) => {
  try {
    const bug = await Bug.create(req.body);
    res.status(201).json({ success: true, data: bug });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a bug
// @route   PUT /api/v1/bugs/:id
exports.updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bug) {
      return res.status(404).json({ success: false, error: 'Bug not found' });
    }

    res.status(200).json({ success: true, data: bug });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a bug
// @route   DELETE /api/v1/bugs/:id
exports.deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      return res.status(404).json({ success: false, error: 'Bug not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};