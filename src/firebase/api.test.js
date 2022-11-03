import apiFunctions from './api.jsx';
import { ref, onValue } from "firebase/database";

const requiredVal = false;

test("Sanity check", () => {
    expect(true).toBe(true);
});

/*****
 *  
 * CREATE TEST LIST:
 * 
 * Sanity Check
 * Create user
 * Create group
 * Create project
 * Create task
 *
*****/

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
    const groupId = apiFunctions.createNewGroup("newGroupName", ["22", "99"], ["123", "456"]);

    const inputGroup = {
      "groups": {
        groupId: {
          "members": ["22", "99"],
          "name": "newGroupName",
          "owners": ["123", "456"]
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
    const taskId = apiFunctions.createNewTask("1234", "Task Title", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"], ["25", "50"]);

    const inputTask = {
      "tasks": {
        taskId: {
          "assignedUsers": ["11", "88"],
          "description": "Task description",
          "estimatedTime": 2,
          "followers": ["25", "50"],
          "owners": ["123", "456"],
          "permittedUsers": ["22", "99"],
          "projectId": "1234",
          "status": "Planned",
          "title": "Task Title"
        }
      }
    }

    onValue(ref(apiFunctions.db, 'tasks/' + taskId), (snapshot) => {
        const retrievedTask = snapshot.val();
        expect(retrievedTask).toMatch(inputTask);
      });
});

/*****
 *  
 * GET TEST LIST:
 * 
 * Get Group's Projects
 * Get Project's Tasks
 * Get User's Projects
 * Get Assigned Tasks
 * Get Followed Tasks
 *
*****/

test("Correctly returns all projects belonging to a group", () => {
    const groupId = apiFunctions.createNewGroup("newGroupName", ["22", "99"], ["123", "456"], ["777", "235"]);

    var inputProjectIds = ["777", "235"];
    var inputLen = inputProjectIds.length;

    var groupsProjects = []
    groupsProjects = apiFunctions.getGroupsProjects(groupId);
    inputProjectIds.forEach(id => expect(groupsProjects.includes(id)).toBe(requiredVal));
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
    inputTaskIds.forEach(id => expect(projectsTasks.includes(id)).toBe(requiredVal));
    expect(inputTaskIds.length).toBe(inputLen);
});

test("Correctly returns all projects that a user is a member of", () => {
    const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
    const projectId1 = apiFunctions.createNewProject("New Project Name 1", "Project description", "In Progress", ["22", userId], ["123", "456"]);
    const projectId2 = apiFunctions.createNewProject("New Project Name 2", "Project description", "In Progress", ["22", userId], ["123", "456"]);

    var inputProjectIds = [projectId1, projectId2];
    var inputLen = inputProjectIds.length;

    var userTasks = []
    userTasks = apiFunctions.getUsersProjects(userId);
    inputProjectIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
    expect(inputProjectIds.length).toBe(inputLen);
});

test("Correctly returns all tasks that a user is assigned", () => {
    const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
    const taskId1 = apiFunctions.createNewTask("123", "Task Title 1", "Task description.", 2, "Planned", ["22", "99"], [userId, "456"], ["11", "88"]);
    const taskId2 = apiFunctions.createNewTask("123", "Task Title 2", "Task description.", 2, "Planned", ["22", "99"], [userId, "456"], ["11", "88"]);

    var inputTaskIds = [taskId1, taskId2];
    var inputLen = inputTaskIds.length;

    var userTasks = []
    userTasks = apiFunctions.getUsersProjects(userId);
    inputTaskIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
    expect(inputTaskIds.length).toBe(inputLen);
});

test("Correctly returns all tasks that a user is following", () => {
    const userId = apiFunctions.createNewUser("testEmail@gmail.com", "George", "Washington", "Team USA!", 1);
    const taskId1 = apiFunctions.createNewTask("123", "Task Title 1", "Task description.", 2, "Planned", ["22", "99"], ["11", "456"], [userId, "88"]);
    const taskId2 = apiFunctions.createNewTask("123", "Task Title 2", "Task description.", 2, "Planned", ["22", "99"], ["11", "456"], [userId, "88"]);

    var inputTaskIds = [taskId1, taskId2];
    var inputLen = inputTaskIds.length;

    var userTasks = []
    userTasks = apiFunctions.getUsersProjects(userId);
    inputTaskIds.forEach(id => expect(userTasks.includes(id)).toBe(requiredVal));
    expect(inputTaskIds.length).toBe(inputLen);
});

/*****
 *  
 * EDIT TEST LIST:
 * 
 * Update User
 * Update Project Details
 * Delete Project Owners
 * Delete Project Members
 * Update Task Details
 * Delete Task Assigned Users
 * Delete Task Owners
 *
*****/

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

test("Correctly updates a project", () => {
    const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
    apiFunctions.updateProjectDetails(projectId, "New Project Name update", "Project description update", "Completed");

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

test("Correctly deletes a project owner", () => {
    const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
    apiFunctions.deleteProjectOwners(projectId, ["456"]);

    const inputProject = {
      "projects": {
        projectId: {
          "description": "Project description",
          "members": ["22", "99"],
          "name": "Project Name",
          "owners": ["123"],
          "status": "In Progress"
        }
      }
    }

    onValue(ref(apiFunctions.db, 'projects/' + projectId), (snapshot) => {
        const retrievedProject = snapshot.val();
        expect(retrievedProject).toMatch(inputProject);
      });
});

test("Correctly deletes a project member", () => {
    const projectId = apiFunctions.createNewProject("New Project Name", "Project description", "In Progress", ["22", "99"], ["123", "456"]);
    apiFunctions.deleteProjectMembers(projectId, ["99"]);

    const inputProject = {
      "projects": {
        projectId: {
          "description": "Project description",
          "members": ["22"],
          "name": "Project Name",
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

test("Correctly deletes an assigned user from task", () => {
    const taskId = apiFunctions.createNewTask("1234", "Task Title", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"]);
    apiFunctions.deleteTaskAssignedUsers(taskId, ["123"])

    const inputTask = {
      "tasks": {
        taskId: {
          "assignedUsers": ["456"],
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

test("Correctly deletes an owner from task", () => {
    const taskId = apiFunctions.createNewTask("1234", "Task Title", "Task description.", 2, "Planned", ["22", "99"], ["123", "456"], ["11", "88"]);
    apiFunctions.deleteTaskOwners(taskId, ["99"])

    const inputTask = {
      "tasks": {
        taskId: {
          "assignedUsers": ["123", "456"],
          "description": "New description",
          "estimatedTime": 4,
          "followers": ["11", "88"],
          "owners": ["22"],
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
