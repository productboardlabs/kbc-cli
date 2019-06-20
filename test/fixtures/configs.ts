export default [
  {
    id: "1",
    name: "test-bucket",
    description: "Test config",
    created: "2016-10-18T15:42:39+0200",
    creatorToken: {
      id: 60249,
      description: "user@email.com"
    },
    version: 10,
    changeDescription: "Some description",
    isDeleted: false,
    configuration: {},
    rowsSortOrder: [],
    rows: [
      {
        id: "2",
        name: "test",
        description: "out.c-main.team_members_snapshot\n",
        configuration: {
          output: [
            {
              source: "team_members_snapshot",
              destination: "out.c-main.team_members_snapshot",
              primaryKey: ["snapshot_id"],
              incremental: true
            }
          ],
          queries: ["SELECT 1+1;"],
          input: [],
          name: "test",
          packages: [],
          requires: [],
          backend: "snowflake",
          type: "simple",
          id: "3",
          phase: 1,
          disabled: false,
          description: ""
        },
        isDisabled: false,
        version: 8,
        created: "2016-10-18T15:43:05+0200",
        creatorToken: {
          id: 60249,
          description: "user@email.com"
        },
        changeDescription: "Update description",
        state: {}
      }
    ],
    state: {},
    currentVersion: {
      created: "2019-06-13T11:30:49+0200",
      creatorToken: {
        id: 145141,
        description: "user@email.com"
      },
      changeDescription: "Delete input mapping in Space metrics precomputed"
    }
  }
];
