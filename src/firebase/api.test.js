import apiFunctions from './api.jsx';
import { ref, onValue } from "firebase/database";

test("Sanity check", () => {
    expect(true).toBe(true);
});

test("Inserts new user into db correctly", () => {
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

/*
test("Inserts new group into db correctly", () => {
    const groupId = apiFunctions.createNewUser("newGroupName", ["22", "99"], ["123", "456"]);

    const inputGroup = {
      "tasks": {
        groupId: {
          "members": { "22", "99" }
          "name": "newGroupName",
          "owners": { "123", "456" }
        }
      }
    }

    onValue(ref(apiFunctions.db, 'groups/' + groupId), (snapshot) => {
        const retrievedGroup = snapshot.val();
        expect(retrievedGroup).toMatch(inputGroup);
      });
});
*/


