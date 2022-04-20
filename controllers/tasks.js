const tasks = require("../models/tasks");
const { TASK_STATUS } = require("../constants/tasks");
const { toFirestoreData } = require("../utils/tasks");

/**
 * Creates new task
 *
 * @param req {Object} - Express request object
 * @param req.body {Object} - Task object
 * @param res {Object} - Express response object
 */
const addNewTask = async (req, res) => {
  try {
    const { id: createdBy } = req.userData;
    const body = {
      ...req.body,
      createdBy,
    };
    const taskData = await toFirestoreData(body);
    if (taskData.userNotFound) {
      logger.error("Error while creating new task: Incorrect username passed");
      return res.boom.badRequest("User not found");
    }
    const task = await tasks.updateTask(taskData);
    return res.json({
      message: "Task created successfully!",
      task: task.taskDetails,
      id: task.taskId,
    });
  } catch (err) {
    logger.error(`Error while creating new task: ${err}`);
    return res.boom.badImplementation("An internal server error occurred");
  }
};
/**
 * Fetches all the tasks
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const fetchTasks = async (req, res) => {
  try {
    const allTasks = await tasks.fetchTasks();
    return res.json({
      message: "Tasks returned successfully!",
      tasks: allTasks.length > 0 ? allTasks : [],
    });
  } catch (err) {
    logger.error(`Error while fetching tasks ${err}`);
    return res.boom.badImplementation("An internal server error occurred");
  }
};

/**
 * Fetches all the tasks of the requested user
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getUserTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const { username } = req.params;
    let allTasks = [];

    if (status && !Object.values(TASK_STATUS).includes(status)) {
      return res.boom.notFound("Status not found!");
    }

    allTasks = await tasks.fetchUserTasks(username, status ? [status] : []);

    if (allTasks.userNotFound) {
      return res.boom.notFound("User doesn't exist");
    }

    return res.json({
      message: "Tasks returned successfully!",
      tasks: allTasks.length > 0 ? allTasks : [],
    });
  } catch (err) {
    logger.error(`Error while fetching tasks: ${err}`);

    return res.boom.badImplementation("An internal server error occurred");
  }
};

/**
 * Fetches all the tasks of the logged in user
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const getSelfTasks = async (req, res) => {
  try {
    const { username } = req.userData;

    if (username) {
      if (req.query.completed) {
        const allCompletedTasks = await tasks.fetchUserCompletedTasks(username);
        return res.json(allCompletedTasks);
      } else {
        const allTasks = await tasks.fetchUserActiveAndBlockedTasks(username);
        return res.json(allTasks);
      }
    }
    return res.boom.notFound("User doesn't exist");
  } catch (err) {
    logger.error(`Error while fetching tasks: ${err}`);
    return res.boom.badImplementation("An internal server error occurred");
  }
};
/**
 * Updates the task
 *
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const updateTask = async (req, res) => {
  try {
    const task = await tasks.fetchTask(req.params.id);
    if (!task.taskData) {
      return res.boom.notFound("Task not found");
    }
    const taskData = await toFirestoreData(req.body);
    if (taskData.userNotFound) {
      logger.error(`Error while updating taskId ${req.params.id}: Incorrect username passed`);
      return res.boom.badRequest("User not found");
    }
    await tasks.updateTask(taskData, req.params.id);
    return res.status(204).send();
  } catch (err) {
    logger.error(`Error while updating task: ${err}`);
    return res.boom.badImplementation("An internal server error occurred");
  }
};

/**
 * Updates self task status
 * @param req {Object} - Express request object
 * @param res {Object} - Express response object
 */
const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { id: userId } = req.userData;
    const task = await tasks.fetchSelfTask(taskId, userId);

    if (task.taskNotFound) {
      logger.error(`Error while updating taskId ${req.params.id}: Invalid taskId passed`);
      return res.boom.notFound("Task doesn't exist");
    }
    if (task.notAssignedToYou) {
      logger.error(`Error while updating taskId ${req.params.id}: Forbidden user`);
      return res.boom.forbidden("This task is not assigned to you");
    }

    const taskData = await toFirestoreData(req.body);
    if (taskData.userNotFound) {
      logger.error(`Error while updating taskId ${req.params.id}: Incorrect username passed`);
      return res.boom.badRequest("User not found");
    }

    await tasks.updateTask(req.body, taskId);
    return res.json({ message: "Task updated successfully!" });
  } catch (err) {
    logger.error(`Error while updating task status : ${err}`);
    return res.boom.badImplementation("An internal server error occured");
  }
};

module.exports = {
  addNewTask,
  fetchTasks,
  updateTask,
  getSelfTasks,
  getUserTasks,
  updateTaskStatus,
};
