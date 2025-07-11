// server/src/routes/bugs.js
const express = require('express');
const {
  getBugs,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugs');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bugs
 *   description: Bug tracking endpoints
 */

/**
 * @swagger
 * /api/v1/bugs:
 *   get:
 *     summary: Get all bugs
 *     tags: [Bugs]
 *     responses:
 *       200:
 *         description: List of all bugs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bug'
 */
router.route('/')
  .get(getBugs)

  /**
   * @swagger
   * /api/v1/bugs:
   *   post:
   *     summary: Create a new bug
   *     tags: [Bugs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Bug'
   *     responses:
   *       201:
   *         description: Bug created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Bug'
   *       400:
   *         description: Invalid input data
   */
  .post(createBug);

/**
 * @swagger
 * /api/v1/bugs/{id}:
 *   put:
 *     summary: Update a bug
 *     tags: [Bugs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bug ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bug'
 *     responses:
 *       200:
 *         description: Bug updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bug'
 *       404:
 *         description: Bug not found
 *       400:
 *         description: Invalid input data
 */
router.route('/:id')
  .put(updateBug)

  /**
   * @swagger
   * /api/v1/bugs/{id}:
   *   delete:
   *     summary: Delete a bug
   *     tags: [Bugs]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Bug ID
   *     responses:
   *       200:
   *         description: Bug deleted successfully
   *       404:
   *         description: Bug not found
   */
  .delete(deleteBug);

/**
 * @swagger
 * components:
 *   schemas:
 *     Bug:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the bug
 *         title:
 *           type: string
 *           description: The title of the bug
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: The description of the bug
 *         status:
 *           type: string
 *           enum: [open, in-progress, resolved]
 *           default: open
 *           description: Current status of the bug
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *           description: Priority level of the bug
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the bug was created
 *       example:
 *         _id: 60f9b2b3b3b3b3b3b3b3b3b3
 *         title: Login page not loading
 *         description: The login page returns a 500 error when submitting credentials
 *         status: open
 *         priority: high
 *         createdAt: 2021-07-22T12:34:56.789Z
 */

module.exports = router;