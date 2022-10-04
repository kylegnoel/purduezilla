import apiFunctions from './api.jsx';
import { ref, onValue } from "firebase/database";

test("Sanity check", () => {
    expect(true).toBe(true);
});

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


