const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

// // Aggregate function to get the number of students overall
// const headCount = async () => {
//   const numberOfStudents = await Student.aggregate()
//     .count('studentCount');
//   return numberOfStudents;
// }

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     // only include the given student by using $match
//     { $match: { _id: new ObjectId(studentId) } },
//     {
//       $unwind: '$assignments',
//     },
//     {
//       $group: {
//         _id: new ObjectId(studentId),
//         overallGrade: { $avg: '$assignments.score' },
//       },
//     },
//   ]);

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      // const studentObj = {
      //   students,
      //   headCount: await headCount(),
      // };

      // res.json(studentObj);
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }

      res.json({
        user,
        // get thought data
        thoughts: await Thought.find({ username: user.username }),
        // friend data
        friends: await User.find({ _id: { $in: user.friends } }),
        // grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user and remove them from the course
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      // const course = await Course.findOneAndUpdate(
      //   { students: req.params.studentId },
      //   { $pull: { students: req.params.studentId } },
      //   { new: true }
      // );

      // if (!course) {
      //   return res.status(404).json({
      //     message: 'Student deleted, but no courses found',
      //   });
      // }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
// };

  // Add a friend to a user
  async addFriend(req, res) {
    let requestUserID = req.params.userId;
    let requestfriendID = req.params.friendId;
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        // { runValidators: true, new: true }
        { new: true }
      );

      if (!user) {
        // return res.status(404).json({ message: 'No user found with that ID', requestUserID, requestfriendID });
        return res.status(404).send(`No user found with that ID ${requestUserID} ${requestfriendID}`);
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  // Remove a friend from a user
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      } else if (user === null) { 
        return res.status(404).json({ message: 'No friend found with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

//   // Add an assignment to a student
//   async addAssignment(req, res) {
//     console.log('You are adding an assignment');
//     console.log(req.body);

//     try {
//       const student = await Student.findOneAndUpdate(
//         { _id: req.params.studentId },
//         { $addToSet: { assignments: req.body } },
//         { runValidators: true, new: true }
//       );

//       if (!student) {
//         return res
//           .status(404)
//           .json({ message: 'No student found with that ID :(' });
//       }

//       res.json(student);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   },
//   // Remove assignment from a student
//   async removeAssignment(req, res) {
//     try {
//       const student = await Student.findOneAndUpdate(
//         { _id: req.params.studentId },
//         { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
//         { runValidators: true, new: true }
//       );

//       if (!student) {
//         return res
//           .status(404)
//           .json({ message: 'No student found with that ID :(' });
//       }

//       res.json(student);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   },
// };
