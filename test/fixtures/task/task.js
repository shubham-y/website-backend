const userData = require("../user/user")();
const { DINERO, NEELAM } = require("../../../constants/wallets");

const appOwner = userData[3];
/**
 * Import fixtures
 *
 * Sample tasks for tests
 *
 * @return {Object}
 */
module.exports = () => {
  return [
    {
      title: "Test task",
      type: "feature",
      endsOn: 1234,
      startedOn: 4567,
      status: "active",
      percentCompleted: 10,
      participants: [],
      assignee: appOwner.username,
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      isNoteworthy: true,
    },
    {
      title: "Test task",
      purpose: "To Test mocha",
      featureUrl: "<testUrl>",
      type: "group",
      links: ["test1"],
      endsOn: 1234,
      startedOn: 54321,
      status: "completed",
      percentCompleted: 10,
      dependsOn: ["d12", "d23"],
      participants: [appOwner.username],
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      isNoteworthy: false,
    },
    {
      title: "Test task - Create",
      type: "feature",
      endsOn: 123,
      startedOn: 456,
      status: "completed",
      percentCompleted: 10,
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      assignee: appOwner.username,
      participants: [],
    },
    {
      title: "Test task - Create",
      type: "feature",
      endsOn: 123,
      startedOn: 456,
      status: "completed",
      percentCompleted: 10,
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      assignee: "dummyUser",
      participants: [],
    },
    {
      title: "Test task - Create",
      type: "feature",
      endsOn: 123,
      startedOn: 456,
      status: "completed",
      percentCompleted: 10,
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      assignee: appOwner.username,
      participants: ["dummyUser"],
    },
    {
      title: "Assigned task",
      purpose: "To Test mocha",
      featureUrl: "<testUrl>",
      type: "group",
      links: ["test1"],
      endsOn: "<unix timestamp>",
      startedOn: "<unix timestamp>",
      status: "active",
      percentCompleted: 10,
      dependsOn: ["d12", "d23"],
      participants: ["user1"],
      completionAward: { [DINERO]: 3, [NEELAM]: 300 },
      lossRate: { [DINERO]: 1 },
      isNoteworthy: true,
    },
  ];
};
