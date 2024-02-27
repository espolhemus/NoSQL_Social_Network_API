const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// // /api/students
// router.route('/').get(getStudents).post(createStudent);
// /api/users
router.route('/').get(getUsers).post(createUser);

// // /api/students/:studentId
// router.route('/:studentId').get(getSingleStudent).delete(deleteStudent);
// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

// // put to update a user by its _id
// router.route('/:userId').put(updateUser);

// // /api/students/:studentId/assignments
// router.route('/:studentId/assignments').post(addAssignment);
// /api/users/:userId/friends/:friendId
router.route('/:userID/friends').post(addFriend);

// // /api/students/:studentId/assignments/:assignmentId
// router.route('/:studentId/assignments/:assignmentId').delete(removeAssignment);
// /api/students/:studentId/assignments/:assignmentId
router.route('/:userID/friends/:friendId').delete(removeFriend);


module.exports = router;
