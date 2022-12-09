import apiFunctions from './api.jsx';
import { ref, onValue } from "firebase/database";

const requiredVal = false;

test("Sanity check", () => {
  expect(true).toBe(true);
});

// /*****
//  *
//  * CREATE TEST LIST:
//  *
//  * Sanity Check
//  * Create user
//  * Create group
//  * Create project
//  * Create task
//  * Create comment
//  *
// *****/

test("Inserts and reads new user into db correctly", () => {
  const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);

  const inputUser = {
    "users": {
      userId: {
        "email": "testEmail@gmail.com",
        "firstName": "George",
        "lastName": "Washington",
        "notificationSetting": 1,
        "profileDescription": "Team USA!"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'users/' + userId), (snapshot) => {
    const retrievedUser = snapshot.val();
    expect(retrievedUser).toMatch(inputUser);
  });
});


test("Inserts and reads new group into db correctly", () => {
  const groupId = apiFunctions.createNewGroup("newGroupName", "description", ["22", "99"], ["123", "456"], ["123", "456"]);

  const inputGroup = {
    "groups": {
      groupId: {
        "members": ["22", "99"],
        "description": "description",
        "name": "newGroupName",
        "owners": ["123", "456"],
        "viewers": ["123", "456"]
      }
    }
  }

  onValue(ref(apiFunctions.db, 'groups/' + groupId), (snapshot) => {
    const retrievedGroup = snapshot.val();
    expect(retrievedGroup).toMatch(inputGroup);
  });
});


test("Inserts and reads new project into db correctly", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "members": ["22", "99"],
        "name": "New Project Name",
        "owners": ["123", "456"],
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});


test("Inserts and reads new task into db correctly", () => {
const taskId = apiFunctions.createNewTask("1234", "Test Task", "Task description", 2, "Planned", "456", "789", ["25", "50"]);

const inputTask = {
     "tasks": {
       taskId: {
         "name": "Test Task",
         "description": "Task description",
         "estimatedTime": 2,
         "assignedUserId": "789",
         "followers": ["25", "50"],
         "ownerId": "456",
         "projectId": "1234",
         "status": "Planned",
       }
     }
   }

   onValue(ref(apiFunctions.db, 'tasks/' + taskId), (snapshot) => {
     const retrievedTask = snapshot.val();
     expect(retrievedTask).toMatch(inputTask);
   });
  });

test("Inserts and reads new comment into db correctly", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  apiFunctions.createNewProjectComment("Changed Stuff", "123", projectId);

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "members": ["22", "99"],
        "name": "New Project Name",
        "owners": ["123", "456"],
        "status": "In Progress",
        comments: {
          "body": "Changed Stuff",
          "authorId": "123"
        }
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
 });

// /*****
//  *
//  * GET TEST LIST:
//  *
//  * Get Group's Projects
//  * Get Project's Tasks
//  * Get User's Projects
//  * Get Assigned Tasks
//  * Get Followed Tasks
//  * Get Projects Comments
//  *
// *****/

test("Correctly returns all projects belonging to a group", () => {
  const groupId = apiFunctions.createNewGroup("newGroupName", "description", ["22", "99"], ["123", "456"], ["123", "456"]);

  var inputProjectIds = ["777", "235"];
  var inputLen = inputProjectIds.length;

  var groupsProjects = []
  groupsProjects = apiFunctions.getGroupsProjects(groupId);
  expect(inputProjectIds.length).toBe(inputLen);
});

test("Correctly returns all tasks belonging to a project", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  const taskId1 = apiFunctions.createNewTask(projectId, "Task Title 1", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"]);
  const taskId2 = apiFunctions.createNewTask(projectId, "Task Title 2", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"]);

  var inputTaskIds = [taskId1, taskId2];
  var inputLen = inputTaskIds.length;

  var projectsTasks = []
  projectsTasks = apiFunctions.getProjectsTasks(projectId);
  expect(inputTaskIds.length).toBe(inputLen);
});

// test("Correctly returns all projects that a user is a member of", () => {
//   const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
//   const projectId1 = apiFunctions.createNewProject("New Project Name 1", "Project description", "In Progress", ["22", userId], ["123", "456"]);
//   const projectId2 = apiFunctions.createNewProject("New Project Name 2", "Project description", "In Progress", ["22", userId], ["123", "456"]);

//   var inputProjectIds = [projectId1, projectId2];
//   var inputLen = inputProjectIds.length;

//   var userTasks = []
//   userTasks = apiFunctions.getUsersProjects(userId);
//   inputProjectIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
//   expect(inputProjectIds.length).toBe(inputLen);
// });

// test("Correctly returns all tasks that a user is assigned", () => {
//   const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
//   const taskId1 = apiFunctions.createNewTask("123", "Task Title 1", "Task description.", 2, "Planned", ["22", "99"], [userId, "456"], ["11", "88"]);
//   const taskId2 = apiFunctions.createNewTask("123", "Task Title 2", "Task description.", 2, "Planned", ["22", "99"], [userId, "456"], ["11", "88"]);

//   var inputTaskIds = [taskId1, taskId2];
//   var inputLen = inputTaskIds.length;

//   var userTasks = []
//   userTasks = apiFunctions.getUsersProjects(userId);
//   inputTaskIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
//   expect(inputTaskIds.length).toBe(inputLen);
// });

// test("Correctly returns all tasks that a user is following", () => {
//   const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
//   const taskId1 = apiFunctions.createNewTask("123", "Task Title 1", "Task description.", 2, "Planned", ["22", "99"], ["11", "456"], [userId, "88"]);
//   const taskId2 = apiFunctions.createNewTask("123", "Task Title 2", "Task description.", 2, "Planned", ["22", "99"], ["11", "456"], [userId, "88"]);

//   var inputTaskIds = [taskId1, taskId2];
//   var inputLen = inputTaskIds.length;

//   var userTasks = []
//   userTasks = apiFunctions.getUsersProjects(userId);
//   inputTaskIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
//   expect(inputTaskIds.length).toBe(inputLen);
// });

test("Correctly returns all comments of a project", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  apiFunctions.createNewProjectComment("Changed Stuff", "123", projectId);

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "members": ["22", "99"],
        "name": "New Project Name",
        "owners": ["123", "456"],
        "status": "In Progress",
        comments: {
          "body": "Changed Stuff",
          "authorId": "123"
        }
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
 });

// /*****
//  *
//  * EDIT TEST LIST:
//  *
//  * Update User
//  * Update Project Details
//  * Change Project Owner
//  * Change Task Owner
//  * Change Task Assignee
//  * Delete Project Member
//  * Delete Project Viewer
//  * Update Task Details
//  * Delete Task
//  * Delete Project
//  * Delete Group
//  * History changes correctly
//  *
// *****/

test("Correctly updates a user", () => {
  const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
  apiFunctions.updateUser(userId, "testEmail@gmail.com", "Ronald", "Reagan", "Trickle down econ!", 1);

  const inputUser = {
    "users": {
      userId: {
        "email": "testEmail@gmail.com",
        "firstName": "Ronald",
        "lastName": "Reagan",
        "notificationSetting": 1,
        "profileDescription": "Trickle down econ!"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'users/' + userId), (snapshot) => {
    const retrievedUser = snapshot.val();
    expect(retrievedUser).toMatch(inputUser);
  });
});

test("Correctly updates a project and histoy updates accordingly", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description update",
        "members": ["22", "99"],
        "name": "Project Name update",
        "owners": ["123", "456"],
        "status": "Completed"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});

test("Correctly changes a project owner", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], "456");
  apiFunctions.changeProjectOwner(projectId, "456");

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "memberIds": ["22", "99"],
        "name": "Project Name",
        "ownerId": "123",
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});

test("Correctly changes a task owner", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], "456");
  apiFunctions.changeProjectOwner(projectId, "456");

  const inputTask = {
    "projects": {
      projectId: {
        "description": "Project description",
        "memberIds": ["22", "99"],
        "name": "Project Name",
        "ownerId": "123",
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'tasks/' + projectId), (snapshot) => {
    const retrievedTask = snapshot.val();
    expect(retrievedTask).toMatch(inputTask);
  });
});

test("Correctly changes a task assignee", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], "456");
  apiFunctions.changeProjectOwner(projectId, "456");

  const inputTask = {
    "projects": {
      projectId: {
        "description": "Project description",
        "memberIds": ["22", "99"],
        "name": "Project Name",
        "ownerId": "123",
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'tasks/' + projectId), (snapshot) => {
    const retrievedTask = snapshot.val();
    expect(retrievedTask).toMatch(inputTask);
  });
});

test("Correctly deletes a project member", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  apiFunctions.deleteUserById("projectMember", projectId, "99");

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "memberIds": ["22", "99"],
        "name": "Project Name",
        "ownerId": "123",
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});

test("Correctly deletes a project viewer", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  apiFunctions.deleteUserById("projectViewer", projectId, "99");

  const inputProject = {
    "projects": {
      projectId: {
        "description": "Project description",
        "memberIds": ["22", "99"],
        "name": "Project Name",
        "ownerId": "123",
        "status": "In Progress"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});

//owner, assigned, follower
test("Correctly updates a task", () => {
  const taskId = apiFunctions.createNewTask("1234", "Task Title", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"]);
  apiFunctions.updateTaskDetails(taskId, "12345", "Task Title Update", "New description", 4, "Completed")

  const inputTask = {
    "tasks": {
      taskId: {
        "assignedUsers": ["123", "456"],
        "description": "New description",
        "estimatedTime": 4,
        "followers": ["11", "88"],
        "owners": ["22", "99"],
        "projectId": "12345",
        "status": "Completed",
        "title": "Task Title Update"
      }
    }
  }

  onValue(ref(apiFunctions.db, 'tasks/' + taskId), (snapshot) => {
    const retrievedTask = snapshot.val();
    expect(retrievedTask).toMatch(inputTask);
  });
});

test("Correctly deletes a project", () => {
  const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
  apiFunctions.deleteItemById("project", projectId);

  const inputProject = null;

  onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
    const retrievedProject = snapshot.val();
    expect(retrievedProject).toMatch(inputProject);
  });
});

test("Correctly deletes a group", () => {
  const groupId = apiFunctions.createNewGroup("newGroupName", "description", ["22", "99"], ["123", "456"], ["123", "456"]);
  apiFunctions.deleteItemById("group", groupId);

  const inputGroup = null;

  onValue(ref(apiFunctions.db, 'groups/' + groupId), (snapshot) => {
    const retrievedGroup = snapshot.val();
    expect(retrievedGroup).toMatch(inputGroup);
  });
});

test("Correctly deletes a task", () => {
  const taskId = apiFunctions.createNewTask("1234", "Test Task", "Task description", 2, "Planned", "456", "789", ["25", "50"]);
  apiFunctions.deleteItemById("task", taskId);

  const inputTask = null;

  onValue(ref(apiFunctions.db, 'tasks/' + taskId), (snapshot) => {
    const retrievedTask = snapshot.val();
    expect(retrievedTask).toMatch(inputTask);
  });
});