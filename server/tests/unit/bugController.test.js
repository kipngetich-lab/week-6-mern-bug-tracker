// server/tests/unit/bugController.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Bug = require('../../src/models/Bug');
const {
  getBugs,
  createBug,
  updateBug,
  deleteBug
} = require('../../src/controllers/bugs');

describe('Bug Controller Unit Tests', () => {
  let mongoServer;
  let testBug;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    // Create a test bug
    testBug = await Bug.create({
      title: 'Initial Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Reset database before each test
    await Bug.deleteMany({});
    testBug = await Bug.create({
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    });
  });

  describe('getBugs', () => {
    it('should retrieve all bugs', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getBugs(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Bug',
            status: 'open'
          })
        ])
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database failure');
      jest.spyOn(Bug, 'find').mockRejectedValueOnce(mockError);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await getBugs(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createBug', () => {
    it('should create a new bug', async () => {
      const req = {
        body: {
          title: 'New Test Bug',
          description: 'New bug description',
          status: 'open',
          priority: 'high'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createBug(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          title: 'New Test Bug',
          priority: 'high'
        })
      });
    });

    it('should validate required fields', async () => {
      const req = {
        body: {
          description: 'Missing title'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createBug(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(mongoose.Error.ValidationError));
      expect(next.mock.calls[0][0].message).toContain('Please add a title');
    });

    it('should handle duplicate bug titles', async () => {
      // First create a bug
      await createBug(
        { body: { title: 'Duplicate', description: 'First' } },
        { status: () => ({ json: () => {} }) },
        () => {}
      );

      // Try to create duplicate
      const req = {
        body: {
          title: 'Duplicate',
          description: 'Second attempt'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await createBug(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        code: 11000
      }));
    });
  });

  describe('updateBug', () => {
    it('should update an existing bug', async () => {
      const req = {
        params: { id: testBug._id },
        body: { status: 'in-progress' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await updateBug(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          status: 'in-progress'
        })
      });
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const req = {
        params: { id: nonExistentId },
        body: { status: 'in-progress' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await updateBug(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bug not found'
      });
    });

    it('should validate update data', async () => {
      const req = {
        params: { id: testBug._id },
        body: { status: 'invalid-status' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await updateBug(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(mongoose.Error.ValidationError));
    });
  });

  describe('deleteBug', () => {
    it('should delete an existing bug', async () => {
      const req = {
        params: { id: testBug._id }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await deleteBug(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {}
      });

      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(testBug._id);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const req = {
        params: { id: nonExistentId }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await deleteBug(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Bug not found'
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database failure');
      jest.spyOn(Bug, 'findByIdAndDelete').mockRejectedValueOnce(mockError);

      const req = {
        params: { id: testBug._id }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await deleteBug(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});