import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update, child, remove, get, serverTimestamp } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import React from 'react';

/*****
 *  
 * Configurations
 *
*****/

const firebaseConfig = {
  apiKey: "AIzaSyCo0gPK4fEqqPd5WgmhISKfy1P8AgPmf3Y",
  authDomain: "purduezilla.firebaseapp.com",
  databaseURL: "https://purduezilla-default-rtdb.firebaseio.com",
  projectId: "purduezilla",
  storageBucket: "purduezilla.appspot.com",
  messagingSenderId: "1043168052788",
  appId: "1:1043168052788:web:be5443766ed89f9479ac61",
  measurementId: "G-9G4NCBXCZX"
};

// Initialze firebase
const app = initializeApp(firebaseConfig);
// Initialize analytics
//const analytics = getAnalytics(app);
//initialize db
const db = getDatabase(app);
//auth
const auth = getAuth();

/*****
 *  
 * Write functions
 *
*****/

// Create new user in our db
// Does not authenticate user: must also call createAccount() for authentication
// kyle: it is called only when createAccount returns true, this assures that the email is not duplicated
const createNewUser = function createNewUser(email, username, firstName, lastName, profileDescription = "", notificationSetting = "") {
  const userListRef = ref(db, 'users');
  const newUserRef = push(userListRef);
  set(newUserRef, {
    email: email,
    username: username,
    firstName: firstName,
    lastName: lastName,
    profileDescription: profileDescription,
    notificationSetting: notificationSetting,
  });

  return newUserRef.key;
}

// Create new group
const createNewGroup = function createNewGroup(name, description, ownerId, memberIds, viewerIds) {

  const groupListRef = ref(db, 'groups');
  const newGroupRef = push(groupListRef);
  set(newGroupRef, {
    name: name,
    description, description,
    ownerId: ownerId,
  });

  // Add member user Id's
  for (const i in memberIds) {
    addNewMemberToGroup(newGroupRef.key, memberIds[i]);
  }

  // Add viewer user Id's
  for (const i in viewerIds) {
    addNewViewerToGroup(newGroupRef.key, viewerIds[i]);
  }

  return newGroupRef.key;
}

const changeGroupOwner = function changeGroupOwner(groupKey, ownerId) {
  const groupRef = ref(db, 'groups/' + groupKey);
  update(groupRef, {
    ownerId: ownerId
  });
}

const addNewMemberToGroup = function addNewMemberToGroup(groupKey, userId) {
  const membersListRef = ref(db, 'groups/' + groupKey + '/members');
  const userRef = push(membersListRef);
  set(userRef, {
    memberId: userId
  });
}

const addNewViewerToGroup = function addNewViewerToGroup(groupKey, userId) {
  const membersListRef = ref(db, 'groups/' + groupKey + '/viewers');
  const userRef = push(membersListRef);
  set(userRef, {
    viewerId: userId
  });
}

const addNewProjectToGroup = function addNewProjectToGroup(groupKey, projectId, projectName) {
  const ownersListRef = ref(db, 'groups/' + groupKey + '/projects');
  const projectRef = push(ownersListRef);
  set(projectRef, {
    projectId: projectId,
    projectName: projectName
  });
}

//notifications
/*
  sourcePath: save path to target ex. (`/projects/${projectKey}/comments/${commentKey}`)
  body: notification message
  type: heading that tells user what this notification is about.
  timeMade: datetime at notification creation "day-month-year hour:time"
*/
const createNotification = function createNotification(targetKey, body, type, sourcePath) {
  const notifRef = ref(db, `users/${targetKey}/notifications`);
  const newNotificationRef = push(notifRef);
  const curDate = new Date();
  set(newNotificationRef, {
    sourcePath: sourcePath,
    body: body,
    type: type,
    timeMade: `${curDate.getDate()}-${curDate.getMonth() + 1}-${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}`,
  });
}


const getNotifications = function getNotifications(userKey) {
  // console.log("notifications?");
  // console.log(userKey);
  const notifRef = ref(db, `users/${userKey}/notifications`);
  let returnedNotifs = [];
  onValue(notifRef, (snapshot) => {
    let child = snapshot.val();
    // console.log(child);
    for (var key in child) {
      console.log("adding");
      returnedNotifs.push([child[key], key]);
    }
  }, { onlyOnce: true });
  console.log(returnedNotifs);
  return returnedNotifs;
}

const deleteNotifications = function deleteNotifications(userKey) {
  const notifRef = ref(db, `users/${userKey}/notifications`);
  remove(notifRef);
  // console.log("removed all notifications");
}

const createNewProjectComment = function createNewProjectComment(body, authorKey, projectKey, authorFirstName) {
  const projectRef = ref(db, `projects/${projectKey}/comments`);
  const newCommentRef = push(projectRef);
  set(newCommentRef, {
    body: body,
    author: authorKey,
    firstName: authorFirstName,
  });
  return [{ body: body, author: authorKey, firstName: authorFirstName }, newCommentRef.key];
}

const deleteProjectComment = function deleteProjectComment(commentKey, projectKey) {
  const projectCommentRef = ref(db, `projects/${projectKey}/comments/${commentKey}`);
  remove(projectCommentRef);
  console.log(`removing ${commentKey} from ${projectKey}`)
}

const updateProjectComment = function updateProjectComment(commentKey, newBody, authorKey, authorFirstName, projectKey) {
  const commentData = {
    author: authorKey,
    body: newBody,
    firstName: authorFirstName,
  }
  const updates = {}
  updates[`/projects/${projectKey}/comments/${commentKey}`] = commentData
  update(ref(db), updates);
}

const getProjectComments = function getProjectComments(projectKey) {
  const projectRef = ref(db, `projects/${projectKey}/comments`);
  let returnedComments = [];
  onValue(projectRef, (snapshot) => {
    let child = snapshot.val();

    for (var key in child) {
      // console.log("adding");
      returnedComments.push([child[key], key]);
    }
  }, { onlyOnce: true });
  // console.log(returnedComments);
  return returnedComments;
}

//create new comments
const createNewComment = function createNewComment(body, authorKey, taskKey, taggedKeys, authorFirstName) {
  let taskRef = ref(db, `tasks/${taskKey}/comments`);
  let newCommentRef = push(taskRef);
  set(newCommentRef, {
    body: body,
    author: authorKey,
    firstName: authorFirstName,
  });

  let newRef;
  let userRef;
  let userRefList = ref(db, 'users/');
  let userRefObjects = {};
  taggedKeys.forEach(function (key) {
    userRefObjects[key] = 1;
    console.log("added below:");
    console.log(key);
  });
  let child1;
  onValue(userRefList, (snapshot) => {
    child1 = snapshot.val();
  }, { onlyOnce: true });
  for (var key in child1) {
    console.log(key);
    if (userRefObjects[child1[key].email] === 1) {
      console.log("enters the tagging phase");
      userRef = ref(db, `users/${key}/tagged`);
      newRef = push(userRef);
      set(newRef, {
        taskKey: taskKey,
        commentKey: newCommentRef.key,
        author: authorKey,
        body: body
      });
      createNotification(key,
        `You have been tagged in a task by ${child1[key].firstName}!`,
        "task",
        taskKey,
      )
    }
  }

  // taggedKeys.forEach(function (key) {
  //   if (userRefObjects[key]) {
  //     userRef = ref(db, `users/${key}/tagged`);
  //     newRef = push(userRef);
  //     set(newRef, {
  //       taskKey: taskKey,
  //       commentKey: newCommentRef.key,
  //       author: authorKey,
  //       body: body
  //     });
  //   }
  // });

  return [{ body: body, author: authorKey, authorName: authorFirstName }, newCommentRef.key];
}

const deleteTaskComment = function deleteTaskComment(commentKey, taskKey) {
  const commentRef = ref(db, `tasks/${taskKey}/comments/${commentKey}`);
  remove(commentRef);
}

const updateTaskComment = function updateTaskComment(commentKey, newBody, authorKey, authorFirstName, taskKey) {
  const commentData = {
    author: authorKey,
    body: newBody,
    firstName: authorFirstName,
  }
  console.log(authorKey);
  console.log(newBody);
  console.log(authorFirstName);
  const updates = {}
  updates[`/tasks/${taskKey}/comments/${commentKey}`] = commentData
  update(ref(db), updates);
}

//get the comments for a task
const getTaskComments = function getTaskComments(taskKey) {
  // console.log("called function " + taskKey);
  const taskRef = ref(db, `tasks/${taskKey}/comments/`);
  // console.log("called function pt2");
  let returnedTasks = [];
  // console.log("iterate");
  onValue(taskRef, (snapshot) => {
    let child = snapshot.val();

    for (var key in child) {
      returnedTasks.push([child[key], key]);
    }
  }, { onlyOnce: true });
  // console.log("finish getting nothing");
  // console.log(returnedTasks);
  console.log(returnedTasks);
  return returnedTasks;

}

//returns comment key, task key, and body for comments that have tagged the user
const getTaggedComments = function getTaggedComments(userKey) {
  const returnedComments = [];
  let commentRef = ref(db, `users/${userKey}/tagged/`);
  // console.log(userKey);
  onValue(commentRef, (snapshot) => {
    let child = snapshot.val();
    for (var key in child) {
      returnedComments.push(child[key]);
    }
  });
  // console.log(returnedComments);
  return returnedComments;
}

// Create new project
// To get all tasks associated with project, query 'tasks' by project id
const createNewProject = function createNewProject(name, description, memberIds, ownerId, viewerIds) {

  const projectListRef = ref(db, 'projects');
  const newProjectRef = push(projectListRef);
  set(newProjectRef, {
    name: name,
    description: description,
    creationDate: new Date(),
    ownerId: ownerId,
    status: "Active"
  });

  // Add member user Id's
  for (const i in memberIds) {
    addProjectMember(newProjectRef.key, memberIds[i]);
  }

  // Add viewer user Id's
  for (const i in viewerIds) {
    addProjectViewer(newProjectRef.key, viewerIds[i]);
  }

  return newProjectRef.key;

}

/**
 * Adds a list of people as members of a project
 * @param {*} id 
 * @param {*} memberId 
 */
const addProjectMember = (id, memberId) => {
  const ownersListRef = ref(db, 'projects/' + id + '/members');
  const userRef = push(ownersListRef);
  set(userRef, {
    memberId: memberId
  });
}

const addProjectViewer = (id, viewerId) => {
  const ownersListRef = ref(db, 'projects/' + id + '/viewers');
  const userRef = push(ownersListRef);
  set(userRef, {
    viewerId: viewerId
  });
}

/**
 * Changes project owner
 * @param {*} id of a project
 * @param {*} ownerId 
 */
const changeProjectOwner = (id, ownerId) => {
  const projectRef = ref(db, 'projects/' + id);
  update(projectRef, {
    ownerId: ownerId
  });
}

const addTaskToProject = (projectId, taskId) => {
  const taskListRef = ref(db, 'projects/' + projectId + '/tasks');
  const taskRef = push(taskListRef);
  set(taskRef, {
    taskId: taskId
  });
}

// Create new task
// permittedUserIds, ownerIds, assignedUserIds, followerIds must be arrays
const createNewTask = function createNewTask(name, description, estimatedTime, status, ownerId, assignedUserId, followerIds) {

  // Create basic task
  const taskListRef = ref(db, 'tasks');
  const newTaskRef = push(taskListRef);

  set(newTaskRef, {
    name: name,
    description: description,
    estimatedTime: estimatedTime,
    assignedUserId: assignedUserId,
    ownerId: ownerId,
    status: status,
  });

  // Add follower user Id's
  for (const i in followerIds) {
    addTaskFollower(newTaskRef.key, followerIds[i]);
  }

  return newTaskRef.key;
}

const changeTaskOwner = (id, ownerId) => {
  const taskRef = ref(db, 'tasks/' + id);
  update(taskRef, {
    ownerId: ownerId
  });
}

const changeTaskAssignedUser = (id, assignedUserId) => {
  const taskRef = ref(db, 'tasks/' + id);
  update(taskRef, {
    assignedUserId: assignedUserId
  });
}

/**
 * Changes task status
 * @param {*} id of a project
 * @param {*} status 
 */
const changeTaskStatus = (id, status) => {
  const taskRef = ref(db, 'tasks/' + id);
  update(taskRef, {
    status: status
  });
}

// changed to only one follower - derek
const addTaskFollower = (taskId, followerId) => {
  const followersListRef = ref(db, 'tasks/' + taskId + '/followers');
  const userRef = push(followersListRef);
  set(userRef, {
    followerId: followerId
  });
}

const addTaskHistoryEvent = (taskId, change, oldVal, newVal, userId) => {
  const userListRef = ref(db, 'tasks/' + taskId + '/history');
  const newUserRef = push(userListRef);
  const date = String(new Date());
  set(newUserRef, {
    change: change,
    oldValue: oldVal,
    newValue: newVal,
    date: date,
    authorId: userId
  });
}

const addProjectHistoryEvent = (projectId, change, oldVal, newVal, userId) => {
  const userListRef = ref(db, 'projects/' + projectId + '/history');
  const newUserRef = push(userListRef);
  const date = String(new Date());
  set(newUserRef, {
    change: change,
    oldValue: oldVal,
    newValue: newVal,
    date: date,
    authorId: userId
  });
}

/*****
 *  
 * Query functions
 *
*****/

const getTaskHistory = (taskId) => {
  const history = [];
  onValue(ref(db, 'tasks/' + taskId + '/history'), (snapshot) => {
    snapshot.forEach(function (c) {
      history.push(c.val());
    })
  });
  return history;
}

const getProjectHistory = (projectId) => {
  const history = [];
  onValue(ref(db, 'projects/' + projectId + '/history'), (snapshot) => {
    snapshot.forEach(function (c) {
      history.push(c.val());
    })
  });
  return history;
}

// Returns array of task keys
const getProjectsTasks = function getProjectsTasks(projectId) {

  const taskKeys = [];

  get(ref(db, "projects/" + projectId + "/tasks")).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      taskKeys.push(childSnapshot.val().taskId);
    })
  });

  return taskKeys;

}

// Returns array of task keys
const getGroupsTasks = async function getGroupsTasks(groupId) {
  const dbRef = ref(db);
  var taskListArr = []

  const projectList = (await getGroupsProjects(groupId))
  console.log("projectList: " + JSON.stringify(projectList))

  for (const project of projectList) {
    console.log("projectListarr: " + JSON.stringify(project[1].projectId))
    const taskList = (await getProjectsTasks(project[1].projectId))
    for (const task of taskList) {
      console.log("taskListarr: " + JSON.stringify(task))
      taskListArr.push(task)
    }
  }
  console.log("returning: " + JSON.stringify(taskListArr))
  return taskListArr;
}

// Returns array of project keys
const getUsersProjects = function getUsersProjects(userId) {
  const usersProjects = []

  onValue(ref(apiFunctions.db, 'projects'), (snapshot) => {
    snapshot.forEach(function (projectSnapshot) {
      onValue(ref(apiFunctions.db, "projects/" + projectSnapshot.key + '/members'), (snapshot2) => {
        snapshot2.forEach(function (memberSnapshot) {
          if (memberSnapshot.val().memberId === userId) {
            // Keep track of key and values
            usersProjects.push([projectSnapshot.key, projectSnapshot.val()]);
          }
        });
      });
    })
  });

  console.log("returning: " + JSON.stringify(usersProjects))
  return usersProjects;
}

// Returns array of task keys
const getUsersAssignedTasks = function getUsersAssignedTasks(userId) {
  const usersAssignedTasks = []

  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
    snapshot.forEach(function (taskSnapshot) {
      console.log("user Id: " + userId)
      console.log("snapshot value: " + taskSnapshot.val().assignedUserId)
      if (taskSnapshot.val().assignedUserId === userId) {
        console.log("current key: ")
        usersAssignedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
      }
    })
  });

  return usersAssignedTasks;
}

// Returns array of task keys
const getUsersFollowedTasks = function getUsersFollowedTasks(userId) {
  const usersFollowedTasks = []

  onValue(ref(apiFunctions.db, 'tasks'), (snapshot) => {
    snapshot.forEach(function (taskSnapshot) {
      onValue(ref(apiFunctions.db, "tasks/" + taskSnapshot.key + '/followers'), (snapshot2) => {
        var found = false
        snapshot2.forEach(function (userSnapshot) {
          if (userSnapshot.val().followerId === userId && found === false) {
            // Keep track of key and values
            usersFollowedTasks.push([taskSnapshot.key, taskSnapshot.val()]);
            found = true
          }
        });
      });
    })
  });

  return usersFollowedTasks;
}

// Returns array of project keys
const getGroupsProjects = async function getGroupsProjects(groupId) {
  const groupsProjects = []
  const dbRef = ref(db);

  await get(child(dbRef, 'groups/' + groupId + `/projects`)).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      groupsProjects.push([childSnapshot.key, childSnapshot.val()]);
    })
  });

  return groupsProjects;
}

// Returns array of member keys and values
const getGroupsMembers = async function getGroupsMembers(lookVal, groupId) {
  const groupMembers = []
  const dbRef = ref(db);

  const groupMemberIds = []
  // accepted values: owners, members, viewers
  await get(child(dbRef, 'groups/' + groupId + `/` + lookVal)).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      groupMemberIds.push(childSnapshot.val().userId);
    })
  });

  for (const ids of groupMemberIds) {
    const tempUser = await getObjectById("users", ids)
    groupMembers.push(tempUser[0]);
  }

  return groupMembers;
}

// returns the value of the project in an array
const getProjectById = async function getProjectById(projectId) {
  const projectInfo = []

  if (projectId === "") {
    const dbRef = ref(db);
    await get(child(dbRef, `projects/`)).then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        projectInfo.push([childSnapshot.key, childSnapshot.val()]);
      })
    });
  } else {
    const dbRef = ref(db);
    await get(child(dbRef, `projects/` + projectId)).then((snapshot) => {
      projectInfo.push([snapshot.key, snapshot.val()]);
    });
  }

  return projectInfo;
}


const getTaskById = async function getTaskById(taskId) {
  const taskInfo = []

  if (taskId === "") {
    const dbRef = ref(db);
    await get(child(dbRef, `tasks/`)).then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        taskInfo.push([childSnapshot.key, childSnapshot.val()]);
      })
    });
  } else {
    const dbRef = ref(db);
    await get(child(dbRef, `tasks/` + taskId)).then((snapshot) => {
      taskInfo.push([snapshot.key, snapshot.val()]);
    });
  }

  return taskInfo;
}

const getObjectById = async function getObjectById(lookVal, id) {
  const retInfo = []
  const dbRef = ref(db);
  // accepted values: users, tasks, projects, groups
  if (id === "") {
    await get(child(dbRef, lookVal + `/`)).then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        retInfo.push([childSnapshot.key, childSnapshot.val()]);
      })
    });
  } else {
    await get(child(dbRef, lookVal + `/` + id)).then((snapshot) => {
      retInfo.push([snapshot.key, snapshot.val()]);
    });
  }

  return retInfo;
}

const getUserById = async function getUserById(userId) {
  const userInfo = []

  if (userId === "") {
    const dbRef = ref(db);
    await get(child(dbRef, `users/`)).then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        userInfo.push([childSnapshot.key, childSnapshot.val()]);
      })
    });
  } else {
    const dbRef = ref(db);
    await get(child(dbRef, `users/` + userId)).then((snapshot) => {
      userInfo.push([snapshot.key, snapshot.val()]);
    });
  }

  return userInfo;
}

const getUserByEmail = function getUserByEmail(email) {
  const userInfo = []

  onValue(ref(apiFunctions.db, 'users'), (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if (childSnapshot.val().email == email) {
        userInfo.push(childSnapshot.val());
      }
    })
  });

  return userInfo;
}

const getHoursByStatus = function getHoursByStatus(status, projectId) {
  var hours = 0;

  const taskListRef = ref(db, 'projects/' + projectId + '/tasks');

  onValue(taskListRef, (snapshot) => {
    snapshot.forEach(function (childSnapshot) {

      onValue(ref(apiFunctions.db, "tasks/" + childSnapshot.val().taskId), (taskSnapshot) => {
        if (taskSnapshot.val().status == status) {
          hours += taskSnapshot.val().estimatedTime;
        }
      });

    })
  });

  return hours;
}

// Returns T/F
const isTaskOwner = function isTaskOwner(userId, taskId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "tasks/" + taskId + "/ownerId"), (snapshot) => {
    if (snapshot.val() == userId) {
      isOwner.push(1);
    }
  });

  if (isOwner.length === 0) {
    return false;
  }
  return true;
}

// Returns T/F
const isProjectOwner = function isProjectOwner(userId, projectId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "projects/" + projectId + "/ownerId"), (snapshot) => {
    if (snapshot.val() == userId) {
      isOwner.push(1);
    }
  });

  if (isOwner.length === 0) {
    return false;
  }
  return true;
}

// Returns T/F
const isGroupOwner = function isGroupOwner(userId, groupId) {
  const isOwner = []

  onValue(ref(apiFunctions.db, "groups/" + groupId + "/ownerId"), (snapshot) => {
    if (snapshot.val() == userId) {
      isOwner.push(1);
    }
  });

  if (isOwner.length === 0) {
    return false;
  }
  return true;
}


/**
 * Given the id of a user, updates all of its properties with new data 
 * from the parameter
 * @param {string} id 
 * @param {string} email 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {*} profileDescription 
 * @param {*} notificationSetting 
 * @returns the id of the updated user
 */
const updateUser = (id, username, firstName, lastName, profileDescription, notificationSetting = "") => {
  const userListRef = ref(db, 'users/' + id);
  update(userListRef, {
    username: username,
    firstName: firstName,
    lastName: lastName,
    profileDescription: profileDescription,
    notificationSetting: notificationSetting,
  });

  return userListRef.key;
}

/**
 * Updates only the project details
 * @param {*} id 
 * @param {*} name 
 * @param {*} description 
 * @param {*} status 
 * @param {*} userId of user that made change 
 * @returns id of the updated project details
 */
const updateProjectDetails = (id, name, description, status, userId) => {
  const projectListRef = ref(db, 'projects/' + id);

  get(projectListRef).then((snapshot) => {
    if (name != snapshot.val().name) {
      addProjectHistoryEvent(id, "name", snapshot.val().name, name, userId);
    }
    if (description != snapshot.val().description) {
      addProjectHistoryEvent(id, "description", snapshot.val().description, description, userId);
    }
    if (status != snapshot.val().status) {
      addProjectHistoryEvent(id, "status", snapshot.val().status, status, userId);
    }
  });

  update(projectListRef, {
    name: name,
    description: description,
    status: status
  });

  return projectListRef.key;
}

/**
 * Updates a task detail. This will overwrite all existing data
 * @param {*} id 
 * @param {*} projectId 
 * @param {*} name 
 * @param {*} description 
 * @param {*} estimate 
 * @param {*} status 
 * @param {*} userId of user that made change 
 * @returns 
 */

const updateTaskDetails = (id, name, description, estimatedTime, status, userId) => {

  const taskListRef = ref(db, 'tasks/' + id);

  get(taskListRef).then((snapshot) => {
    if (name != snapshot.val().name) {
      addTaskHistoryEvent(id, "name", snapshot.val().name, name, userId);
    }
    if (description != snapshot.val().description) {
      addTaskHistoryEvent(id, "description", snapshot.val().description, description, userId);
    }
    if (estimatedTime != snapshot.val().estimatedTime) {
      addTaskHistoryEvent(id, "estimated time", snapshot.val().estimatedTime, estimatedTime, userId);
    }
    if (status != snapshot.val().status) {
      addTaskHistoryEvent(id, "status", snapshot.val().status, status, userId);
    }
  });


  update(taskListRef, {
    name: name,
    description: description,
    estimatedTime: estimatedTime,
    status: status,
  })

  return taskListRef.key
}

// Delete project/group member
// Delete project/group viewer
// Delete task follower
// Keys = "projectMember", "groupMember", "projectViewer", "groupViewer", or "taskFollower"
// id = groupId, projectId, or taskId
const deleteUserById = (key, userId, id) => {

  var bucket1;
  var bucket2;

  switch (key) {
    case "projectMember":
      bucket1 = "projects/"
      bucket2 = "/members"
      break;
    case "groupMember":
      bucket1 = "groups/"
      bucket2 = "/members"
      break;
    case "projectViewer":
      bucket1 = "projects/"
      bucket2 = "/viewers"
      break;
    case "groupViewer":
      bucket1 = "groups/"
      bucket2 = "/viewers"
      break;
    case "taskFollower":
      bucket1 = "tasks/"
      bucket2 = "/followers"
      break;
    default:
      break;
  }

  const link = bucket1 + id + bucket2;
  get(ref(db, link)).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if (bucket2 == "/members" && childSnapshot.val().memberId == userId) {
        remove(ref(db, link + "/" + childSnapshot.key));
      }
      if (bucket2 == "/viewers" && childSnapshot.val().viewerId == userId) {
        remove(ref(db, link + "/" + childSnapshot.key));
      }
      if (bucket2 == "/followers" && childSnapshot.val().followerId == userId) {
        remove(ref(db, link + "/" + childSnapshot.key));
      }
    });
  });
}


// Delete task
// Delete project (and all associated tasks)
// Delete group
// key = "group", "project", or "task"
const deleteItemById = (key, id) => {

  remove(ref(db, key + "s/" + id))
    .catch((error) => {
      console.log(error)
    })
}

/*****
 *  
 * Auth functions
 *
*****/

/* Asynchronous function that returns true or false with a message based
 * on the results from firebase.createUserWithEmailAndPassword
 * @param {string} email        email entered by the user in the textfield
 * @param {string} password     password entered by the user in the textfield
 */
async function tryCreateAccount(email, password) {
  //maybe initialize outside? -PJ
  //const auth = getAuth();
  let result = createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // We need to set user in context
      const user = userCredential.user;
      // for now print out user
      return { status: true, msg: "OK" };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //change these later to actually do something meaningfull
      console.log(errorCode);
      console.log(errorMessage);
      return { status: false, msg: error.message };
    });
  return result;
}

/*  Asynchronous function that returns true or false based on the
 *  results from firebase.signInWithEmailAndPassword
 *  @param {string} email       email entered by the user in the textfield
 *  @param {string} password    password entered by the user in the textfield
 */
const trySignInAccount = async (email, password) => {
  //also maybe initialize outside
  //const auth = getAuth();
  let result = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // user credential is correct, now signed in
      const user = userCredential.user;
      // TODO: return user information together with the boolean
      return { status: true, msg: "OK" };
    }).catch((error) => {
      // user crednetial not found
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      return { status: false, msg: error.message };
    });
  return result
}

//sign out account
const signOutAccount = () => {
  //once again probably initialize outside
  //const auth = getAuth();
  signOut(auth).then(() => {
    console.log("signed out successfully");
  }).catch((error) => {
    console.log("wasn't able to sign out :(");
  });
}

//context stuff

const storageUser = JSON.parse(localStorage.getItem('currentUser'));
const initialState = { user: storageUser ? storageUser : null };
const FirebaseAuthContext = React.createContext();
const FireBaseDispatchContext = React.createContext();

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(initialState.user);
  //const value = { user };

  React.useEffect(() => {
    //const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const searcher = user.email;
        const userListRef = ref(db, 'users');
        onValue(userListRef, (snapshot) => {
          snapshot.forEach(function (child) {
            const printing = child.val();
            // console.log(printing.email);
            // console.log(searcher);
            // console.log(printing.email === searcher);
            if (printing.email === searcher) {
              const saved = {
                info: {
                  email: printing.email,
                  firstName: printing.firstName,
                  profileDescription: printing.profileDescription,
                  notificationSetting: printing.notificationSetting
                }, key: child.key
              };
              // console.log("signed in and set user");
              // console.log(saved);
              setUser(saved);
              localStorage.setItem('currentUser', JSON.stringify(saved));
            }
          })
        });
      }
      else {
        console.log("signed out");
        setUser(null);
        localStorage.setItem('currentUser', JSON.stringify(null));
      }
    });
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user }}>
      <FireBaseDispatchContext.Provider value={setUser}>
        {children}
      </FireBaseDispatchContext.Provider>
    </FirebaseAuthContext.Provider>
  );
};

function useFirebaseAuth() {
  const context = React.useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    );
  }
  //console.log("haha");
  //console.log(context);
  return context.user;
}

function useFirebaseDispatch() {
  const context = React.useContext(FireBaseDispatchContext);
  if (context === undefined) {
    throw new Error('dispatch must be used within Firebase Dispatch');
  }
  return context;
}


//wrap all functions up to export all at the same time
//considering moving the authentication functions to a different file? - PJ
const apiFunctions = {
  createNewUser,
  createNewGroup,
  changeGroupOwner,
  addNewProjectToGroup,
  createNewProject,
  getObjectById,
  getGroupsMembers,
  changeProjectOwner,
  addTaskToProject,
  addNewViewerToGroup,
  addProjectViewer,
  addProjectMember,
  changeTaskAssignedUser,
  changeTaskStatus,
  addTaskFollower,
  changeTaskOwner,
  createNewTask,
  getTaskHistory,
  getProjectHistory,
  getGroupsProjects,
  getProjectsTasks,
  getGroupsTasks,
  getUsersProjects,
  getUsersAssignedTasks,
  getUsersFollowedTasks,
  getUserById,
  getUserByEmail,
  getProjectById,
  getTaskById,
  getHoursByStatus,
  isTaskOwner,
  isGroupOwner,
  isProjectOwner,
  tryCreateAccount,
  trySignInAccount,
  signOutAccount,
  updateUser,
  updateProjectDetails,
  updateTaskDetails,
  deleteItemById,
  deleteUserById,
  db,
  app,
  FirebaseAuthProvider, useFirebaseAuth, useFirebaseDispatch,
  deleteProjectComment, updateProjectComment, deleteTaskComment,
  updateTaskComment, getNotifications, deleteNotifications,
  getTaskComments, getTaggedComments, createNewComment,
  createNewProjectComment, getProjectComments,
  auth
};

export default apiFunctions;
